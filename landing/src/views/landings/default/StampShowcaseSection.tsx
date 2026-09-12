'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Marquee from 'react-fast-marquee';
import { motion, AnimatePresence } from 'framer-motion';

import ContainerWrapper from '@/components/ContainerWrapper';
import FloatingStamp from '@/components/animations/FloatingStamp';
import ProvincePostageStamp from '@/components/profile/ProvincePostageStamp';
import { THAILAND_PROVINCES, Province, REGION_METAS, getProvinceByIdOrSlug } from '@/data/thailandProvinces';

// Curated highlight provinces from all regions
const FEATURED_PROVINCE_SLUGS = [
  'chiang-mai',
  'phuket',
  'bangkok',
  'nan',
  'krabi',
  'chon-buri',
  'kanchanaburi',
  'udon-thani',
  'sukhothai',
  'surat-thani'
];

export default function StampShowcaseSection() {
  // Find featured provinces
  const marqueeProvinces = FEATURED_PROVINCE_SLUGS.map((slug) => getProvinceByIdOrSlug(slug)).filter(
    (p): p is Province => Boolean(p)
  );

  // Interactive demo state
  const [selectedSlug, setSelectedSlug] = useState<string>('chiang-mai');
  const [stampedProvinces, setStampedProvinces] = useState<Set<string>>(new Set(['bangkok', 'phuket']));
  const [showRewardToast, setShowRewardToast] = useState(false);

  const currentProvince = getProvinceByIdOrSlug(selectedSlug) || marqueeProvinces[0];
  const isCurrentStamped = stampedProvinces.has(currentProvince.slug);

  const handleToggleStamp = () => {
    setStampedProvinces((prev) => {
      const next = new Set(prev);
      if (next.has(currentProvince.slug)) {
        next.delete(currentProvince.slug);
        setShowRewardToast(false);
      } else {
        next.add(currentProvince.slug);
        setShowRewardToast(true);
        setTimeout(() => setShowRewardToast(false), 3500);
      }
      return next;
    });
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#FAF8F5',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'rgba(0,0,0,0.06)'
      }}
    >
      {/* Decorative subtle background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -100,
          width: 360,
          height: 360,
          borderRadius: '50%',
          bgcolor: 'rgba(16, 185, 129, 0.05)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          bgcolor: 'rgba(2, 132, 199, 0.05)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <ContainerWrapper>
        {/* Header Content */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Chip
              label="GAMIFICATION & DIGITAL PASSPORT"
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                mb: 1.5,
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: '#059669'
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 1.5,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}
            >
              สะสมตราประทับ 77 จังหวัด — ทุกก้าวเดินทางมีความหมาย
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748B',
                maxWidth: 720,
                mx: 'auto',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                lineHeight: 1.6
              }}
            >
              เปิดมิติใหม่ของการเที่ยวไทย ทุกครั้งที่จองที่พัก รถเช่า หรือไกด์ท้องถิ่น
              จะได้รับแสตมป์เวกเตอร์ประจำจังหวัด ปลดล็อกถ้วยรางวัลและคะแนนสะสมในสมุด Travel Passport ของคุณ
            </Typography>
          </motion.div>
        </Box>

        {/* 1. Infinite Scrolling Stamp Ticker (Marquee) */}
        <Box sx={{ mb: { xs: 6, md: 10 }, mx: { xs: -2, md: 0 } }}>
          <Marquee
            pauseOnHover={true}
            speed={35}
            gradient={true}
            gradientColor="#FAF8F5"
            gradientWidth={80}
          >
            {marqueeProvinces.map((prov, index) => {
              const isStamped = stampedProvinces.has(prov.slug);
              return (
                <Box
                  key={prov.id}
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: 3,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedSlug(prov.slug)}
                >
                  <FloatingStamp
                    province={prov}
                    isVisited={isStamped}
                    size="small"
                    floatOffset={index * 0.4}
                    floatDistance={6}
                    rotationOffset={(index % 4) * 2 - 3}
                    badgeLabel={REGION_METAS[prov.region]?.labelTh}
                    animated={false}
                  />
                </Box>
              );
            })}
          </Marquee>
        </Box>

        {/* 2. Interactive Passport Experience Booth */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5, md: 6 },
            borderRadius: 4,
            bgcolor: '#FFFFFF',
            border: '1px solid',
            borderColor: 'rgba(226, 232, 240, 0.9)',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)'
          }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left: Stamp Animation Display */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#F8FAFC',
                  borderRadius: 3,
                  py: 5,
                  px: 3,
                  border: '1.5px dashed #E2E8F0',
                  position: 'relative'
                }}
              >
                {/* Reward Celebration Popup */}
                <AnimatePresence>
                  {showRewardToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{
                        position: 'absolute',
                        top: 14,
                        zIndex: 20
                      }}
                    >
                      <Chip
                        label="🎉 ปลดล็อกสำเร็จ! +150 แต้มสะสม"
                        sx={{
                          bgcolor: '#059669',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          boxShadow: '0 8px 20px rgba(5, 150, 105, 0.4)',
                          py: 2
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* The Core Animated Stamp */}
                <Box sx={{ my: 1, transform: 'scale(1.05)' }}>
                  <ProvincePostageStamp
                    key={`showcase-stamp-${currentProvince.slug}-${isCurrentStamped}`}
                    province={currentProvince}
                    isVisited={isCurrentStamped}
                    size="large"
                    animated={true}
                    interactiveHover={true}
                  />
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    mt: 2.5,
                    color: 'text.secondary',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  ⚡ เวกเตอร์ SVG แผนที่แท้ วาดเส้นแบบไดนามิกตามพิกัดจังหวัด
                </Typography>
              </Box>
            </Grid>

            {/* Right: Controls & Gamification Info */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box>
                {/* Quick Province Switcher Pills */}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1.5 }}>
                  เลือกจังหวัดที่ต้องการทดลองประทับตรา:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 3 }}>
                  {[
                    { slug: 'chiang-mai', icon: '🏔️', name: 'เชียงใหม่' },
                    { slug: 'phuket', icon: '🏖️', name: 'ภูเก็ต' },
                    { slug: 'bangkok', icon: '🏛️', name: 'กรุงเทพฯ' },
                    { slug: 'nan', icon: '🌿', name: 'น่าน' },
                    { slug: 'krabi', icon: '🛶', name: 'กระบี่' }
                  ].map((p) => {
                    const isSelected = selectedSlug === p.slug;
                    return (
                      <Button
                        key={p.slug}
                        variant={isSelected ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => {
                          setSelectedSlug(p.slug);
                          setShowRewardToast(false);
                        }}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          textTransform: 'none',
                          bgcolor: isSelected ? 'primary.main' : 'transparent',
                          borderColor: isSelected ? 'primary.main' : '#E2E8F0',
                          color: isSelected ? '#FFFFFF' : 'text.primary',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isSelected ? 'primary.dark' : 'rgba(16, 185, 129, 0.08)'
                          }
                        }}
                      >
                        {p.icon} {p.name}
                      </Button>
                    );
                  })}
                </Stack>

                {/* Province Details */}
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, color: '#0F172A' }}>
                  {currentProvince.nameTh} ({currentProvince.nameEn})
                </Typography>
                <Typography variant="body2" sx={{ color: '#059669', fontWeight: 700, mb: 1.5 }}>
                  📍 รหัสจังหวัด: {currentProvince.id} • ภูมิภาค: {REGION_METAS[currentProvince.region]?.labelTh}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
                  {currentProvince.slogan ||
                    'สัมผัสเสน่ห์วิถีชีวิต วัฒนธรรมท้องถิ่น และธรรมชาติอันงดงามที่รอให้คุณไปค้นหา'}
                </Typography>

                {/* Progress bar simulation */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#F8FAFC',
                    borderRadius: 2.5,
                    border: '1px solid #E2E8F0',
                    mb: 3.5
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      ความคืบหน้าการสะสมแสตมป์พาสปอร์ต
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669' }}>
                      {stampedProvinces.size} / 77 จังหวัด
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: '#E2E8F0',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        width: `${Math.round((stampedProvinces.size / 77) * 100)}%`,
                        minWidth: '6%',
                        height: '100%',
                        bgcolor: '#10B981',
                        borderRadius: 4,
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    🏆 ปลดล็อก Trio Bundle จองครบ 3 ขา (ที่พัก + รถเช่า + ไกด์) รับสิทธิ์อัปเกรด Gold Tier ทันที
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleToggleStamp}
                    sx={{
                      fontWeight: 800,
                      borderRadius: 2.5,
                      py: 1.3,
                      px: 3.5,
                      fontSize: '0.95rem',
                      bgcolor: isCurrentStamped ? '#DC2626' : '#059669',
                      '&:hover': {
                        bgcolor: isCurrentStamped ? '#B91C1C' : '#047857'
                      },
                      boxShadow: isCurrentStamped
                        ? '0 8px 20px rgba(220, 38, 38, 0.3)'
                        : '0 8px 20px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    {isCurrentStamped ? '🔄 ยกเลิกตราประทับ (Reset)' : '🔖 ประทับตราแสตมป์ (Stamp It!)'}
                  </Button>

                  <Button
                    component={NextLink}
                    href="/profile"
                    variant="outlined"
                    size="large"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2.5,
                      py: 1.3,
                      px: 3,
                      fontSize: '0.95rem',
                      borderColor: '#CBD5E1',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: '#059669',
                        color: '#059669',
                        bgcolor: 'rgba(5, 150, 105, 0.04)'
                      }
                    }}
                  >
                    📖 เปิดดูสมุด Travel Passport ฉบับเต็ม
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </ContainerWrapper>
    </Box>
  );
}
