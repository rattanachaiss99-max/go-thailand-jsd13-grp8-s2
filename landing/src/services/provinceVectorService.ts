'use client';

import { useState, useEffect } from 'react';

export interface ProvinceVectorData {
  viewBox: string;
  width: number;
  height: number;
  d: string;
}

// Global In-Memory Cache for Client Session (0ms instant access)
const vectorCache = new Map<string, ProvinceVectorData>();
const inFlightRequests = new Map<string, Promise<ProvinceVectorData | null>>();
const loadedRegions = new Set<string>();

/**
 * Storage Helper for browser-level caching across page navigations
 */
function getStorageVector(key: string): ProvinceVectorData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(`gt_vec_${key}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function setStorageVector(key: string, data: ProvinceVectorData): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(`gt_vec_${key}`, JSON.stringify(data));
  } catch {}
}

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
  if (!key) return null;

  // 1. In-Memory Cache
  if (vectorCache.has(key)) {
    return vectorCache.get(key)!;
  }

  // 2. SessionStorage Cache
  const storageData = getStorageVector(key);
  if (storageData) {
    vectorCache.set(key, storageData);
    return storageData;
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

  // 2. Check browser session storage
  const storageData = getStorageVector(key);
  if (storageData) {
    vectorCache.set(key, storageData);
    return storageData;
  }

  // 3. Reuse pending in-flight request to avoid duplicate network calls
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)!;
  }

  // 4. Initiate fetch from MongoDB Atlas REST API
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

          // Cache in memory and browser session
          vectorCache.set(key, vData);
          setStorageVector(key, vData);

          if (json.province?.slug) {
            const sKey = normalizeProvinceKey(json.province.slug);
            vectorCache.set(sKey, vData);
            setStorageVector(sKey, vData);
          }
          if (json.province?.provinceId) {
            const idKey = normalizeProvinceKey(json.province.provinceId);
            vectorCache.set(idKey, vData);
            setStorageVector(idKey, vData);
          }
          return vData;
        }
      }
    } catch (err) {
      console.warn(`[ProvinceVectorService] API fetch failed for province "${key}":`, err);
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
  if (!normRegion) return 0;

  if (loadedRegions.has(normRegion)) {
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
            const nKey = normalizeProvinceKey(key);
            vectorCache.set(nKey, vData);
            setStorageVector(nKey, vData);

            if (item.slug) {
              const sKey = normalizeProvinceKey(item.slug);
              vectorCache.set(sKey, vData);
              setStorageVector(sKey, vData);
            }
            if (item.provinceId) {
              const idKey = normalizeProvinceKey(item.provinceId);
              vectorCache.set(idKey, vData);
              setStorageVector(idKey, vData);
            }
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
            setError('Vector data not found in MongoDB Atlas');
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

/**
 * React Hook to access all province vectors in a region from MongoDB Atlas
 */
export function useRegionVectors(region: string) {
  const normRegion = region?.toLowerCase().trim();
  const [vectors, setVectors] = useState<Record<string, ProvinceVectorData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!normRegion) {
      setVectors({});
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    prefetchRegionVectors(normRegion)
      .then(() => {
        if (!isMounted) return;
        const result: Record<string, ProvinceVectorData> = {};
        vectorCache.forEach((v, k) => {
          result[k] = v;
        });
        setVectors(result);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Failed to load region vectors');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [normRegion]);

  return { vectors, isLoading, error };
}
