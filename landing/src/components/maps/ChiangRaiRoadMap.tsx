'use client';

// ============================================================================
// CHIANG RAI VECTOR MAP COMPONENT (BETA / EXTENSIBLE)
// ============================================================================
// โครงสร้างเวกเตอร์แผนที่ท่องเที่ยวเชียงราย รองรับการแสดงผล:
// 1. ฐานขอบเขตจังหวัดเชียงราย (Boundary)
// 2. สายน้ำธรรมชาติ (แม่น้ำกก, แม่น้ำโขง)
// 3. โครงข่ายเส้นทางหลวง (สาย 1, 118, 1016, 1089, 1020, 1021, 1155)
// 4. [MOCK] ป้ายสัญลักษณ์ทางหลวง (Highway Badges)
// 5. [MOCK] จุดแลนด์มาร์กท่องเที่ยว (POIs) 1-15 ตามสารบัญ TAT
// 6. [MOCK] ชื่ออำเภอสำคัญ และจุดเชื่อมต่อไปยังจังหวัดข้างเคียง
//
// ----------------------------------------------------------------------------
// 📌 [FUTURE REQUIREMENTS / TODO สำหรับการดราฟต์เวกเตอร์เพิ่มเติมในอนาคต]:
// 1. เพิ่มเส้นทางหลวงที่ยังขาด:
//    - ทางหลวงหมายเลข 1290 (เส้นเลียบแม่น้ำโขง: แม่สาย - เชียงแสน - เชียงของ)
//    - ทางหลวงหมายเลข 1130 (ขึ้นดอยแม่สลอง)
//    - ทางหลวงหมายเลข 1126 / 1190 (พาน - ป่าแดด - เทิง)
//    - ทางหลวงหมายเลข 1150 / 120 (เวียงป่าเป้า เชื่อม พร้าว / ลำปาง)
//    - ทางหลวงหมายเลข 1098 / 1173 (วงรอบ เวียงเชียงรุ้ง - ดอยหลวง)
// 2. ขอบเขต 18 อำเภอ (Districts Boundaries):
//    - ปัจจุบันมีเฉพาะเส้นรอบนอก (Outer Boundary) หากต้องการคลิกเลือกรายอำเภอ
//      ให้ดราฟต์ Path ภายใน 18 อำเภอแยกชิ้น
// 3. ปรับพิกัด POIs ให้ครบ 15 จุดและตรงกับจุดแลนด์มาร์กจริง 100%
// ============================================================================

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';

// ข้อมูล Mapping เส้นทางและจุดแวะตามทริปแนะนำ
const TRAIL_ROUTE_CONFIG: Record<
  string,
  {
    roads: string[];
    pois: string[];
    trailName: string;
    routeDesc: string;
    themeColor: string;
  }
> = {
  'trail-slowlife-coffee': {
    roads: ['road-hwy-118', 'road-hwy-1', 'road-hwy-1089'],
    pois: ['poi-1', 'poi-3', 'poi-14'],
    trailName: 'สายสโลว์ไลฟ์ จิบกาแฟเหนือเมฆ & นอนชมทะเลหมอก',
    routeDesc: 'ใช้ทางหลวง 118 (ดอยช้าง/แม่สรวย) ➔ สาย 1 (พหลโยธิน) ➔ สาย 1089 (ดอยตุง/ฉุยฟง)',
    themeColor: '#0284c7'
  },
  'trail-art-culture': {
    roads: ['road-hwy-1', 'road-hwy-1232-1174'],
    pois: ['poi-8', 'poi-10'],
    trailName: 'สายมหาพุทธศิลป์ล้านนาระดับโลก',
    routeDesc: 'ใช้ทางหลวงสาย 1 (ถนนพหลโยธิน) ผ่านวัดร่องขุ่น ➔ เมืองเชียงราย ➔ บ้านดำ',
    themeColor: '#7c3aed'
  },
  'trail-mist-mountain': {
    roads: ['road-hwy-1020-1292', 'road-hwy-1021', 'road-hwy-1155', 'road-hwy-1016'],
    pois: ['poi-4', 'poi-12'],
    trailName: 'สายล่าทะเลหมอก 360 องศา & สันเขาชายแดนตะวันออก',
    routeDesc: 'ใช้ทางหลวง 1020 / 1155 มุ่งสู่ภูชี้ฟ้า ➔ สาย 1016 เชื่อมสามเหลี่ยมทองคำ เชียงแสน',
    themeColor: '#059669'
  }
};

export interface ChiangRaiRoadMapProps {
  activeTrailId?: string;
  onSelectRoad?: (roadInfo: { hwy: string; name: string }) => void;
  compact?: boolean;
}

export default function ChiangRaiRoadMap({
  activeTrailId,
  onSelectRoad,
  compact = false
}: ChiangRaiRoadMapProps) {
  // Layer Visibility Switches
  const [showRoads, setShowRoads] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showAttractions, setShowAttractions] = useState(true);
  const [showBadges, setShowBadges] = useState(true);

  // Hover States
  const [hoveredRoad, setHoveredRoad] = useState<{ hwy: string; name: string } | null>(null);

  // ข้อมูลเส้นทางที่กำลัง Active
  const activeConfig = useMemo(() => {
    if (!activeTrailId) return null;
    return TRAIL_ROUTE_CONFIG[activeTrailId] || null;
  }, [activeTrailId]);

  const isRoadActive = (roadId: string) => {
    if (!activeConfig) return false;
    return activeConfig.roads.includes(roadId);
  };

  const isPoiActive = (poiId: string) => {
    if (!activeConfig) return false;
    return activeConfig.pois.includes(poiId);
  };

  const handleRoadClick = (hwy: string, name: string) => {
    if (onSelectRoad) {
      onSelectRoad({ hwy, name });
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#ffffff',
        borderRadius: 4,
        border: '1px solid #e2e8f0',
        p: { xs: 2, sm: 2.5 },
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}
    >
      {/* Header & Layer Controls */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={1.5}
        sx={{ mb: 2, pb: 2, borderBottom: '1px solid #f1f5f9' }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 0.8 }}>
              🗺️ แผนที่โครงข่ายเส้นทางท่องเที่ยวเชียงราย
            </Typography>
            <Chip label="Interactive Vector" size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
          </Stack>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {activeConfig ? (
              <span style={{ color: activeConfig.themeColor, fontWeight: 600 }}>
                ● ไฮไลต์ตามทริป: {activeConfig.routeDesc}
              </span>
            ) : (
              'คลิกหรือชี้บนเส้นทางหลวง/หมุดท่องเที่ยว เพื่อดูรายละเอียด'
            )}
          </Typography>
        </Box>

        {/* Toggle Switches */}
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          <FormControlLabel
            control={<Switch size="small" checked={showRoads} onChange={(e) => setShowRoads(e.target.checked)} color="warning" />}
            label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>ถนน</Typography>}
          />
          <FormControlLabel
            control={<Switch size="small" checked={showRivers} onChange={(e) => setShowRivers(e.target.checked)} color="info" />}
            label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>แม่น้ำ</Typography>}
          />
          <FormControlLabel
            control={<Switch size="small" checked={showAttractions} onChange={(e) => setShowAttractions(e.target.checked)} color="error" />}
            label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>ที่เที่ยว</Typography>}
          />
          <FormControlLabel
            control={<Switch size="small" checked={showBadges} onChange={(e) => setShowBadges(e.target.checked)} />}
            label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>ป้ายทางหลวง</Typography>}
          />
        </Stack>
      </Stack>

      {/* Floating Info Tooltip */}
      {hoveredRoad && (
        <Box
          sx={{
            position: 'absolute',
            top: 75,
            right: 20,
            zIndex: 10,
            bgcolor: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(6px)',
            color: '#ffffff',
            px: 2,
            py: 1,
            borderRadius: 2,
            boxShadow: 3,
            pointerEvents: 'none',
            fontSize: '0.8rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, display: 'block' }}>
            ทางหลวงหมายเลข {hoveredRoad.hwy}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {hoveredRoad.name}
          </Typography>
        </Box>
      )}

      {/* SVG Map Container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: compact ? '480px' : '650px',
          mx: 'auto',
          position: 'relative'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="991 0 388 463"
          className="w-full h-auto"
          style={{
            maxHeight: compact ? '380px' : '480px',
            width: '100%',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.04))'
          }}
        >
          <defs>
            <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" />
            </filter>
            <filter id="poi-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.6" />
            </filter>
            {/* สัญลักษณ์ป้ายทางหลวง (Shield Template) */}
            <g id="shield-base">
              <path
                d="M-9,-7 L9,-7 Q11,2 9,8 L0,12 L-9,8 Q-11,2 -9,-7 Z"
                fill="#ffffff"
                stroke="#334155"
                strokeWidth="1.2"
                filter="url(#badge-shadow)"
              />
            </g>
          </defs>

          {/* Inline CSS Rules */}
          <style>{`
            .province-base { fill: #fdfbf7; stroke: #cbd5e1; stroke-width: 2; stroke-miterlimit: 10; }
            .river-kok-style { fill: none; stroke: #38bdf8; stroke-width: 5; opacity: 0.65; stroke-linecap: round; }
            .river-khong-style { fill: none; stroke: #0284c7; stroke-width: 6; opacity: 0.75; stroke-linecap: round; }
            
            .road-base { fill: none; stroke-linecap: round; stroke-linejoin: round; transition: all 0.25s ease; cursor: pointer; }
            .road-primary { stroke: #ef4444; stroke-width: 4.5; }
            .road-secondary { stroke: #f97316; stroke-width: 3.5; }
            .road-scenic { stroke: #f59e0b; stroke-width: 3.2; }
            
            .road-base:hover { stroke-width: 6.5px !important; filter: drop-shadow(0 0 6px rgba(239,68,68,0.8)); }
            
            .road-active-pulse {
              stroke-width: 6px !important;
              stroke: ${activeConfig?.themeColor || '#0284c7'} !important;
              stroke-dasharray: 8 5;
              animation: dashFlow 1.6s linear infinite;
              filter: drop-shadow(0 0 5px ${activeConfig?.themeColor || '#0284c7'});
            }

            @keyframes dashFlow {
              from { stroke-dashoffset: 26; }
              to { stroke-dashoffset: 0; }
            }

            .shield-label { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 6.5px; font-weight: 800; fill: #1e293b; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
            .poi-marker { cursor: pointer; transition: transform 0.2s ease; }
            .poi-marker:hover { transform: scale(1.3); }
            .poi-active { transform: scale(1.25); filter: drop-shadow(0 0 6px #ef4444); }
            .poi-num { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 7px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: central; }
            
            .city-label { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 7.5px; font-weight: 700; fill: #334155; text-anchor: middle; paint-order: stroke; stroke: #ffffff; stroke-width: 2.5px; stroke-linejoin: round; pointer-events: none; }
            .outbound-label { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 7px; font-style: italic; fill: #64748b; font-weight: 500; pointer-events: none; }
          `}</style>

          {/* ==========================================
               LAYER 1: ฐานขอบเขตจังหวัด (Outer Boundary)
               ========================================== */}
          <g id="layer-boundary">
            <path
              id="chiang-rai-province"
              className="province-base"
              d="m1374.4 98-13.1 77.1-7.9 15.7-14.4 4-2.6 15.7-10.5 11.7-1.3 1.4 5 8.5-9 9h-13.7v8.6l-6.9 10.2-18.7-3.4-3.4 12-12 3.4-8.5-3.4v22.1l-25.6-1.7-1.7 34.1-13.6-1.7-5.2 5.2-13.6-3.5-13.5 6.8-.4-.2-11.7-15-8.5 5-5.2-1.1-10.2-2.3-5.1 3.4-13.7 6.9-8.5 1.7V340h-20.5l-8.5-6.8-8.5-3.4V340s3.4 12 3.4 15.4-10.2 27.3-10.2 27.3l-3.5 17 6.9 15.4-6.9 8.5-1.7 6.8h-10.2l-13.6 22.2-12 3.4-5-20.5-13.7-8.5-12-30.7 10.2-20.5-.5-9.2-1.2-23.2 1.7-13.6-6.8-10.3-3.4-22.1 6.8-10.3-6.8-5.1v-8.5l-10.2-12 3.4-8.5 13.6-17 10.3 1.7 3.4-15.4 8.5-13.7 8.5-5-15.3-24 13.6-10.2V161l17.1-15.4-1.7-8.5 8.5-3.4-3.4-10.2 22.2-6.9-7.9-14.7h.5l6.5-17-3.4-2.2-11-7 1.4-13.1-2.7-2.6-1.3-10.5-14.4-11.8V27.3l5.3 1.3 40.5 18.3 9.2-4 11.8 9.2 14.4-10.4h13l6.6 5.2 17-36.6 17 1.3c1.3 0 9.2-5.3 9.2-5.3s11.7 13.1 11.7 14.4c0 1.2 7.8 1.3 10 1.3q.5 0 1 .4l16.5 14 1.3 31.4 18.4 5.3 6.5-6.6-2.6-10.4 13-5.3 9.2-21 6.6-3.8h17l14.4 17 6.5 24.8 7.9 9.2h6.5v11.8s17 15.7 18.3 15.7 11.8-11.8 11.8-11.8z"
            />
          </g>

          {/* ==========================================
               LAYER 2: สายน้ำธรรมชาติ (Waterways)
               ========================================== */}
          {showRivers && (
            <g id="layer-rivers">
              {/* แม่น้ำกก */}
              <path
                id="river-kok"
                className="river-kok-style"
                d="M1249.9 73.8c-6.7 0-6 12-12 14-1.9.7-4.6-2.2-5.9-.8-.3.4 2.6 3.3 2.3 4.5q0 .4-.3.6c-4 4-1.7 6-4.9 10-3 3.8-8.5 5.6-12 9.3-1.2 1.3.7 2.7-.2 3.7-1.1 1.2-3.7 0-5.1 1-1 .6-.7 6.6-3.3 8.5-1.4 1-3.4-.9-4.8-.1-.4.2-3.2 4.7-3.5 5.3a52 52 0 0 0-1.9 16.1c.3 1.4 4.7 3.2 5.5 5 1.2 2.6-1.9 6-3.4 7.8-12 13.8-28.1 13.8-45 13.8-3.3 0-5.8.6-7.6 3.7-.1.4-1.2 1.6-1.7 1-1.9-2 1.5-6.3-2-8.2-2-1-4.9 1.2-7 .2-2.4-1.3-3.4-4-6.2-5.4-2.3-1-6.2.1-8.7-.2-1.7-.2-2.2-2.7-3.8-3.4-4.3-1.9-9-.3-13.2-3-6-3.8-3.8-11-8.6-14.7-4-3.2-9.6.6-14-.5-3.9-1-7.3-6.5-11.1-7-2.4-.3-12-1.1-13.2-3.5"
              />
              {/* แม่น้ำโขง */}
              <path
                id="river-khong"
                className="river-khong-style"
                d="M1339.4 83.4c-.5 1.2-2.6 1.5-3.3 2.8-1.4 2.9.6 5.3-2.3 8.2-1.8 1.7-5 2.9-6.2 5-1.8 3 2 8.7-.5 11.9-1.5 1.8-5 .6-6.3 2-1.4 1.4 1.2 6.3 1.1 8.2 0 1.2-4.2 8-5.3 9.4-1.5 1.8-4 1.8-5.4 3.4-2.4 2.7-2.9 6.7-5.5 9.4l-.3.3c-3.2 2-5.4-2.3-8.2 1.4-3.1 4.1 1.6 6.7 1.1 11.2-.4 3.8-4 4.3-5.4 7.2-2.2 4.4-.4 11.8-4.2 15.4-1.7 1.6-4.5-3.5-6-2.4-2 1.3-2.5 5.7-3.5 7.7-1.7 3.7-5.1 5.9-7.3 9-2.2 3.2-3 7.4-5 10.7-1.4 2.3-6 2.2-6.8 4.3-.8 1.8 3.8 2.1 4.4 3.7 1.7 4.8-2.8 9-2.3 13.6.2 2.4 4.1 2.3 4.2 4.8 0 .6-1.4 15.1-1.6 15.7-.6 2.2-2.7 4-3 6.3-.3 3.6 2 6.7 1.5 10-.3 2.5-3.6 4.2-3.6 7"
              />
            </g>
          )}

          {/* ==========================================
               LAYER 3: เครือข่ายถนน (Road Network)
               ========================================== */}
          {showRoads && (
            <g id="layer-roads">
              {/* สาย 1: พหลโยธิน */}
              <path
                id="road-hwy-1"
                className={`road-base road-primary ${isRoadActive('road-hwy-1') ? 'road-active-pulse' : ''}`}
                d="M1144.5 328.5c-2.9-8.5-4.6-16.8-5.5-22.3-1.4-7.9-4-15.6-5-23.8-1-7.7 1.5-16.3 0-23.9-2-9-6-11.6-6.4-23.6a46 46 0 0 1 7-25.1c6-9.5 7.6-14.5 16.6-20.1 6.4-4 11.2-16.4 13.2-23.2 2.7-8.8 8.2-42.6 7-50.6-1.1-7.7-9.8-9.3-9.6-18 .1-4.6 2.3-8.8 2.7-13.1.6-5.7-1-11.9.6-17.4 2.3-7.4 6.4-15 7.2-22.7 1.4-13.4-.4-27.3-.4-40.6"
                onMouseEnter={() => setHoveredRoad({ hwy: '1', name: 'ถนนพหลโยธิน (พาน - เมือง - แม่จัน - แม่สาย)' })}
                onMouseLeave={() => setHoveredRoad(null)}
                onClick={() => handleRoadClick('1', 'ถนนพหลโยธิน')}
              />

              {/* สาย 118: เชียงใหม่ - แม่สรวย - แม่ลาว */}
              <path
                id="road-hwy-118"
                className={`road-base road-primary ${isRoadActive('road-hwy-118') ? 'road-active-pulse' : ''}`}
                style={{ stroke: '#ea580c' }}
                d="M1013.7 437.5c11-9.4 20.2-12.8 35.1-21.3 5.4-3 9.2-4.5 13.1-9.3 6.7-8 6.8-15.3 7-19.3.3-6.7-.3-12.1-.5-19-.3-6.8.7-9.6.2-16.3-.4-6.3-5.3-41.4-6.7-47.6-6.7-31.7 20.2-82.9 67-81.5"
                onMouseEnter={() => setHoveredRoad({ hwy: '118', name: 'สายเชียงใหม่ - เวียงป่าเป้า - แม่สรวย' })}
                onMouseLeave={() => setHoveredRoad(null)}
                onClick={() => handleRoadClick('118', 'สายเชียงใหม่ - เชียงราย')}
              />

              {/* สาย 1016: แม่จัน - เชียงแสน */}
              <path
                id="road-hwy-1016"
                className={`road-base road-secondary ${isRoadActive('road-hwy-1016') ? 'road-active-pulse' : ''}`}
                d="M1164.4 100.9q4.8-1.9 7.4-5.8c1.3-2 2.2-4 4.1-5.6 3.4-2.8 8.5-3.3 11.7-6.3 2.1-1.9 3-6 4.5-8.3 3.1-4.8 12.4-7.3 17.3-9.4 7.6-3.2 16.2 1.7 23.6-.9"
                onMouseEnter={() => setHoveredRoad({ hwy: '1016', name: 'แม่จัน - เชียงแสน (เชื่อมสามเหลี่ยมทองคำ)' })}
                onMouseLeave={() => setHoveredRoad(null)}
                onClick={() => handleRoadClick('1016', 'แม่จัน - เชียงแสน')}
              />

              {/* สาย 1089: แม่จัน - ท่าตอน - ฝาง */}
              <path
                id="road-hwy-1089"
                className={`road-base road-secondary ${isRoadActive('road-hwy-1089') ? 'road-active-pulse' : ''}`}
                d="M1162 105.2a50 50 0 0 1-19.1 9.2c-10.6 1.6-21.8-1-32.4-.4-5.3.4-10 3.4-15.8 3.3-6.5-.1-13-3.1-19.6-2.4-3.8.4-5 4-7.7 6a25 25 0 0 1-9.9 4.5"
                onMouseEnter={() => setHoveredRoad({ hwy: '1089', name: 'แม่จัน - ท่าตอน - อ.ฝาง (เชื่อมดอยแม่สลอง)' })}
                onMouseLeave={() => setHoveredRoad(null)}
                onClick={() => handleRoadClick('1089', 'แม่จัน - ฝาง')}
              />

              {/* สาย 1232 / 1174: เวียงชัย - พญาเม็งราย */}
              <path
                id="road-hwy-1232-1174"
                className={`road-base road-secondary ${isRoadActive('road-hwy-1232-1174') ? 'road-active-pulse' : ''}`}
                d="M1162.7 174.4c6.2 0 13.2-1 19.4 0 6 .9 8.8 4.3 15.4 3.3 6.3-.9 7.4-8.5 17.9-6.7 5.3.9 12.2 4 17 6.3 6.5 3 31.2.7 37.5-3 6.6-4 4.4-19.7 6.6-26 2-5.5 7.6-8.4 10-13.4 4.1-8.2 6.7-21.2 11.4-28.4 3.4-5 10.7-6.3 13.3-11 2.2-3.8-.2-9.4 2.8-12.9 1.4-1.6 3.7 0 5.3-1.2 2.7-2 5.7-10.8 5.7-14"
                onMouseEnter={() => setHoveredRoad({ hwy: '1232/1174', name: 'เวียงชัย - พญาเม็งราย - ดอยหลวง' })}
                onMouseLeave={() => setHoveredRoad(null)}
                onClick={() => handleRoadClick('1232', 'เวียงชัย - พญาเม็งราย')}
              />

              {/* สาย 1020 / 1292: เชียงราย - เทิง */}
              <path
                id="road-hwy-1020-1292"
                className={`road-base road-secondary ${isRoadActive('road-hwy-1020-1292') ? 'road-active-pulse' : ''}`}
                d="M1158.3 184c.5 12.4 14.8 7.5 19.3 16.6 2.4 5.1 6 17 6.8 22.7 1.1 7-1.9 16.4 4.3 22.5 4.8 4.8 11.9 11.7 17.7 15 2.8 1.5 6.7.9 9.7 1.8 6.1 2 16.2 7 20.1 12.2 3 3.9 2.6 11 4.2 15.6"
                onMouseEnter={() => setHoveredRoad({ hwy: '1020', name: 'เมืองเชียงราย - เทิง - ป่าแดด' })}
                onMouseLeave={() => setHoveredRoad(null)}
                onClick={() => handleRoadClick('1020', 'เชียงราย - เทิง')}
              />

              {/* สาย 1155: เชียงของ - เวียงแก่น - ภูชี้ฟ้า */}
              <path
                id="road-hwy-1155"
                className={`road-base road-scenic ${isRoadActive('road-hwy-1155') ? 'road-active-pulse' : ''}`}
                d="M1320 82c0 3.6-1.5 10.6 0 13.9 2.8 5.9 6 8.3 4.9 15.4-.4 2.5-4 3.8-4.8 6.2-2 5.3-5.6 9.5-8.2 14.6-1.6 3.1-1.5 7.4-3.3 10.2-1.9 3-5.5 4-7.3 7.4-6.9 12.4-10.2 25.8-15.7 38.8-1.8 4.3-6.2 7-8.4 11-4.8 8.6-3 21.6-5.9 31.2-1.1 3.9-7.7 6.4-8.2 9.6"
                onMouseEnter={() => setHoveredRoad({ hwy: '1155', name: 'เส้นทางท่องเที่ยวภูชี้ฟ้า - เวียงแก่น' })}
                onMouseLeave={() => setHoveredRoad(null)}
                onClick={() => handleRoadClick('1155', 'เส้นทางภูชี้ฟ้า')}
              />

              {/* สาย 1021: เทิง - เชียงคำ (พะเยา) */}
              <path
                id="road-hwy-1021"
                className={`road-base road-secondary ${isRoadActive('road-hwy-1021') ? 'road-active-pulse' : ''}`}
                d="M1221.3 262.9a35 35 0 0 1 12.8-15c5.4-4 7.3-8.2 14.1-10.6 7-2.5 8.8 3.3 14.8 5.1 5 1.6 12-1.7 16.8.3 5.7 2.5 10 8.4 14.4 12.5"
                onMouseEnter={() => setHoveredRoad({ hwy: '1021', name: 'เทิง - เชียงคำ เชื่อมต่อพะเยา' })}
                onMouseLeave={() => setHoveredRoad(null)}
                onClick={() => handleRoadClick('1021', 'เทิง - เชียงคำ')}
              />
            </g>
          )}

          {/* ==========================================
               LAYER 4: ป้ายสัญลักษณ์ทางหลวง (Highway Badges)
               ========================================== */}
          {showBadges && (
            <g id="layer-road-badges">
              <g transform="translate(1194, 52)"><use href="#shield-base" /><text className="shield-label">1</text></g>
              <g transform="translate(1142, 290)"><use href="#shield-base" /><text className="shield-label">1</text></g>
              <g transform="translate(1048, 385)"><use href="#shield-base" /><text className="shield-label">118</text></g>
              <g transform="translate(1202, 85)"><use href="#shield-base" /><text className="shield-label">1016</text></g>
              <g transform="translate(1105, 115)"><use href="#shield-base" /><text className="shield-label">1089</text></g>
              <g transform="translate(1185, 220)"><use href="#shield-base" /><text className="shield-label">1020</text></g>
              <g transform="translate(1255, 260)"><use href="#shield-base" /><text className="shield-label">1021</text></g>
            </g>
          )}

          {/* ==========================================
               LAYER 5: ข้อความเชื่อมต่อไปยังจังหวัดข้างเคียง
               ========================================== */}
          <g id="layer-connectors">
            <text x="1205" y="18" className="outbound-label">➔ ท่าขี้เหล็ก (เมียนมา)</text>
            <text x="1330" y="70" className="outbound-label">➔ สปป.ลาว</text>
            <text x="995" y="445" className="outbound-label">➔ ไปเชียงใหม่</text>
            <text x="1055" y="130" className="outbound-label">➔ ไปฝาง</text>
            <text x="1135" y="342" className="outbound-label">➔ ไปพะเยา</text>
            <text x="1265" y="278" className="outbound-label">➔ ไปเชียงคำ</text>
          </g>

          {/* ==========================================
               LAYER 6: จุดแลนด์มาร์กท่องเที่ยว (POIs)
               ========================================== */}
          {showAttractions && (
            <g id="layer-attractions">
              {/* POI 1: ดอยแม่สลอง */}
              <Tooltip title="1. ดอยแม่สลอง (ชาอู่หลง & วิถีชุมชนจีนยูนนาน)" arrow placement="top">
                <g id="poi-1" className={`poi-marker ${isPoiActive('poi-1') ? 'poi-active' : ''}`} transform="translate(1120, 85)" filter="url(#poi-glow)">
                  <circle r="6" fill={isPoiActive('poi-1') ? '#ef4444' : '#e11d48'} />
                  <text className="poi-num">1</text>
                </g>
              </Tooltip>

              {/* POI 2: ดอยช้างมูบ */}
              <Tooltip title="2. จุดชมวิวดอยช้างมูบ ฐานปฏิบัติการชายแดน" arrow placement="top">
                <g id="poi-2" className={`poi-marker ${isPoiActive('poi-2') ? 'poi-active' : ''}`} transform="translate(1178, 42)" filter="url(#poi-glow)">
                  <circle r="6" fill="#e11d48" />
                  <text className="poi-num">2</text>
                </g>
              </Tooltip>

              {/* POI 3: พระตำหนักดอยตุง */}
              <Tooltip title="3. พระตำหนักดอยตุง & สวนแม่ฟ้าหลวง" arrow placement="top">
                <g id="poi-3" className={`poi-marker ${isPoiActive('poi-3') ? 'poi-active' : ''}`} transform="translate(1172, 62)" filter="url(#poi-glow)">
                  <circle r="6" fill={isPoiActive('poi-3') ? '#ef4444' : '#e11d48'} />
                  <text className="poi-num">3</text>
                </g>
              </Tooltip>

              {/* POI 4: หอฝิ่น & สามเหลี่ยมทองคำ */}
              <Tooltip title="4. หอฝิ่น & สามเหลี่ยมทองคำ (สบรวก)" arrow placement="top">
                <g id="poi-4" className={`poi-marker ${isPoiActive('poi-4') ? 'poi-active' : ''}`} transform="translate(1238, 52)" filter="url(#poi-glow)">
                  <circle r="6" fill={isPoiActive('poi-4') ? '#ef4444' : '#e11d48'} />
                  <text className="poi-num">4</text>
                </g>
              </Tooltip>

              {/* POI 8: วัดร่องเสือเต้น & พิพิธภัณฑ์บ้านดำ */}
              <Tooltip title="8. วัดร่องเสือเต้น & พิพิธภัณฑ์บ้านดำ อ.ถวัลย์" arrow placement="top">
                <g id="poi-8" className={`poi-marker ${isPoiActive('poi-8') ? 'poi-active' : ''}`} transform="translate(1155, 168)" filter="url(#poi-glow)">
                  <circle r="6" fill={isPoiActive('poi-8') ? '#7c3aed' : '#e11d48'} />
                  <text className="poi-num">8</text>
                </g>
              </Tooltip>

              {/* POI 10: วัดร่องขุ่น & สิงห์ปาร์ค */}
              <Tooltip title="10. วัดร่องขุ่น อ.เฉลิมชัย & สิงห์ปาร์ค" arrow placement="top">
                <g id="poi-10" className={`poi-marker ${isPoiActive('poi-10') ? 'poi-active' : ''}`} transform="translate(1136, 215)" filter="url(#poi-glow)">
                  <circle r="6" fill={isPoiActive('poi-10') ? '#7c3aed' : '#e11d48'} />
                  <text className="poi-num">10</text>
                </g>
              </Tooltip>

              {/* POI 12: ภูชี้ฟ้า & ภูชี้ดาว */}
              <Tooltip title="12. จุดชมวิวทะเลหมอก ภูชี้ฟ้า & ภูชี้ดาว" arrow placement="top">
                <g id="poi-12" className={`poi-marker ${isPoiActive('poi-12') ? 'poi-active' : ''}`} transform="translate(1288, 218)" filter="url(#poi-glow)">
                  <circle r="6" fill={isPoiActive('poi-12') ? '#059669' : '#e11d48'} />
                  <text className="poi-num">12</text>
                </g>
              </Tooltip>

              {/* POI 14: ดอยช้าง & น้ำพุร้อนแม่ขะจาน */}
              <Tooltip title="14. ดอยช้าง (Specialty Coffee) & น้ำพุร้อนแม่ขะจาน" arrow placement="top">
                <g id="poi-14" className={`poi-marker ${isPoiActive('poi-14') ? 'poi-active' : ''}`} transform="translate(1048, 412)" filter="url(#poi-glow)">
                  <circle r="6" fill={isPoiActive('poi-14') ? '#0284c7' : '#e11d48'} />
                  <text className="poi-num">14</text>
                </g>
              </Tooltip>
            </g>
          )}

          {/* ==========================================
               LAYER 7: ป้ายชื่ออำเภอสำคัญ (Town Labels)
               ========================================== */}
          <g id="layer-labels">
            <text x="1195" y="38" className="city-label">อ.แม่สาย</text>
            <text x="1235" y="80" className="city-label">อ.เชียงแสน</text>
            <text x="1165" y="112" className="city-label">อ.แม่จัน</text>
            <text x="1155" y="185" className="city-label">อ.เมืองเชียงราย</text>
            <text x="1330" y="105" className="city-label">อ.เชียงของ</text>
            <text x="1135" y="275" className="city-label">อ.พาน</text>
            <text x="1075" y="285" className="city-label">อ.แม่สรวย</text>
            <text x="1045" y="365" className="city-label">อ.เวียงป่าเป้า</text>
            <text x="1225" y="250" className="city-label">อ.เทิง</text>
          </g>
        </svg>
      </Box>

      {/* Footer Notes for Future Developers */}
      <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px dashed #e2e8f0', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.72rem' }}>
          * แผนที่เวกเตอร์ต้นแบบ (Beta) รองรับการอัปเดตเส้นทางหลวง 1290, 1130 และขอบเขต 18 อำเภอในอนาคต
        </Typography>
      </Box>
    </Box>
  );
}
