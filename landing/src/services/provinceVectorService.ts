'use client';

import { useState, useEffect } from 'react';
import { getProvinceSvgData, ProvinceSvgData } from '@/data/northernProvincesSvg';

export interface ProvinceVectorData {
  viewBox: string;
  width: number;
  height: number;
  d: string;
}

// Global In-Memory Cache for Client Session
const vectorCache = new Map<string, ProvinceVectorData>();
const inFlightRequests = new Map<string, Promise<ProvinceVectorData | null>>();
const loadedRegions = new Set<string>();

/**
 * Normalize slug or province ID for consistent cache keys
 */
export function normalizeProvinceKey(slugOrId: string): string {
  if (!slugOrId) return '';
  return slugOrId.toLowerCase().trim().replace(/[-_]province$/, '');
}

/**
 * Synchronous cache lookup (instant 0ms)
 */
export function getCachedProvinceVector(slugOrId: string): ProvinceVectorData | null {
  const key = normalizeProvinceKey(slugOrId);
  if (vectorCache.has(key)) {
    return vectorCache.get(key)!;
  }
  return null;
}

/**
 * Fetch a single province SVG vector from MongoDB Atlas via API
 */
export async function fetchProvinceVector(slugOrId: string): Promise<ProvinceVectorData | null> {
  const key = normalizeProvinceKey(slugOrId);
  if (!key) return null;

  // 1. Check in-memory cache
  if (vectorCache.has(key)) {
    return vectorCache.get(key)!;
  }

  // 2. Reuse pending in-flight request to avoid duplicate network calls
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)!;
  }

  // 3. Initiate fetch from MongoDB API
  const requestPromise = (async () => {
    try {
      const res = await fetch(`/api/provinces/vectors/${encodeURIComponent(key)}`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 86400 }
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.success && json?.vectorData) {
          const vData: ProvinceVectorData = {
            viewBox: json.vectorData.viewBox,
            width: Number(json.vectorData.width) || 200,
            height: Number(json.vectorData.height) || 200,
            d: json.vectorData.d
          };
          // Cache by slug and provinceId
          vectorCache.set(key, vData);
          if (json.province?.slug) {
            vectorCache.set(normalizeProvinceKey(json.province.slug), vData);
          }
          if (json.province?.provinceId) {
            vectorCache.set(normalizeProvinceKey(json.province.provinceId), vData);
          }
          return vData;
        }
      }
    } catch (err) {
      console.warn(`[ProvinceVectorService] API fetch failed for ${key}, falling back to static backup:`, err);
    }

    // 4. Graceful fallback to local static data if MongoDB is unreachable
    const fallback = getProvinceSvgData(key);
    if (fallback) {
      const fallbackData: ProvinceVectorData = {
        viewBox: fallback.viewBox,
        width: fallback.width,
        height: fallback.height,
        d: fallback.d
      };
      vectorCache.set(key, fallbackData);
      return fallbackData;
    }

    return null;
  })().finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, requestPromise);
  return requestPromise;
}

/**
 * Batch prefetch all province vectors in a region from MongoDB Atlas
 */
export async function prefetchRegionVectors(region: string): Promise<number> {
  const normRegion = region?.toLowerCase().trim();
  if (!normRegion || loadedRegions.has(normRegion)) {
    return 0;
  }

  try {
    const url = normRegion === 'all' 
      ? '/api/provinces/vectors' 
      : `/api/provinces/vectors?region=${encodeURIComponent(normRegion)}`;

    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 86400 }
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.vectors) {
        let loadedCount = 0;
        for (const [key, item] of Object.entries<any>(json.vectors)) {
          if (item?.vectorData) {
            const vData: ProvinceVectorData = {
              viewBox: item.vectorData.viewBox,
              width: Number(item.vectorData.width) || 200,
              height: Number(item.vectorData.height) || 200,
              d: item.vectorData.d
            };
            vectorCache.set(normalizeProvinceKey(key), vData);
            if (item.slug) vectorCache.set(normalizeProvinceKey(item.slug), vData);
            if (item.provinceId) vectorCache.set(normalizeProvinceKey(item.provinceId), vData);
            loadedCount++;
          }
        }
        loadedRegions.add(normRegion);
        return loadedCount;
      }
    }
  } catch (err) {
    console.warn(`[ProvinceVectorService] Failed to prefetch region ${region}:`, err);
  }

  return 0;
}

/**
 * React Hook to access province vector with automatic on-demand loading from MongoDB Atlas
 */
export function useProvinceVector(
  slugOrId?: string,
  initialVectorData?: ProvinceVectorData | null
) {
  const key = normalizeProvinceKey(slugOrId || '');
  
  // Try synchronous cache first
  const cached = key ? getCachedProvinceVector(key) : null;
  const initial = initialVectorData || cached;

  const [vectorData, setVectorData] = useState<ProvinceVectorData | null>(initial);
  const [isLoading, setIsLoading] = useState<boolean>(!initial && Boolean(key));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) {
      setVectorData(null);
      setIsLoading(false);
      return;
    }

    // Check cache synchronously
    const syncCached = getCachedProvinceVector(key);
    if (syncCached) {
      setVectorData(syncCached);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchProvinceVector(key)
      .then((data) => {
        if (isMounted) {
          if (data) {
            setVectorData(data);
          } else {
            setError('Vector data not found');
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to load vector');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [key]);

  return { vectorData, isLoading, error, isFromMongo: Boolean(vectorData) };
}
