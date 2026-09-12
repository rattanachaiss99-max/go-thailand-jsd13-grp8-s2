'use client';

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Fade from '@mui/material/Fade';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import NorthernRegionMap from './NorthernRegionMap';
import EasternRegionMap from './EasternRegionMap';
import SouthernRegionMap from './SouthernRegionMap';
import WesternRegionMap from './WesternRegionMap';
import IsanRegionMap from './IsanRegionMap';
import CentralRegionMap from './CentralRegionMap';
import AiTravelAssistantDrawer from './AiTravelAssistantDrawer';
import ProvincePostageStamp from '@/components/profile/ProvincePostageStamp';
import {
  THAILAND_PROVINCES,
  REGION_METAS,
  Province,
  RegionKey,
  getProvinceByIdOrSlug
} from '@/data/thailandProvinces';

interface ThailandInteractiveMapProps {
  onSelectProvince?: (province: Province) => void;
  selectedProvinceId?: string;
  visitedProvinceIds?: string[];
  onToggleVisited?: (province: Province) => void;
  className?: string;
}

export default function ThailandInteractiveMap({
  onSelectProvince,
  selectedProvinceId: externalSelectedId,
  visitedProvinceIds = [],
  onToggleVisited,
  className
}: ThailandInteractiveMapProps) {
  const router = useRouter();

  // Selected region filter (all, north, isan, central, south, east, west)
  const [activeRegion, setActiveRegion] = useState<RegionKey | 'all'>('all');

  // AI Travel Assistant Drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Hovered and internal selected province
  const [hoveredProvince, setHoveredProvince] = useState<Province | null>(null);
  const [internalSelectedId, setInternalSelectedId] = useState<string>('TH-50'); // Default to Chiang Mai

  // ============================================================================
  // ARCHITECTURE NOTE [ON-DEMAND VECTOR LOADING]:
  // ลายเส้น Vector แผนที่แบบฮาร์ดโค้ดถูกระงับการเรนเดอร์ชั่วคราวตามที่ผู้ใช้กำหนด (Default: true)
  // เพื่อรองรับสถาปัตยกรรม On-Demand Loading จาก MongoDB Atlas ผ่าน /api/provinces/vectors/[slug]
  // ในอนาคต โดยผู้ใช้ยังคงสามารถกดปุ่มสลับเพื่อเปิดดู Vector ชั่วคราวได้
  // ============================================================================
  const [isVectorSuspended, setIsVectorSuspended] = useState<boolean>(true);

  const currentSelectedId = externalSelectedId || internalSelectedId;
  const selectedProvince = useMemo(() => {
    return getProvinceByIdOrSlug(currentSelectedId) || THAILAND_PROVINCES[0];
  }, [currentSelectedId]);

  // Provinces filtered by current active region
  const filteredProvinces = useMemo(() => {
    if (activeRegion === 'all') return THAILAND_PROVINCES;
    return THAILAND_PROVINCES.filter((p) => p.region === activeRegion);
  }, [activeRegion]);

  const handleProvinceClick = (province: Province) => {
    setInternalSelectedId(province.id);
    if (onSelectProvince) {
      onSelectProvince(province);
    }
  };

  const handleNavigateToProvince = (slugOrId: string) => {
    router.push(`/accommodations?province=${slugOrId}`);
  };

  return (
    <Box className={className} sx={{ width: '100%', position: 'relative' }}>
      {/* 1. แถบเครื่องมือ: ค้นหาจังหวัด + กรองตามภาค (Responsive & Mobile-friendly) */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
          {/* Autocomplete Search Bar */}
          <Autocomplete
            size="small"
            options={THAILAND_PROVINCES}
            getOptionLabel={(option) => `${option.nameTh} (${option.nameEn})`}
            onChange={(_, newValue) => {
              if (newValue) {
                handleProvinceClick(newValue);
                setActiveRegion(newValue.region);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="พิมพ์ค้นหาจังหวัด... เช่น เชียงใหม่, ภูเก็ต"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ fontSize: '1rem', pl: 0.5 }}>
                          🔍
                        </Box>
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  bgcolor: '#ffffff',
                  borderRadius: 2,
                  width: { xs: '100%', md: 320 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            )}
          />

          {/* Region Tabs (ปุ่มกรองตามภาค) */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              py: 0.5,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            <Chip
              label="ทั้งหมด (77)"
              clickable
              color={activeRegion === 'all' ? 'primary' : 'default'}
              variant={activeRegion === 'all' ? 'filled' : 'outlined'}
              onClick={() => setActiveRegion('all')}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            />
            {Object.entries(REGION_METAS).map(([key, meta]) => {
              const count = THAILAND_PROVINCES.filter((p) => p.region === key).length;
              const isSelected = activeRegion === key;
              return (
                <Chip
                  key={key}
                  label={`${meta.labelTh} (${count})`}
                  clickable
                  onClick={() => setActiveRegion(key as RegionKey)}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: isSelected ? meta.color : '#ffffff',
                    color: isSelected ? '#ffffff' : 'text.primary',
                    borderColor: isSelected ? meta.color : 'grey.300',
                    border: '1px solid',
                    '&:hover': {
                      bgcolor: isSelected ? meta.color : meta.bgLight
                    }
                  }}
                />
              );
            })}
          </Box>

          {/* AI Travel Copilot Button */}
          <Button
            variant="contained"
            startIcon={<Box component="span" sx={{ fontSize: '1rem' }}>✨</Box>}
            onClick={() => setIsAiDrawerOpen(true)}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.85,
              fontWeight: 800,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)'
              }
            }}
          >
            AI Travel Copilot ✨
          </Button>
        </Stack>
      </Box>

      {/* 2. Grid แสดงแผนที่คู่กับ Detail Card */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
          gap: 3,
          alignItems: 'start'
        }}
      >
        {/* ฝั่งซ้าย: SVG แผนที่ประเทศไทยแบบ Interactive */}
        <Card
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'grey.200',
            bgcolor: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Tooltip ลอยแสดงจังหวัดที่กำลัง Hover */}
          {hoveredProvince && (
            <Fade in={Boolean(hoveredProvince)}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  zIndex: 10,
                  bgcolor: 'rgba(15, 23, 42, 0.9)',
                  color: '#ffffff',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backdropFilter: 'blur(6px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  pointerEvents: 'none'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                  📍 {hoveredProvince.nameTh}
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.300' }}>
                  {hoveredProvince.nameEn} • {REGION_METAS[hoveredProvince.region]?.labelTh}
                </Typography>
              </Box>
            </Fade>
          )}

          {/* =============================================================
              NOTE [ARCHITECTURE]: ON-DEMAND VECTOR LOADING SUSPENSION
              - แผนที่ Vector SVG แบบฮาร์ดโค้ดถูกระงับการเรนเดอร์ชั่วคราว (Suspended from initial render)
              - ในอนาคตจะเปลี่ยนไปเรียกใช้ทีละภาพ (On-Demand Fetch) ผ่าน API /api/provinces/vectors/[slug]
              - ผู้ใช้สามารถกดปุ่มสลับเพื่อเปิดดู Vector ชั่วคราวได้
              ============================================================= */}
          {isVectorSuspended ? (
            <Box
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                textAlign: 'center',
                bgcolor: '#f8fafc',
                borderRadius: 3.5,
                border: '2px dashed',
                borderColor: 'grey.300',
                my: 2
              }}
            >
              <Chip
                label="ON-DEMAND VECTOR ARCHITECTURE"
                size="small"
                sx={{ bgcolor: '#e2e8f0', color: '#475569', fontWeight: 800, fontSize: '0.7rem', mb: 1.5 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                🗺️ โหมด On-Demand: ปิดการโหลดลายเส้น Vector ในโค้ดชั่วคราว
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, maxWidth: 450, mx: 'auto', lineHeight: 1.6 }}>
                ข้อมูล Vector (SVG & AI Embeddings) ทั้ง 77 จังหวัดถูกจัดเก็บไว้บน <strong>MongoDB Atlas</strong> เรียบร้อยแล้ว
                ระบบนี้ออกแบบเพื่อเตรียมพร้อมสำหรับการโหลดข้อมูลแบบทีละภาพตามคำขอ (On-Demand Loading) ในอนาคต
              </Typography>

              {/* Quick Interactive Province Picker within Active Region */}
              <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 1 }}>
                  🎯 เลือกจังหวัดเพื่อสำรวจข้อมูล ({filteredProvinces.length} จังหวัดในภูมิภาคนี้):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, justifyContent: 'center', maxHeight: 220, overflowY: 'auto', p: 0.5 }}>
                  {filteredProvinces.map((prov) => {
                    const isSelected = prov.id === selectedProvince.id;
                    const isVisited = visitedProvinceIds.includes(prov.id);
                    return (
                      <Chip
                        key={prov.id}
                        label={`${isVisited ? '🏆 ' : ''}${prov.nameTh}`}
                        size="small"
                        clickable
                        onClick={() => handleProvinceClick(prov)}
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{
                          fontWeight: isSelected ? 700 : 500,
                          borderRadius: 2,
                          fontSize: '0.78rem',
                          bgcolor: isSelected ? undefined : isVisited ? 'rgba(16, 185, 129, 0.08)' : undefined,
                          borderColor: isVisited ? '#10b981' : undefined
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsVectorSuspended(false)}
                sx={{ mt: 3, borderRadius: 2, textTransform: 'none', fontWeight: 600, borderColor: 'grey.300', color: 'text.secondary' }}
              >
                👁️ แสดงผล Vector แผนที่ชั่วคราว (Preview Mode)
              </Button>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setIsVectorSuspended(true)}
                  sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.75rem' }}
                >
                  ✖️ ปิดการแสดงผล Vector (กลับสู่โหมด On-Demand)
                </Button>
              </Box>

              {/* SVG Map of Thailand */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 480,
                  mx: 'auto',
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.06))'
                }}
              >
                {activeRegion === 'north' ? (
                  <NorthernRegionMap
                selectedProvinceId={selectedProvince.id}
                hoveredProvinceId={hoveredProvince?.id}
                visitedProvinceIds={visitedProvinceIds}
                onSelectProvince={handleProvinceClick}
                onHoverProvince={setHoveredProvince}
              />
            ) : activeRegion === 'east' ? (
              <EasternRegionMap
                selectedProvinceId={selectedProvince.id}
                hoveredProvinceId={hoveredProvince?.id}
                visitedProvinceIds={visitedProvinceIds}
                onSelectProvince={handleProvinceClick}
                onHoverProvince={setHoveredProvince}
              />
            ) : activeRegion === 'south' ? (
              <SouthernRegionMap
                selectedProvinceId={selectedProvince.id}
                hoveredProvinceId={hoveredProvince?.id}
                visitedProvinceIds={visitedProvinceIds}
                onSelectProvince={handleProvinceClick}
                onHoverProvince={setHoveredProvince}
              />
            ) : activeRegion === 'west' ? (
              <WesternRegionMap
                selectedProvinceId={selectedProvince.id}
                hoveredProvinceId={hoveredProvince?.id}
                visitedProvinceIds={visitedProvinceIds}
                onSelectProvince={handleProvinceClick}
                onHoverProvince={setHoveredProvince}
              />
            ) : activeRegion === 'isan' ? (
              <IsanRegionMap
                selectedProvinceId={selectedProvince.id}
                hoveredProvinceId={hoveredProvince?.id}
                visitedProvinceIds={visitedProvinceIds}
                onSelectProvince={handleProvinceClick}
                onHoverProvince={setHoveredProvince}
              />
            ) : activeRegion === 'central' ? (
              <CentralRegionMap
                selectedProvinceId={selectedProvince.id}
                hoveredProvinceId={hoveredProvince?.id}
                visitedProvinceIds={visitedProvinceIds}
                onSelectProvince={handleProvinceClick}
                onHoverProvince={setHoveredProvince}
              />
            ) : (
            <svg
              viewBox="0 0 400 680"
              className="w-full h-auto"
              style={{ maxHeight: '560px' }}
            >
              <defs>
                <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* -------------------------------------------------------------
                  1. ภาคเหนือ (Northern Region)
                  ------------------------------------------------------------- */}
              <g
                id="region-north"
                style={{
                  opacity: (activeRegion as string) === 'all' || (activeRegion as string) === 'north' ? 1 : 0.35,
                  transition: 'opacity 0.3s ease'
                }}
              >
                {/* แม่ฮ่องสอน + เชียงใหม่ + เชียงราย + พะเยา + น่าน + ลำพูน + ลำปาง + แพร่ + อุตรดิตถ์ */}
                <path
                  id="TH-50-cluster"
                  d="M 120 40 L 175 35 L 210 65 L 200 115 L 155 130 L 110 95 Z"
                  fill={
                    selectedProvince.region === 'north'
                      ? REGION_METAS.north.color
                      : hoveredProvince?.region === 'north'
                      ? '#38bdf8'
                      : '#93c5fd'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    handleProvinceClick(getProvinceByIdOrSlug('TH-50')!);
                    setActiveRegion('north');
                  }}
                  onMouseEnter={() => setHoveredProvince(getProvinceByIdOrSlug('TH-50')!)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
                <text x="155" y="80" textAnchor="middle" fill="#1e3a8a" fontSize="11" fontWeight="700">
                  เชียงใหม่ & ภาคเหนือ
                </text>
              </g>

              {/* -------------------------------------------------------------
                  2. ภาคอีสาน (Northeastern Region / Isan)
                  ------------------------------------------------------------- */}
              <g
                id="region-isan"
                style={{
                  opacity: (activeRegion as string) === 'all' || (activeRegion as string) === 'isan' ? 1 : 0.35,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <path
                  id="TH-isan-cluster"
                  d="M 215 70 L 320 100 L 375 160 L 350 240 L 255 250 L 205 170 Z"
                  fill={
                    selectedProvince.region === 'isan'
                      ? REGION_METAS.isan.color
                      : hoveredProvince?.region === 'isan'
                      ? '#f59e0b'
                      : '#fcd34d'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    handleProvinceClick(getProvinceByIdOrSlug('TH-30')!);
                    setActiveRegion('isan');
                  }}
                  onMouseEnter={() => setHoveredProvince(getProvinceByIdOrSlug('TH-30')!)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
                <text x="285" y="165" textAnchor="middle" fill="#78350f" fontSize="12" fontWeight="700">
                  ภาคอีสาน (20 จว.)
                </text>
              </g>

              {/* -------------------------------------------------------------
                  3. ภาคกลาง & ตะวันตก (Central & Western)
                  ------------------------------------------------------------- */}
              <g
                id="region-central"
                style={{
                  opacity:
                    (activeRegion as string) === 'all' || (activeRegion as string) === 'central' || (activeRegion as string) === 'west'
                      ? 1
                      : 0.35,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <path
                  id="TH-central-cluster"
                  d="M 125 140 L 200 125 L 215 210 L 195 285 L 140 260 L 105 180 Z"
                  fill={
                    selectedProvince.region === 'central' || selectedProvince.region === 'west'
                      ? REGION_METAS.central.color
                      : hoveredProvince?.region === 'central'
                      ? '#4ade80'
                      : '#86efac'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    handleProvinceClick(getProvinceByIdOrSlug('TH-10')!);
                    setActiveRegion('central');
                  }}
                  onMouseEnter={() => setHoveredProvince(getProvinceByIdOrSlug('TH-10')!)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
                <text x="160" y="200" textAnchor="middle" fill="#14532d" fontSize="11" fontWeight="700">
                  กรุงเทพฯ & ภาคกลาง
                </text>
              </g>

              {/* -------------------------------------------------------------
                  4. ภาคตะวันออก (Eastern Region)
                  ------------------------------------------------------------- */}
              <g
                id="region-east"
                style={{
                  opacity: (activeRegion as string) === 'all' || (activeRegion as string) === 'east' ? 1 : 0.35,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <path
                  id="TH-east-cluster"
                  d="M 200 250 L 255 250 L 275 310 L 220 330 L 195 285 Z"
                  fill={
                    selectedProvince.region === 'east'
                      ? REGION_METAS.east.color
                      : hoveredProvince?.region === 'east'
                      ? '#fb923c'
                      : '#fdba74'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    handleProvinceClick(getProvinceByIdOrSlug('TH-20')!);
                    setActiveRegion('east');
                  }}
                  onMouseEnter={() => setHoveredProvince(getProvinceByIdOrSlug('TH-20')!)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
                <text x="235" y="295" textAnchor="middle" fill="#7c2d12" fontSize="10" fontWeight="700">
                  ชลบุรี/ภาคตะวันออก
                </text>
              </g>

              {/* -------------------------------------------------------------
                  5. ภาคใต้ (Southern Region)
                  ------------------------------------------------------------- */}
              <g
                id="region-south"
                style={{
                  opacity: (activeRegion as string) === 'all' || (activeRegion as string) === 'south' ? 1 : 0.35,
                  transition: 'opacity 0.3s ease'
                }}
              >
                {/* ภาคใต้ตอนบน */}
                <path
                  id="TH-south-cluster-top"
                  d="M 135 285 L 175 285 L 160 380 L 120 370 Z"
                  fill={
                    selectedProvince.region === 'south'
                      ? REGION_METAS.south.color
                      : hoveredProvince?.region === 'south'
                      ? '#60a5fa'
                      : '#93c5fd'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    handleProvinceClick(getProvinceByIdOrSlug('TH-84')!);
                    setActiveRegion('south');
                  }}
                  onMouseEnter={() => setHoveredProvince(getProvinceByIdOrSlug('TH-84')!)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />

                {/* ภาคใต้ตอนล่าง (ภูเก็ต กระบี่ สงขลา) */}
                <path
                  id="TH-south-cluster-bottom"
                  d="M 120 375 L 160 380 L 190 490 L 195 560 L 170 590 L 140 540 L 105 450 Z"
                  fill={
                    selectedProvince.region === 'south'
                      ? REGION_METAS.south.color
                      : hoveredProvince?.region === 'south'
                      ? '#3b82f6'
                      : '#60a5fa'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    handleProvinceClick(getProvinceByIdOrSlug('TH-83')!);
                    setActiveRegion('south');
                  }}
                  onMouseEnter={() => setHoveredProvince(getProvinceByIdOrSlug('TH-83')!)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
                <text x="145" y="460" textAnchor="middle" fill="#1e3a8a" fontSize="12" fontWeight="700">
                  ภาคใต้ & ภูเก็ต
                </text>
              </g>

              {/* Pin indicator สำหรับจังหวัดที่ถูกเลือกในขณะนั้น */}
              <circle
                cx={
                  selectedProvince.region === 'north'
                    ? 160
                    : selectedProvince.region === 'isan'
                    ? 285
                    : selectedProvince.region === 'east'
                    ? 235
                    : selectedProvince.region === 'south'
                    ? 145
                    : 165
                }
                cy={
                  selectedProvince.region === 'north'
                    ? 95
                    : selectedProvince.region === 'isan'
                    ? 180
                    : selectedProvince.region === 'east'
                    ? 280
                    : selectedProvince.region === 'south'
                    ? 490
                    : 220
                }
                r="7"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2.5"
                filter="url(#map-glow)"
              />
            </svg>
            )}
          </Box>
        </Box>
      )}

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 1.5,
              color: 'text.secondary',
              fontStyle: 'italic'
            }}
          >
            💡 คลิกเลือกพื้นที่บนแผนที่ หรือค้นหาชื่อจังหวัดด้านบนเพื่อดูข้อมูล
          </Typography>
        </Card>

        {/* ฝั่งขวา: การ์ดข้อมูลจังหวัดที่เลือก + รายการจังหวัดในภาค (Quick Select) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Card รายละเอียดจังหวัดที่เลือก */}
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'grey.200',
              bgcolor: '#ffffff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Chip
                  label={REGION_METAS[selectedProvince.region]?.labelTh}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: REGION_METAS[selectedProvince.region]?.bgLight,
                    color: REGION_METAS[selectedProvince.region]?.color,
                    mb: 1
                  }}
                />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {selectedProvince.nameTh}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {selectedProvince.nameEn} • ISO: {selectedProvince.id}
                </Typography>
              </Box>

              {/* วงกลมไอคอนย่อ */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: REGION_METAS[selectedProvince.region]?.color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: `0 6px 16px ${REGION_METAS[selectedProvince.region]?.color}40`
                }}
              >
                {selectedProvince.id.replace('TH-', '')}
              </Box>
            </Box>

            {/* Stamp สะสมประจำจังหวัด (Collectible Stamp Preview) */}
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <ProvincePostageStamp
                province={selectedProvince}
                isVisited={visitedProvinceIds.some(
                  (id) =>
                    id === selectedProvince.id ||
                    id === selectedProvince.slug ||
                    id === `${selectedProvince.slug}-province` ||
                    getProvinceByIdOrSlug(id)?.id === selectedProvince.id
                )}
                size="small"
                onClick={onToggleVisited ? () => onToggleVisited(selectedProvince) : undefined}
              />
            </Box>

            {/* จุดเช็กอินยอดนิยม */}
            {selectedProvince.popularDestinations && selectedProvince.popularDestinations.length > 0 && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                  สถานที่ยอดนิยม
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedProvince.popularDestinations.map((dest) => (
                    <Chip key={dest} label={`⭐ ${dest}`} size="small" variant="outlined" sx={{ borderRadius: 1.5 }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Stack direction="column" spacing={1.5} sx={{ mt: 3 }}>
              {/* สถานะการปลดล็อกผ่านการจองใน MongoDB */}
              {visitedProvinceIds.some(
                (id) =>
                  id === selectedProvince.id ||
                  id === selectedProvince.slug ||
                  getProvinceByIdOrSlug(id)?.id === selectedProvince.id
              ) ? (
                <Alert severity="success" sx={{ borderRadius: 2, py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ✓ ปลดล็อกตราประทับแล้วจากการจองสำเร็จ
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 2, py: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    🔒 ตราประทับจะปลดล็อกเมื่อการจองทริปในจังหวัดนี้เสร็จสิ้น
                  </Typography>
                </Alert>
              )}

              {onToggleVisited && !visitedProvinceIds.some(
                (id) =>
                  id === selectedProvince.id ||
                  id === selectedProvince.slug ||
                  getProvinceByIdOrSlug(id)?.id === selectedProvince.id
              ) && (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => onToggleVisited(selectedProvince)}
                  sx={{
                    borderRadius: 2.5,
                    py: 1,
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  🧪 จำลองการจองและพิชิตทริปนี้ (Simulate Completed Trip)
                </Button>
              )}

              <Button
                variant={onToggleVisited ? 'outlined' : 'contained'}
                fullWidth
                onClick={() => handleNavigateToProvince(selectedProvince.slug)}
                sx={{
                  borderRadius: 2.5,
                  py: 1.25,
                  fontWeight: 700,
                  bgcolor: onToggleVisited ? 'transparent' : 'primary.main',
                  '&:hover': { bgcolor: onToggleVisited ? 'grey.100' : 'primary.dark' }
                }}
              >
                ค้นหาที่พักและทัวร์ใน {selectedProvince.nameTh} →
              </Button>

              {/* ปุ่มถาม AI เจาะลึกจังหวัดนี้ */}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Box component="span" sx={{ fontSize: '1rem' }}>🤖</Box>}
                onClick={() => setIsAiDrawerOpen(true)}
                sx={{
                  borderRadius: 2.5,
                  py: 1,
                  fontWeight: 700,
                  borderColor: '#0284c7',
                  color: '#0284c7',
                  '&:hover': {
                    bgcolor: '#f0f9ff',
                    borderColor: '#0369a1'
                  }
                }}
              >
                ถาม AI เจาะลึกจังหวัด{selectedProvince.nameTh} ✨
              </Button>
            </Stack>
          </Card>

          {/* ลิสต์จังหวัดอื่นๆ ในภาคเดียวกันสำหรับกดเลือกง่ายๆ บนมือถือ/Desktop */}
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'grey.200',
              bgcolor: '#ffffff'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
              จังหวัดใน {activeRegion === 'all' ? 'ประเทศไทย' : REGION_METAS[activeRegion]?.labelTh} ({filteredProvinces.length})
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                maxHeight: 180,
                overflowY: 'auto',
                pr: 0.5
              }}
            >
              {filteredProvinces.map((prov) => {
                const isSelected = prov.id === selectedProvince.id;
                const isVisited = visitedProvinceIds.some(
                  (id) => id === prov.id || id === prov.slug || getProvinceByIdOrSlug(id)?.id === prov.id
                );
                return (
                  <Chip
                    key={prov.id}
                    label={`${isVisited ? '✓ ' : ''}${prov.nameTh}`}
                    clickable
                    size="small"
                    onClick={() => handleProvinceClick(prov)}
                    sx={{
                      fontWeight: isSelected ? 700 : isVisited ? 600 : 500,
                      borderRadius: 2,
                      bgcolor: isSelected
                        ? 'primary.main'
                        : isVisited
                        ? '#dcfce7'
                        : 'grey.100',
                      color: isSelected
                        ? '#ffffff'
                        : isVisited
                        ? '#15803d'
                        : 'text.primary',
                      border: isVisited && !isSelected ? '1px solid #86efac' : 'none',
                      '&:hover': {
                        bgcolor: isSelected
                          ? 'primary.dark'
                          : isVisited
                          ? '#bbf7d0'
                          : 'grey.200'
                      }
                    }}
                  />
                );
              })}
            </Box>
          </Card>
        </Box>
      </Box>

      {/* AI Travel Assistant Drawer */}
      <AiTravelAssistantDrawer
        open={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        onSelectProvince={(p) => {
          handleProvinceClick(p);
          setActiveRegion(p.region);
        }}
        activeRegion={activeRegion}
        currentSelectedProvince={selectedProvince}
      />
    </Box>
  );
}
