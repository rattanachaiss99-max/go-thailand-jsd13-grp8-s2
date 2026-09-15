'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import ContainerWrapper from '@/components/ContainerWrapper';
import StampShowcaseSection from '@/views/landings/default/StampShowcaseSection';
import TripBookingSimulatorSection from '@/views/landings/default/TripBookingSimulatorSection';
import AiTravelCompanion from '@/components/ai/AiTravelCompanion';
import RecommendedTrailsSection from '@/views/landings/default/RecommendedTrailsSection';
import HeroMapSection from '@/views/landings/default/HeroMapSection';
type FeatureTab = 'stamps' | 'ai-planner' | 'trails';

function FeaturesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<FeatureTab>('stamps');
  const [selectedTrailId, setSelectedTrailId] = useState<string>('trail-slowlife-coffee');

  // ซิงค์แท็บจาก URL query param
  useEffect(() => {
    if (tabQuery === 'ai-planner') {
      setActiveTab('ai-planner');
    } else if (tabQuery === 'trails') {
      setActiveTab('trails');
    } else if (tabQuery === 'stamps') {
      setActiveTab('stamps');
    }
  }, [tabQuery]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: FeatureTab) => {
    setActiveTab(newValue);
    router.push(`/features?tab=${newValue}`, { scroll: false });
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      {/* 1. Header & Submenu Switcher Bar */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          py: 2.5,
          position: 'sticky',
          top: 0,
          zIndex: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}
      >
        <ContainerWrapper>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#0284c7',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 0.3
                }}
              >
                FEATURE SHOWCASE • แนะนำฟีเจอร์
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                {activeTab === 'stamps' && '🗺️ เมนูย่อยที่ 1: แสตมป์พาสปอร์ต'}
                {activeTab === 'ai-planner' && '✨ เมนูย่อยที่ 2: เพื่อนวางแผนเที่ยว'}
                {activeTab === 'trails' && '🧭 เมนูย่อยที่ 3: เส้นทางแนะนำ'}
              </Typography>
            </Box>

            {/* Submenu Tabs Switcher */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                bgcolor: '#f1f5f9',
                p: 0.5,
                borderRadius: 3,
                minHeight: 46,
                '& .MuiTabs-indicator': { display: 'none' }
              }}
            >
              <Tab
                value="stamps"
                label="🗺️ 1. แสตมป์พาสปอร์ต"
                sx={{
                  borderRadius: 2.5,
                  minHeight: 40,
                  px: { xs: 1.8, sm: 2.5 },
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  color: '#64748b',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    bgcolor: '#ffffff',
                    color: '#0284c7',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }
                }}
              />
              <Tab
                value="ai-planner"
                label="✨ 2. เพื่อนวางแผนเที่ยว"
                sx={{
                  borderRadius: 2.5,
                  minHeight: 40,
                  px: { xs: 1.8, sm: 2.5 },
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  color: '#64748b',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    bgcolor: '#ffffff',
                    color: '#0284c7',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }
                }}
              />
              <Tab
                value="trails"
                label="🧭 3. เส้นทางแนะนำ"
                sx={{
                  borderRadius: 2.5,
                  minHeight: 40,
                  px: { xs: 1.8, sm: 2.5 },
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  color: '#64748b',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    bgcolor: '#ffffff',
                    color: '#0284c7',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }
                }}
              />
            </Tabs>
          </Stack>
        </ContainerWrapper>
      </Box>

      {/* 2. Dynamic Feature Component Display */}
      {activeTab === 'stamps' && (
        <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
          <StampShowcaseSection />
          {/* Section แยกต่อท้าย: แซนด์บ็อกซ์ทดสอบจัดทริป 3 เสาหลัก (ที่พัก + ไกด์ + คนขับ) */}
          <TripBookingSimulatorSection />
        </Box>
      )}
      {activeTab === 'ai-planner' && (
        <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
          <AiTravelCompanion />
        </Box>
      )}
      {activeTab === 'trails' && (
        <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
          <HeroMapSection
            activeRouteId={selectedTrailId}
            onRouteChange={(routeId) => setSelectedTrailId(routeId)}
          />
          <RecommendedTrailsSection
            selectedTrailId={selectedTrailId}
            onSelectTrail={(trail) => setSelectedTrailId(trail.id)}
            showMap={false}
          />
        </Box>
      )}
    </Box>
  );
}

export default function FeaturesPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>กำลังโหลดข้อมูลฟีเจอร์...</Box>
      }
    >
      <FeaturesContent />
    </Suspense>
  );
}
