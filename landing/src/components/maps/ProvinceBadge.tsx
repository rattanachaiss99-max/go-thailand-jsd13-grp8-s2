'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { getProvinceByIdOrSlug, REGION_METAS } from '@/data/thailandProvinces';

interface ProvinceBadgeProps {
  provinceId: string;
  size?: 'sm' | 'md' | 'lg';
  showRegion?: boolean;
  showIcon?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * ProvinceBadge
 * แสดงสัญลักษณ์/Badge ประจำจังหวัด สามารถนำไปวางในการ์ดที่พัก การ์ดทัวร์ หรือโปรไฟล์ไกด์
 * รองรับการโหลด SVG เดี่ยวจาก /assets/maps/provinces/[id].svg หรือแสดงสัญลักษณ์พร้อมชื่อ
 */
export default function ProvinceBadge({
  provinceId,
  size = 'md',
  showRegion = false,
  showIcon = true,
  onClick,
  className
}: ProvinceBadgeProps) {
  const province = getProvinceByIdOrSlug(provinceId);

  if (!province) {
    return (
      <Chip
        label={provinceId}
        size={size === 'lg' ? 'medium' : 'small'}
        className={className}
        sx={{ borderRadius: 1.5 }}
      />
    );
  }

  const regionMeta = REGION_METAS[province.region];

  return (
    <Box
      onClick={onClick}
      className={className}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? 0.75 : 1.25,
        px: size === 'sm' ? 1 : 1.5,
        py: size === 'sm' ? 0.5 : 0.75,
        bgcolor: regionMeta ? regionMeta.bgLight : 'grey.100',
        border: '1px solid',
        borderColor: regionMeta ? `${regionMeta.color}30` : 'grey.300',
        borderRadius: 2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderColor: regionMeta ? regionMeta.color : 'primary.main'
            }
          : undefined
      }}
    >
      {/* Icon สัญลักษณ์จังหวัด (ถ้ามีไฟล์ SVG ใน public/assets/maps/provinces/ หรือใช้อักษรย่อ) */}
      {showIcon && (
        <Box
          sx={{
            width: size === 'sm' ? 18 : size === 'lg' ? 28 : 22,
            height: size === 'sm' ? 18 : size === 'lg' ? 28 : 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            bgcolor: regionMeta ? regionMeta.color : 'primary.main',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: size === 'sm' ? '0.625rem' : '0.75rem',
            lineHeight: 1
          }}
        >
          {province.id.replace('TH-', '')}
        </Box>
      )}

      {/* ชื่อจังหวัด */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '0.95rem' : '0.85rem',
            lineHeight: 1.2
          }}
        >
          {province.nameTh}
        </Typography>

        {showRegion && (
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.675rem',
              color: regionMeta ? regionMeta.color : 'text.secondary',
              fontWeight: 600
            }}
          >
            {regionMeta ? regionMeta.labelTh : province.nameEn}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
