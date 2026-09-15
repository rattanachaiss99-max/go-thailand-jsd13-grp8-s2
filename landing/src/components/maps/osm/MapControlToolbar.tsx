'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { THAILAND_PROVINCES } from '@/data/thailandProvinces';

export interface MapControlToolbarProps {
  currentProvince: string;
  onProvinceChange: (provinceSlug: string) => void;
  showPoints: boolean;
  onTogglePoints: (show: boolean) => void;
  showLines: boolean;
  onToggleLines: (show: boolean) => void;
  showAreas: boolean;
  onToggleAreas: (show: boolean) => void;
  mapTileStyle: 'satellite' | 'street';
  onToggleTileStyle: (style: 'satellite' | 'street') => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  allowProvinceSwitch?: boolean;
}

export default function MapControlToolbar({
  currentProvince,
  onProvinceChange,
  showPoints,
  onTogglePoints,
  showLines,
  onToggleLines,
  showAreas,
  onToggleAreas,
  mapTileStyle,
  onToggleTileStyle,
  isSidebarOpen,
  onToggleSidebar,
  allowProvinceSwitch = true
}: MapControlToolbarProps) {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        px: { xs: 1.5, sm: 2 },
        py: 1,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}
    >
      {/* Left Tools: Sidebar Toggle & Province Selector */}
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <Tooltip title="เปิด/ปิด แถบค้นหาคุณลักษณะ (Feature Search & Inspector)" arrow>
          <Button
            size="small"
            variant={isSidebarOpen ? 'contained' : 'outlined'}
            onClick={onToggleSidebar}
            sx={{
              minWidth: 36,
              px: 1.2,
              py: 0.6,
              fontSize: '0.75rem',
              fontWeight: 700,
              bgcolor: isSidebarOpen ? '#0f172a' : 'transparent',
              color: isSidebarOpen ? '#ffffff' : '#334155',
              borderColor: '#cbd5e1',
              '&:hover': {
                bgcolor: isSidebarOpen ? '#1e293b' : '#f1f5f9',
                borderColor: '#94a3b8'
              },
              display: 'flex',
              alignItems: 'center',
              gap: 0.8
            }}
          >
            {/* Sidebar toggle icon matching OSM screenshot */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            <span>ตรวจสอบ</span>
          </Button>
        </Tooltip>

        {/* Province Quick Switcher */}
        {allowProvinceSwitch && (
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={currentProvince}
              onChange={(e) => onProvinceChange(e.target.value)}
              sx={{
                height: 32,
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#0f172a',
                bgcolor: '#f8fafc',
                borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
              }}
            >
              {THAILAND_PROVINCES.map((p) => (
                <MenuItem key={p.slug} value={p.slug} sx={{ fontSize: '0.8rem' }}>
                  {p.nameTh} ({p.nameEn})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>

      {/* Right Tools: OSM Feature Buttons (จุด, เส้น, พื้นที่) & Tiles Toggle */}
      <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: { xs: 'none', md: 'inline' }, mr: 0.5 }}>
          เพิ่มคุณลักษณะ:
        </Typography>

        {/* 1. จุด (Point / Marker) */}
        <Tooltip title="เปิด/ปิด เลเยอร์จุดแลนด์มาร์ก (Points of Interest)" arrow>
          <Button
            size="small"
            variant={showPoints ? 'contained' : 'outlined'}
            onClick={() => onTogglePoints(!showPoints)}
            sx={{
              minWidth: 64,
              px: 1.2,
              py: 0.4,
              fontSize: '0.75rem',
              fontWeight: 700,
              bgcolor: showPoints ? '#ef4444' : 'transparent',
              color: showPoints ? '#ffffff' : '#64748b',
              borderColor: showPoints ? '#ef4444' : '#e2e8f0',
              '&:hover': {
                bgcolor: showPoints ? '#dc2626' : '#fee2e2',
                borderColor: '#ef4444'
              },
              display: 'flex',
              gap: 0.5
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            <span>จุด</span>
          </Button>
        </Tooltip>

        {/* 2. เส้น (Line / Road / Route) */}
        <Tooltip title="เปิด/ปิด เลเยอร์โครงข่ายถนนและแม่น้ำ (Lines & Highways)" arrow>
          <Button
            size="small"
            variant={showLines ? 'contained' : 'outlined'}
            onClick={() => onToggleLines(!showLines)}
            sx={{
              minWidth: 64,
              px: 1.2,
              py: 0.4,
              fontSize: '0.75rem',
              fontWeight: 700,
              bgcolor: showLines ? '#f97316' : 'transparent',
              color: showLines ? '#ffffff' : '#64748b',
              borderColor: showLines ? '#f97316' : '#e2e8f0',
              '&:hover': {
                bgcolor: showLines ? '#ea580c' : '#ffedd5',
                borderColor: '#f97316'
              },
              display: 'flex',
              gap: 0.5
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 19 L10 13 L14 17 L20 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>เส้น</span>
          </Button>
        </Tooltip>

        {/* 3. พื้นที่ (Area / Polygon / Park) */}
        <Tooltip title="เปิด/ปิด เลเยอร์ขอบเขตอำเภอและอุทยาน (Area Boundaries)" arrow>
          <Button
            size="small"
            variant={showAreas ? 'contained' : 'outlined'}
            onClick={() => onToggleAreas(!showAreas)}
            sx={{
              minWidth: 68,
              px: 1.2,
              py: 0.4,
              fontSize: '0.75rem',
              fontWeight: 700,
              bgcolor: showAreas ? '#10b981' : 'transparent',
              color: showAreas ? '#ffffff' : '#64748b',
              borderColor: showAreas ? '#10b981' : '#e2e8f0',
              '&:hover': {
                bgcolor: showAreas ? '#059669' : '#d1fae5',
                borderColor: '#10b981'
              },
              display: 'flex',
              gap: 0.5
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="12 2 2 7 2 17 12 22 22 17 22 7" strokeLinejoin="round" />
            </svg>
            <span>พื้นที่</span>
          </Button>
        </Tooltip>

        {/* Satellite vs Street Tile Toggle */}
        <Tooltip title={mapTileStyle === 'satellite' ? 'สลับเป็นแผนที่ถนน OSM' : 'สลับเป็นภาพถ่ายดาวเทียมแบบภาพต้นแบบ'} arrow>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onToggleTileStyle(mapTileStyle === 'satellite' ? 'street' : 'satellite')}
            sx={{
              px: 1.2,
              py: 0.4,
              fontSize: '0.72rem',
              fontWeight: 700,
              borderColor: '#cbd5e1',
              color: '#334155',
              bgcolor: '#f8fafc',
              '&:hover': { bgcolor: '#e2e8f0' },
              display: 'flex',
              gap: 0.5
            }}
          >
            <span>{mapTileStyle === 'satellite' ? '🛰️ ดาวเทียม' : '🗺️ ถนน'}</span>
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
}
