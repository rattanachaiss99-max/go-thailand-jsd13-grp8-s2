'use client';

// ============================================================================
// DynamicRegionMap.tsx
// On-Demand Dynamic SVG Map Renderer connecting directly to MongoDB Atlas.
// Eliminates ~150KB of hardcoded static SVG paths from the client bundle.
// ============================================================================

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import {
  Province,
  RegionKey,
  getProvinceByIdOrSlug,
  getProvincesByRegion,
  REGION_METAS
} from '@/data/thailandProvinces';
import { useRegionVectors } from '@/services/provinceVectorService';

export interface DynamicRegionMapProps {
  region: RegionKey;
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

// Exact ViewBoxes calibrated for each region's geographical cluster
const REGION_VIEWBOXES: Record<RegionKey, string> = {
  north: '2756.26 -70.13 926.74 811.13',
  central: '401.03 1039 629.97 1074',
  south: '3072 1592 576 1307',
  east: '2955 893 528 703',
  west: '829 472 544 1591',
  isan: '1511.76 320 1083.24 1050'
};

export default function DynamicRegionMap({
  region,
  selectedProvinceId,
  hoveredProvinceId,
  visitedProvinceIds = [],
  onSelectProvince,
  onHoverProvince
}: DynamicRegionMapProps) {
  const { vectors, isLoading, error } = useRegionVectors(region);
  const provincesInRegion = getProvincesByRegion(region);
  const regionMeta = REGION_METAS[region];
  const viewBox = REGION_VIEWBOXES[region] || '0 0 1000 1000';

  // Province Color Calculation based on State
  const getProvinceColor = (slug: string) => {
    const isSelected =
      selectedProvinceId === slug ||
      selectedProvinceId === `${slug}-province` ||
      getProvinceByIdOrSlug(selectedProvinceId || '')?.slug === slug;

    const isHovered =
      hoveredProvinceId === slug ||
      hoveredProvinceId === `${slug}-province` ||
      (hoveredProvinceId && getProvinceByIdOrSlug(hoveredProvinceId)?.slug === slug);

    const isVisited = visitedProvinceIds.some(
      (id) => id === slug || id === `${slug}-province` || getProvinceByIdOrSlug(id)?.slug === slug
    );

    if (isSelected) return '#0284c7'; // ฟ้าเข้มแบรนด์เน้นตัวเลือก
    if (isHovered) return '#38bdf8';  // ฟ้าสว่างตอน hover
    if (isVisited) return '#10b981';  // สีเขียวมรกตสดใส = พิชิต/เคยไปมาแล้ว! 🏆
    return '#f8fafc';                // ครีม/เทาอ่อนสะอาดยามปกติ
  };

  const getProvinceStroke = (slug: string) => {
    const isSelected =
      selectedProvinceId === slug ||
      selectedProvinceId === `${slug}-province` ||
      getProvinceByIdOrSlug(selectedProvinceId || '')?.slug === slug;

    const isVisited = visitedProvinceIds.some(
      (id) => id === slug || id === `${slug}-province` || getProvinceByIdOrSlug(id)?.slug === slug
    );

    if (isSelected) return '#0369a1';
    if (isVisited) return '#059669';
    return '#cbd5e1';
  };

  if (isLoading && Object.keys(vectors).length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          borderRadius: 4,
          border: '1px dashed',
          borderColor: 'divider',
          p: 4
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={44} sx={{ color: regionMeta.color }} thickness={4} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            กำลังโหลด Vector {regionMeta.labelTh} จาก MongoDB Atlas...
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            ประหยัด Bandwidth ด้วยการดึงข้อมูล On-Demand เฉพาะภูมิภาคที่เปิดดู
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error && Object.keys(vectors).length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          p: 3,
          bgcolor: 'error.lighter',
          color: 'error.main',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2">
          ไม่สามารถโหลด Vector ของ {regionMeta.labelTh} ได้: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        className="w-full h-auto"
        style={{
          maxHeight: '560px',
          margin: '0 auto',
          display: 'block',
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.06))',
          transition: 'all 0.3s ease'
        }}
      >
        <g id={`Region-${region}`}>
          {provincesInRegion.map((prov) => {
            const vData = vectors[prov.slug] || vectors[prov.id] || vectors[prov.slug.replace(/-/g, '')];
            if (!vData || !vData.d) return null;

            return (
              <path
                key={prov.id}
                id={`${prov.slug}-province`}
                data-name={prov.nameEn}
                d={vData.d}
                fill={getProvinceColor(prov.slug)}
                stroke={getProvinceStroke(prov.slug)}
                strokeWidth="2.5"
                strokeMiterlimit="10"
                style={{
                  cursor: 'pointer',
                  transition: 'fill 0.2s ease, stroke 0.2s ease'
                }}
                onClick={() => onSelectProvince(prov)}
                onMouseEnter={() => onHoverProvince(prov)}
                onMouseLeave={() => onHoverProvince(null)}
              />
            );
          })}
        </g>
      </svg>
    </Box>
  );
}
