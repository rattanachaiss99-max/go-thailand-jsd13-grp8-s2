'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import ChiangRaiRoadMap from '@/components/maps/ChiangRaiRoadMap';

const POPULAR_ROUTES = [
  {
    id: 'trail-slowlife-coffee',
    label: '☕ ดอยช้าง - ดอยตุง',
    badge: 'สายกาแฟ & ขุนเขา',
    hwy: 'สาย 118 & 1',
    color: '#0284c7'
  },
  {
    id: 'trail-art-culture',
    label: '🏛️ วัดร่องขุ่น - บ้านดำ',
    badge: 'สายมหาพุทธศิลป์',
    hwy: 'สาย 1 พหลโยธิน',
    color: '#7c3aed'
  },
  {
    id: 'trail-mist-mountain',
    label: '🌄 ภูชี้ฟ้า - สามเหลี่ยมทองคำ',
    badge: 'สายล่าทะเลหมอก',
    hwy: 'สาย 1020 & 1155',
    color: '#059669'
  }
];

export interface HeroMapSectionProps {
  activeRouteId?: string;
  onRouteChange?: (routeId: string) => void;
}

export default function HeroMapSection({
  activeRouteId: controlledRouteId,
  onRouteChange
}: HeroMapSectionProps = {}) {
  const router = useRouter();
  const [internalRouteId, setInternalRouteId] = useState<string>('trail-slowlife-coffee');

  const activeRouteId = controlledRouteId ?? internalRouteId;

  const handleSelectRoute = (routeId: string) => {
    if (onRouteChange) {
      onRouteChange(routeId);
    } else {
      setInternalRouteId(routeId);
    }
  };

  const activeRoute = POPULAR_ROUTES.find((r) => r.id === activeRouteId);

  return (
    <Box
      component="section"
      id="hero-map-section"
      sx={{
        pt: { xs: 5, md: 8 },
        pb: { xs: 8, md: 12 },
        px: 2,
        background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 45%, #e0f2fe 100%)',
        borderBottom: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorative Circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1.08fr' },
            gap: { xs: 4, lg: 6 },
            alignItems: 'center'
          }}
        >
          {/* ==========================================
               LEFT COLUMN: Headline & Quick Actions
               ========================================== */}
          <Box sx={{ zIndex: 2 }}>
            {/* Tag Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.8,
                borderRadius: 9999,
                bgcolor: '#ffffff',
                border: '1px solid #bae6fd',
                boxShadow: '0 2px 10px rgba(2, 132, 199, 0.08)',
                mb: 2.5
              }}
            >
              <Typography component="span" sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>
                🌟 INTERACTIVE TOURIST MAP • CHIANG RAI
              </Typography>
            </Box>

            {/* Main Headline */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.3rem' },
                color: '#0f172a',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                mb: 2.5
              }}
            >
              เปิดเส้นทางแอ่วเหนือ <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #0284c7 0%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                สัมผัสเสน่ห์เชียงราย
              </span>
              <br />
              ผ่านแผนที่ท่องเที่ยวอัจฉริยะ
            </Typography>

            {/* Sub-headline */}
            <Typography
              variant="body1"
              sx={{
                color: '#475569',
                fontSize: { xs: '1rem', md: '1.12rem' },
                lineHeight: 1.65,
                mb: 3.5,
                maxWidth: 580
              }}
            >
              สำรวจโครงข่ายทางหลวงสายสำคัญ ขับรถชมวิวดอยช้าง สักการะมหาพุทธศิลป์วัดร่องขุ่น และสัมผัสทะเลหมอกภูชี้ฟ้า พร้อมระบบไฮไลต์เส้นทางและจุดแวะเที่ยวแบบเรียลไทม์
            </Typography>

            {/* Quick Route Selector Pills */}
            <Box sx={{ mb: 3.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', display: 'block', mb: 1.2, letterSpacing: '0.04em' }}>
                📍 เลือกไฮไลต์เส้นทางยอดนิยมบนแผนที่:
              </Typography>
              <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
                {POPULAR_ROUTES.map((route) => {
                  const isSelected = activeRouteId === route.id;
                  return (
                    <Chip
                      key={route.id}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <span>{route.label}</span>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              opacity: 0.8,
                              bgcolor: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                              px: 0.8,
                              py: 0.2,
                              borderRadius: 1
                            }}
                          >
                            {route.hwy}
                          </Typography>
                        </Box>
                      }
                      onClick={() => handleSelectRoute(route.id)}
                      sx={{
                        p: 2,
                        height: 38,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        borderRadius: 2.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        bgcolor: isSelected ? route.color : '#ffffff',
                        color: isSelected ? '#ffffff' : '#334155',
                        border: '1.5px solid',
                        borderColor: isSelected ? route.color : '#cbd5e1',
                        boxShadow: isSelected ? `0 6px 18px ${route.color}40` : '0 2px 6px rgba(0,0,0,0.03)',
                        '&:hover': {
                          bgcolor: isSelected ? route.color : '#f8fafc',
                          borderColor: route.color,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>

            {/* Call to Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() =>
                  router.push(
                    `/features?tab=ai-planner&prompt=${encodeURIComponent(
                      `ช่วยวางแผนขับรถเที่ยวเชียงรายตามเส้นทาง: ${activeRoute?.label || 'ดอยช้าง-ดอยตุง'}`
                    )}`
                  )
                }
                sx={{
                  bgcolor: '#0284c7',
                  fontWeight: 800,
                  fontSize: '1rem',
                  py: 1.4,
                  px: 3.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(2, 132, 199, 0.3)',
                  '&:hover': {
                    bgcolor: '#0369a1',
                    boxShadow: '0 12px 28px rgba(2, 132, 199, 0.4)'
                  }
                }}
              >
                ✨ วางแผนเส้นทางนี้กับ AI ➔
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  const target = document.getElementById('recommended-trails-section');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    router.push('/features');
                  }
                }}
                sx={{
                  color: '#334155',
                  borderColor: '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1.4,
                  px: 3,
                  borderRadius: 3,
                  textTransform: 'none',
                  bgcolor: '#ffffff',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    borderColor: '#94a3b8'
                  }
                }}
              >
                ดูรายละเอียดตารางทริป
              </Button>
            </Stack>

            {/* Stats Indicators */}
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2.5, sm: 4 },
                pt: 2.5,
                borderTop: '1px solid rgba(226, 232, 240, 0.8)'
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                  18 อำเภอ
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  ครอบคลุมทั้งจังหวัด
                </Typography>
              </Box>
              <Box sx={{ width: '1px', bgcolor: '#e2e8f0' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                  15+ แลนด์มาร์ก
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  พุทธศิลป์ & ธรรมชาติ
                </Typography>
              </Box>
              <Box sx={{ width: '1px', bgcolor: '#e2e8f0' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                  7 ทางหลวงหลัก
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  เชื่อมต่อสะดวกทุกเส้นทาง
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ==========================================
               RIGHT COLUMN: Interactive Chiang Rai Road Map
               ========================================== */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 4.5,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              bgcolor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              p: { xs: 1.5, sm: 2 }
            }}
          >
            <ChiangRaiRoadMap activeTrailId={activeRouteId} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
