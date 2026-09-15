'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ProvinceMapConfig,
  MapPointFeature,
  MapLineFeature,
  MapAreaFeature,
  getProvinceMapConfig
} from '@/data/provinceMapData';

// In-Memory cache for loaded province configurations
const provinceConfigCache = new Map<string, ProvinceMapConfig>();

/**
 * Fetch province map config with vectors from API or fallback to built-in data
 */
export async function fetchProvinceMapConfig(slug: string): Promise<ProvinceMapConfig> {
  const normSlug = (slug || 'chiang-rai').toLowerCase().trim().replace(/[-_]province$/, '');

  if (provinceConfigCache.has(normSlug)) {
    return provinceConfigCache.get(normSlug)!;
  }

  try {
    const res = await fetch(`/api/maps/province-features?province=${encodeURIComponent(normSlug)}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.config) {
        provinceConfigCache.set(normSlug, json.config);
        return json.config;
      }
    }
  } catch (err) {
    console.warn(`[ProvinceMapService] Remote API fetch fallback to local for "${normSlug}":`, err);
  }

  // Fallback to local high-fidelity master data
  const localConfig = getProvinceMapConfig(normSlug);
  provinceConfigCache.set(normSlug, localConfig);
  return localConfig;
}

/**
 * Search features (Points, Lines, Areas) using Semantic Vector Search or Fuzzy Keyword Match
 */
export async function searchFeatures(
  query: string,
  provinceSlug: string
): Promise<{
  points: MapPointFeature[];
  lines: MapLineFeature[];
  areas: MapAreaFeature[];
  source: 'vector' | 'keyword';
}> {
  const clean = query?.trim();
  if (!clean) {
    return { points: [], lines: [], areas: [], source: 'keyword' };
  }

  try {
    const res = await fetch('/api/maps/vector-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: clean, province: provinceSlug })
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.success) {
        return {
          points: json.points || [],
          lines: json.lines || [],
          areas: json.areas || [],
          source: json.source || 'vector'
        };
      }
    }
  } catch (err) {
    console.warn('[ProvinceMapService] Vector search error, fallback to local search:', err);
  }

  // Local fallback keyword matching
  const config = getProvinceMapConfig(provinceSlug);
  const qLower = clean.toLowerCase();

  const matchedPoints = config.points.filter((p) => {
    return (
      p.name.toLowerCase().includes(qLower) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(qLower)) ||
      (p.district && p.district.toLowerCase().includes(qLower)) ||
      p.description.toLowerCase().includes(qLower) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(qLower)))
    );
  });

  const matchedLines = config.lines.filter((l) => {
    return (
      l.name.toLowerCase().includes(qLower) ||
      (l.hwy && l.hwy.toLowerCase().includes(qLower)) ||
      (l.description && l.description.toLowerCase().includes(qLower))
    );
  });

  const matchedAreas = config.areas.filter((a) => {
    return (
      a.name.toLowerCase().includes(qLower) ||
      (a.description && a.description.toLowerCase().includes(qLower))
    );
  });

  return {
    points: matchedPoints,
    lines: matchedLines,
    areas: matchedAreas,
    source: 'keyword'
  };
}

/**
 * Custom React Hook to handle province map state, layer filters, and feature inspection
 */
export function useProvinceMap(initialProvinceSlug: string = 'chiang-rai') {
  const [currentProvince, setCurrentProvince] = useState<string>(initialProvinceSlug);
  const [config, setConfig] = useState<ProvinceMapConfig>(() => getProvinceMapConfig(initialProvinceSlug));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<{
    type: 'point' | 'line' | 'area';
    data: any;
  } | null>(null);

  // Layer switches (Matching the screenshot: จุด, เส้น, พื้นที่)
  const [showPoints, setShowPoints] = useState<boolean>(true);
  const [showLines, setShowLines] = useState<boolean>(true);
  const [showAreas, setShowAreas] = useState<boolean>(true);

  // Map Tile Style: 'satellite' (Bing/Esri imagery) | 'street' (OpenStreetMap)
  const [mapTileStyle, setMapTileStyle] = useState<'satellite' | 'street'>('satellite');

  // Search Results
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{
    points: MapPointFeature[];
    lines: MapLineFeature[];
    areas: MapAreaFeature[];
    source: 'vector' | 'keyword';
  } | null>(null);

  // Load province config when province changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchProvinceMapConfig(currentProvince)
      .then((cfg) => {
        if (isMounted) {
          setConfig(cfg);
          setSelectedFeature(null);
          setSearchResults(null);
          setSearchQuery('');
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setConfig(getProvinceMapConfig(currentProvince));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentProvince]);

  // Execute Search
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setSearchResults(null);
        return;
      }

      setIsSearching(true);
      const res = await searchFeatures(query, currentProvince);
      setSearchResults(res);
      setIsSearching(false);

      // Auto-select first matching feature for instant inspection
      if (res.points.length > 0) {
        setSelectedFeature({ type: 'point', data: res.points[0] });
      } else if (res.lines.length > 0) {
        setSelectedFeature({ type: 'line', data: res.lines[0] });
      } else if (res.areas.length > 0) {
        setSelectedFeature({ type: 'area', data: res.areas[0] });
      }
    },
    [currentProvince]
  );

  return {
    currentProvince,
    setCurrentProvince,
    config,
    isLoading,
    selectedFeature,
    setSelectedFeature,
    showPoints,
    setShowPoints,
    showLines,
    setShowLines,
    showAreas,
    setShowAreas,
    mapTileStyle,
    setMapTileStyle,
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    handleSearch
  };
}
