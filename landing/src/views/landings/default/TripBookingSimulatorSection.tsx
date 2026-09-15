'use client';

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import { motion, AnimatePresence } from 'framer-motion';

import ContainerWrapper from '@/components/ContainerWrapper';
import ProvincePostageStamp from '@/components/profile/ProvincePostageStamp';
import { THAILAND_PROVINCES, Province, REGION_METAS, getProvinceByIdOrSlug } from '@/data/thailandProvinces';
import { properties } from '@/data/properties';
import { guides } from '@/data/guides';
import { CHAUFFEUR_FLEET } from '@/data/carStamps';

// Curated highlight destination provinces
const FEATURED_PROVINCES = [
  { slug: 'chiang-mai', icon: '🏔️', name: 'เชียงใหม่' },
  { slug: 'phuket', icon: '🏖️', name: 'ภูเก็ต' },
  { slug: 'bangkok', icon: '🏛️', name: 'กรุงเทพฯ' },
  { slug: 'nan', icon: '🌿', name: 'น่าน' },
  { slug: 'krabi', icon: '🛶', name: 'กระบี่' },
  { slug: 'sukhothai', icon: '🛕', name: 'สุโขทัย' }
];

export default function TripBookingSimulatorSection() {
  const [selectedSlug, setSelectedSlug] = useState<string>('chiang-mai');
  const [activeTab, setActiveTab] = useState<'stay' | 'guide' | 'chauffeur'>('stay');
  const [nights, setNights] = useState<number>(2);

  // Selected items state
  const [selectedStayId, setSelectedStayId] = useState<string | null>(properties[0]?.id || null);
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(guides[1]?.id || null);
  const [selectedChauffeurId, setSelectedChauffeurId] = useState<string | null>(CHAUFFEUR_FLEET[0]?.id || null);

  // Simulation booking state
  const [bookedProvinces, setBookedProvinces] = useState<Set<string>>(new Set());
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const currentProvince: Province = getProvinceByIdOrSlug(selectedSlug) || THAILAND_PROVINCES[0];
  const isCurrentBooked = bookedProvinces.has(currentProvince.slug);

  // Filter Stays (Yok)
  const availableStays = useMemo(() => {
    // Try matching region or location
    const matched = properties.filter((p) => {
      const loc = p.location.toLowerCase();
      return loc.includes(currentProvince.nameEn.toLowerCase()) || p.region === currentProvince.region;
    });
    return matched.length > 0 ? matched : properties.slice(0, 4);
  }, [currentProvince]);

  // Filter Guides (Meng)
  const availableGuides = useMemo(() => {
    const matched = guides.filter((g) => {
      const loc = (g.location || '').toLowerCase();
      return loc.includes(currentProvince.nameEn.toLowerCase()) || loc.includes('all') || loc.includes('thailand');
    });
    return matched.length > 0 ? matched : guides.slice(0, 4);
  }, [currentProvince]);

  // Available Chauffeurs (Guitar)
  const availableChauffeurs = useMemo(() => {
    return CHAUFFEUR_FLEET;
  }, []);

  // Selected objects
  const selectedStay = properties.find((p) => p.id === selectedStayId) || null;
  const selectedGuide = guides.find((g) => g.id === selectedGuideId) || null;
  const selectedChauffeur = CHAUFFEUR_FLEET.find((c) => c.id === selectedChauffeurId) || null;

  // Price calculations
  const stayCost = selectedStay ? selectedStay.pricePerNight * nights : 0;
  const guideCost = selectedGuide ? selectedGuide.pricePerDay * nights : 0;
  const chauffeurCost = selectedChauffeur ? selectedChauffeur.dailyRate * nights : 0;
  const subtotal = stayCost + guideCost + chauffeurCost;

  // Trio Bundle Discount (15% off when selecting all 3 pillars)
  const isTrioBundle = Boolean(selectedStay && selectedGuide && selectedChauffeur);
  const bundleDiscount = isTrioBundle ? Math.round(subtotal * 0.15) : 0;
  const totalPrice = Math.max(0, subtotal - bundleDiscount);

  // Handle simulate booking
  const handleSimulateBooking = () => {
    setBookedProvinces((prev) => {
      const next = new Set(prev);
      next.add(currentProvince.slug);
      return next;
    });
    setIsSuccessToast(true);
    setTimeout(() => {
      setIsSuccessToast(false);
    }, 4500);
  };

  const handleResetTrip = () => {
    setBookedProvinces((prev) => {
      const next = new Set(prev);
      next.delete(currentProvince.slug);
      return next;
    });
  };

  return (
    <Box
      id="trip-booking-simulator"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #E2E8F0'
      }}
    >
      <ContainerWrapper>
        {/* Header Content */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Chip
            label="🧪 แซนด์บ็อกซ์ทดสอบจัดทริป • TRIO BUNDLE TESTBED"
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              mb: 1.5,
              bgcolor: 'rgba(2, 132, 199, 0.12)',
              color: '#0284C7'
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 1.5,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.75rem', md: '2.4rem' }
            }}
          >
            ทดสอบจัดทริป 3 เสาหลัก (ที่พัก + ไกด์ + คนขับ)
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748B',
              maxWidth: 750,
              mx: 'auto',
              fontSize: { xs: '0.9rem', md: '1.05rem' },
              lineHeight: 1.6
            }}
          >
            จุดทดสอบบูรณาการระบบข้ามสายงานจากเพื่อนร่วมทีม เลือกที่พัก (Yok), ไกด์นำเที่ยว (Meng) และคนขับประจำตัว (Guitar)
            แล้วกดจำลองการจองเพื่อทดสอบการปลดล็อกแสตมป์พาสปอร์ตประจำจังหวัดแบบ Real-Time
          </Typography>

          {/* Quick Destination Pills */}
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ gap: 1, mt: 3 }}>
            {FEATURED_PROVINCES.map((p) => {
              const isSelected = selectedSlug === p.slug;
              const isPassed = bookedProvinces.has(p.slug);
              return (
                <Button
                  key={p.slug}
                  variant={isSelected ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => {
                    setSelectedSlug(p.slug);
                  }}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    bgcolor: isSelected ? '#0284C7' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    borderColor: isSelected ? '#0284C7' : '#CBD5E1',
                    '&:hover': {
                      bgcolor: isSelected ? '#0369A1' : 'rgba(2, 132, 199, 0.08)',
                      borderColor: '#0284C7'
                    }
                  }}
                >
                  {p.icon} {p.name} {isPassed && '✓'}
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* Main Grid: Left Service Picker, Right Live Summary & Stamp */}
        <Grid container spacing={3.5} alignItems="flex-start">
          {/* Left Column: Service Selector (Stay / Guide / Chauffeur) */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 4,
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0'
              }}
            >
              {/* Service Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="fullWidth"
                sx={{
                  bgcolor: '#E2E8F0',
                  borderRadius: 3,
                  p: 0.5,
                  mb: 3,
                  '& .MuiTabs-indicator': { display: 'none' }
                }}
              >
                <Tab
                  value="stay"
                  label={`🏡 1. ที่พัก (${selectedStay ? 'เลือกแล้ว' : 'ยังไม่เลือก'})`}
                  sx={{
                    borderRadius: 2.5,
                    minHeight: 44,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: '#64748B',
                    '&.Mui-selected': {
                      bgcolor: '#FFFFFF',
                      color: '#0F172A',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }
                  }}
                />
                <Tab
                  value="guide"
                  label={`🧭 2. ไกด์ท้องถิ่น (${selectedGuide ? 'เลือกแล้ว' : 'ยังไม่เลือก'})`}
                  sx={{
                    borderRadius: 2.5,
                    minHeight: 44,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: '#64748B',
                    '&.Mui-selected': {
                      bgcolor: '#FFFFFF',
                      color: '#0F172A',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }
                  }}
                />
                <Tab
                  value="chauffeur"
                  label={`🚗 3. คนขับรถ (${selectedChauffeur ? 'เลือกแล้ว' : 'ยังไม่เลือก'})`}
                  sx={{
                    borderRadius: 2.5,
                    minHeight: 44,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: '#64748B',
                    '&.Mui-selected': {
                      bgcolor: '#FFFFFF',
                      color: '#0F172A',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }
                  }}
                />
              </Tabs>

              {/* Tab 1: ที่พัก (Accommodations - Yok) */}
              {activeTab === 'stay' && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#334155' }}>
                    เลือกที่พักในโซน {currentProvince.nameTh} (โมดูล Yok):
                  </Typography>
                  <Grid container spacing={2}>
                    {availableStays.slice(0, 4).map((item) => {
                      const isSelected = selectedStayId === item.id;
                      return (
                        <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
                          <Card
                            onClick={() => setSelectedStayId(isSelected ? null : item.id)}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              border: isSelected ? '2px solid #0284C7' : '1px solid #E2E8F0',
                              bgcolor: isSelected ? '#F0F9FF' : '#FFFFFF',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
                              }
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Box
                                component="img"
                                src={item.images[0]}
                                alt={item.name}
                                sx={{
                                  width: 70,
                                  height: 70,
                                  borderRadius: 2,
                                  objectFit: 'cover'
                                }}
                              />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography noWrap variant="subtitle2" sx={{ fontWeight: 800 }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  📍 {item.location}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
                                  ฿{item.pricePerNight.toLocaleString()} / คืน
                                </Typography>
                              </Box>
                            </Stack>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              {/* Tab 2: ไกด์ท้องถิ่น (Guides - Meng) */}
              {activeTab === 'guide' && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#334155' }}>
                    เลือกไกด์ผู้เชี่ยวชาญประจำจังหวัด (โมดูล Meng):
                  </Typography>
                  <Grid container spacing={2}>
                    {availableGuides.slice(0, 4).map((guide) => {
                      const isSelected = selectedGuideId === guide.id;
                      return (
                        <Grid size={{ xs: 12, sm: 6 }} key={guide.id}>
                          <Card
                            onClick={() => setSelectedGuideId(isSelected ? null : guide.id)}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              border: isSelected ? '2px solid #059669' : '1px solid #E2E8F0',
                              bgcolor: isSelected ? '#F0FDF4' : '#FFFFFF',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
                              }
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar
                                src={guide.photoUrl}
                                alt={guide.name}
                                sx={{ width: 60, height: 60, border: '2px solid #10B981' }}
                              />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                  {guide.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, display: 'block' }}>
                                  ★ {guide.specialty}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#059669', mt: 0.5 }}>
                                  ฿{guide.pricePerDay.toLocaleString()} / วัน
                                </Typography>
                              </Box>
                            </Stack>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              {/* Tab 3: คนขับรถ & ยานพาหนะ (Chauffeur - Guitar) */}
              {activeTab === 'chauffeur' && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#334155' }}>
                    เลือกคนขับรถและพาหนะรับส่ง (โมดูล Guitar):
                  </Typography>
                  <Grid container spacing={2}>
                    {availableChauffeurs.slice(0, 4).map((ch) => {
                      const isSelected = selectedChauffeurId === ch.id;
                      return (
                        <Grid size={{ xs: 12, sm: 6 }} key={ch.id}>
                          <Card
                            onClick={() => setSelectedChauffeurId(isSelected ? null : ch.id)}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              border: isSelected ? '2px solid #D97706' : '1px solid #E2E8F0',
                              bgcolor: isSelected ? '#FFFBEB' : '#FFFFFF',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
                              }
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar
                                src={ch.driver.avatar}
                                alt={ch.driver.nameTh}
                                sx={{ width: 60, height: 60, border: `2px solid ${ch.badgeColor}` }}
                              />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography noWrap variant="subtitle2" sx={{ fontWeight: 800 }}>
                                  {ch.nameTh}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  👤 {ch.driver.nameTh}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#D97706', mt: 0.5 }}>
                                  ฿{ch.dailyRate.toLocaleString()} / วัน
                                </Typography>
                              </Box>
                            </Stack>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column: Live Trip Summary & Stamp Unlocking */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: isCurrentBooked ? '2px solid #10B981' : '1px solid #CBD5E1',
                bgcolor: '#FFFFFF',
                boxShadow: isCurrentBooked
                  ? '0 12px 30px rgba(16, 185, 129, 0.15)'
                  : '0 6px 20px rgba(0,0,0,0.04)',
                position: 'sticky',
                top: 90
              }}
            >
              {/* Stamp Preview Center */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 0.5 }}>
                  🔖 พาสปอร์ตแสตมป์ {currentProvince.nameTh}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
                  <ProvincePostageStamp
                    key={`simulator-stamp-${currentProvince.slug}-${isCurrentBooked}`}
                    province={currentProvince}
                    isVisited={isCurrentBooked}
                    size="medium"
                    variant="stamp_1"
                    hideText={true}
                    animated={true}
                  />
                </Box>

                <Chip
                  label={isCurrentBooked ? '🎉 ปลดล็อกแล้ว (Unlocked)' : '🔒 ยังไม่ปลดล็อก (Locked)'}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    bgcolor: isCurrentBooked ? 'rgba(16, 185, 129, 0.15)' : '#F1F5F9',
                    color: isCurrentBooked ? '#059669' : '#64748B'
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Package Details */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#0F172A' }}>
                รายการในแพ็กเกจทริป ({nights} วัน {nights - 1} คืน):
              </Typography>

              <Stack spacing={1} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    🏡 ที่พัก:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {selectedStay ? `฿${stayCost.toLocaleString()}` : '—'}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    🧭 ไกด์:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {selectedGuide ? `฿${guideCost.toLocaleString()}` : '—'}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    🚗 คนขับ:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {selectedChauffeur ? `฿${chauffeurCost.toLocaleString()}` : '—'}
                  </Typography>
                </Stack>

                {isTrioBundle && (
                  <Stack direction="row" justifyContent="space-between" sx={{ color: '#059669' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>
                      🎁 Trio Bundle ส่วนลด 15%:
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>
                      -฿{bundleDiscount.toLocaleString()}
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  ยอดรวมทดสอบ:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0284C7' }}>
                  ฿{totalPrice.toLocaleString()}
                </Typography>
              </Stack>

              {/* Action Buttons */}
              <AnimatePresence>
                {isSuccessToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ marginBottom: 12 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        borderRadius: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#065F46', display: 'block' }}>
                        ✓ จำลองการจองสำเร็จ! ได้รับ +150 แต้มสะสม
                      </Typography>
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isCurrentBooked ? (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSimulateBooking}
                  disabled={subtotal === 0}
                  sx={{
                    py: 1.5,
                    borderRadius: 2.5,
                    fontWeight: 800,
                    bgcolor: '#0284C7',
                    '&:hover': { bgcolor: '#0369A1' }
                  }}
                >
                  🚀 ทดสอบยืนยันการจอง & ปลดล็อกแสตมป์
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={handleResetTrip}
                  color="inherit"
                  sx={{
                    py: 1.5,
                    borderRadius: 2.5,
                    fontWeight: 800
                  }}
                >
                  🔄 รีเซ็ตการทดสอบแสตมป์นี้
                </Button>
              )}
            </Card>
          </Grid>
        </Grid>
      </ContainerWrapper>
    </Box>
  );
}
