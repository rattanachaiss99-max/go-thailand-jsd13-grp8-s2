'use client';

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';

import CarPostageStamp from './CarPostageStamp';
import {
  CHAUFFEUR_FLEET,
  CHAUFFEUR_CATEGORIES,
  ChauffeurFleetItem,
  ChauffeurCategory
} from '@/data/carStamps';
import CarSvgRenderer from '@/components/cars/svg/CarSvgRenderer';

export default function CarStampAlbum() {
  // Online drivers state (default: 4-door sedan and SUV captains)
  const [onlineDriverIds, setOnlineDriverIds] = useState<Set<string>>(
    new Set(['sedan-4door', 'white-suv'])
  );

  const [selectedCategory, setSelectedCategory] = useState<ChauffeurCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'standby'>('all');
  const [inspectChauffeur, setInspectChauffeur] = useState<ChauffeurFleetItem | null>(null);
  const [selectedSimDriver, setSelectedSimDriver] = useState<string>('sedan-4door');
  const [callAlert, setCallAlert] = useState<string | null>(null);

  // Toggle driver online status
  const handleToggleDriverStatus = (id: string) => {
    setOnlineDriverIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter fleet
  const filteredFleet = useMemo(() => {
    return CHAUFFEUR_FLEET.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      const isOnline = onlineDriverIds.has(item.id);
      if (statusFilter === 'online' && !isOnline) return false;
      if (statusFilter === 'standby' && isOnline) return false;
      return true;
    });
  }, [selectedCategory, statusFilter, onlineDriverIds]);

  const totalOnline = onlineDriverIds.size;
  const totalDrivers = CHAUFFEUR_FLEET.length;

  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: { xs: 3, md: 4 },
        border: '1px solid #E2E8F0',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        overflow: 'hidden'
      }}
    >
      {/* 1. Header & Live Chauffeur Network Status */}
      <Box sx={{ mb: { xs: 2.5, md: 3.5 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1.5, md: 2 }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{ mb: 2 }}
        >
          <Box sx={{ maxWidth: 640 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: '#0F172A',
                fontSize: { xs: '1.2rem', sm: '1.45rem', md: '1.65rem' },
                mb: 0.5
              }}
            >
              🤵 พนักงานขับรถประจำตัว & ยานพาหนะ (Dedicated Chauffeurs)
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              คนขับรถส่วนตัวที่พร้อมให้บริการออนไลน์สำหรับคุณ — ตรวจสอบประวัติความปลอดภัย สเปกรถยนต์ และเรียกใช้บริการได้ตลอด 24 ชม.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip
              icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FFFFFF', ml: 1 }} />}
              label={`ออนไลน์ ${totalOnline} นาย`}
              sx={{
                bgcolor: totalOnline > 0 ? '#059669' : '#64748B',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: { xs: '0.75rem', sm: '0.82rem' },
                height: 28
              }}
            />
            <Chip
              label={`ทีมงาน ${totalDrivers} คน`}
              variant="outlined"
              sx={{
                borderColor: '#CBD5E1',
                color: '#475569',
                fontWeight: 700,
                fontSize: { xs: '0.75rem', sm: '0.82rem' },
                height: 28
              }}
            />
          </Stack>
        </Stack>

        {/* Live Status Banner */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: { xs: 2.5, sm: 3 },
            bgcolor: totalOnline > 0 ? '#ECFDF5' : '#F8FAFC',
            border: totalOnline > 0 ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
            display: 'flex',
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, flexShrink: 0 }}>🟢</Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: '#065F46',
                  fontSize: { xs: '0.82rem', sm: '0.9rem' }
                }}
              >
                พนักงานขับรถประจำตัวของคุณกำลังออนไลน์อยู่ในขณะนี้
              </Typography>
              <Typography variant="caption" sx={{ color: '#047857', fontSize: { xs: '0.72rem', sm: '0.78rem' }, display: 'block' }}>
                คุณศิวัต (ซีดาน 4 ประตู) และทีมงาน สแตนด์บายอยู่ที่ สนามบินสุวรรณภูมิ พร้อมรับรองการเดินทาง
              </Typography>
            </Box>
          </Stack>

          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => {
              const driver = CHAUFFEUR_FLEET.find((d) => d.id === 'sedan-4door');
              if (driver) setInspectChauffeur(driver);
            }}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
              whiteSpace: 'nowrap',
              py: 0.8
            }}
          >
            ดูโปรไฟล์กัปตันศิวัต ➔
          </Button>
        </Box>
      </Box>

      {/* 2. Dispatch / Status Simulator Bar (Responsive) */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: { xs: 2.5, sm: 3 },
          borderRadius: { xs: 2.5, sm: 3 },
          bgcolor: '#F8FAFC',
          border: '1px dashed #CBD5E1',
          display: 'flex',
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1.5
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: { xs: '0.84rem', sm: '0.9rem' } }}>
            🧪 เครื่องมือจำลองสถานะคนขับ (Chauffeur Status Simulator)
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: { xs: '0.72rem', sm: '0.78rem' }, display: 'block' }}>
            ทดสอบสลับสถานะออนไลน์/ออฟไลน์ของพนักงานขับรถแต่ละท่าน
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems="stretch"
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          <TextField
            select
            size="small"
            value={selectedSimDriver}
            onChange={(e) => setSelectedSimDriver(e.target.value)}
            sx={{
              minWidth: { xs: '100%', sm: 220 },
              bgcolor: '#FFFFFF',
              '& .MuiInputBase-input': { fontSize: '0.82rem' }
            }}
          >
            {CHAUFFEUR_FLEET.map((item) => (
              <MenuItem key={item.id} value={item.id} sx={{ fontSize: '0.82rem' }}>
                {item.driver.nameTh.split('(')[0]} ({item.nameTh})
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleToggleDriverStatus(selectedSimDriver)}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              whiteSpace: 'nowrap',
              py: { xs: 0.9, sm: 0.6 },
              bgcolor: onlineDriverIds.has(selectedSimDriver) ? '#DC2626' : '#059669',
              '&:hover': {
                bgcolor: onlineDriverIds.has(selectedSimDriver) ? '#B91C1C' : '#047857'
              }
            }}
          >
            {onlineDriverIds.has(selectedSimDriver) ? '🔴 พักเวร (Offline)' : '🟢 ให้คนขับออนไลน์ (Online)'}
          </Button>
        </Stack>
      </Box>

      {/* 3. Category & Status Filters (Touch Scroll Friendly) */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        {/* Category Chips - Touch Horizontal Scroll with hidden scrollbars */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            pb: 0.5
          }}
        >
          {CHAUFFEUR_CATEGORIES.map((cat) => (
            <Chip
              key={cat.key}
              label={`${cat.icon} ${cat.labelTh}`}
              clickable
              onClick={() => setSelectedCategory(cat.key)}
              variant={selectedCategory === cat.key ? 'filled' : 'outlined'}
              color={selectedCategory === cat.key ? 'primary' : 'default'}
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.74rem', sm: '0.8rem' },
                whiteSpace: 'nowrap',
                height: { xs: 28, sm: 32 }
              }}
            />
          ))}
        </Stack>

        {/* Status Filter */}
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ overflowX: 'auto', pb: 0.5 }}>
          <Chip
            label="ทั้งหมด"
            size="small"
            clickable
            onClick={() => setStatusFilter('all')}
            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, fontSize: { xs: '0.72rem', sm: '0.78rem' } }}
          />
          <Chip
            label="🟢 ออนไลน์"
            size="small"
            clickable
            onClick={() => setStatusFilter('online')}
            variant={statusFilter === 'online' ? 'filled' : 'outlined'}
            color="success"
            sx={{ fontWeight: 600, fontSize: { xs: '0.72rem', sm: '0.78rem' } }}
          />
          <Chip
            label="⚪ สแตนด์บาย"
            size="small"
            clickable
            onClick={() => setStatusFilter('standby')}
            variant={statusFilter === 'standby' ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, fontSize: { xs: '0.72rem', sm: '0.78rem' } }}
          />
        </Stack>
      </Stack>

      {/* 4. Chauffeur Cards Grid (Responsive Fluid Grid) */}
      {filteredFleet.length === 0 ? (
        <Alert severity="info" sx={{ my: 4, borderRadius: 2 }}>
          ไม่พบรายการพนักงานขับรถในหมวดหมู่นี้
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(160px, 1fr))',
              sm: 'repeat(auto-fill, minmax(210px, 1fr))',
              md: 'repeat(auto-fill, minmax(235px, 1fr))'
            },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            justifyItems: 'center',
            py: 1
          }}
        >
          {filteredFleet.map((item) => {
            const isOnline = onlineDriverIds.has(item.id);
            return (
              <CarPostageStamp
                key={item.id}
                chauffeur={item}
                isActive={isOnline}
                size="medium"
                onClick={(selected) => setInspectChauffeur(selected)}
              />
            );
          })}
        </Box>
      )}

      {/* 5. Driver Full Profile Modal Dialog (Fully Responsive) */}
      <Dialog
        open={Boolean(inspectChauffeur)}
        onClose={() => {
          setInspectChauffeur(null);
          setCallAlert(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1.5, sm: 3 },
            p: { xs: 0.5, sm: 1 },
            borderRadius: { xs: 3, sm: 4 },
            maxHeight: { xs: '94vh', sm: '90vh' }
          }
        }}
      >
        {inspectChauffeur && (
          <>
            <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 } }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar
                      src={inspectChauffeur.driver.avatar}
                      alt={inspectChauffeur.driver.nameTh}
                      sx={{
                        width: { xs: 48, sm: 56 },
                        height: { xs: 48, sm: 56 },
                        border: '3px solid #10B981'
                      }}
                    />
                    {onlineDriverIds.has(inspectChauffeur.id) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: { xs: 12, sm: 14 },
                          height: { xs: 12, sm: 14 },
                          borderRadius: '50%',
                          bgcolor: '#10B981',
                          border: '2px solid #FFFFFF'
                        }}
                      />
                    )}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#0F172A',
                        lineHeight: 1.2,
                        fontSize: { xs: '1rem', sm: '1.2rem' }
                      }}
                    >
                      {inspectChauffeur.driver.nameTh}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: { xs: '0.72rem', sm: '0.78rem' } }}>
                      {inspectChauffeur.driver.nameEn} • อายุ {inspectChauffeur.driver.age} ปี
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  label={onlineDriverIds.has(inspectChauffeur.id) ? '🟢 ออนไลน์พร้อมรับงาน' : '⚪ สแตนด์บาย'}
                  sx={{
                    fontWeight: 800,
                    bgcolor: onlineDriverIds.has(inspectChauffeur.id) ? '#ECFDF5' : '#F1F5F9',
                    color: onlineDriverIds.has(inspectChauffeur.id) ? '#059669' : '#64748B',
                    border: '1px solid',
                    borderColor: onlineDriverIds.has(inspectChauffeur.id) ? '#A7F3D0' : '#CBD5E1',
                    fontSize: '0.72rem',
                    alignSelf: { xs: 'flex-start', sm: 'center' }
                  }}
                />
              </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ py: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 3 } }}>
              {callAlert && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {callAlert}
                </Alert>
              )}

              {/* Safety & Credential Alert */}
              <Alert
                severity="info"
                sx={{
                  mb: 2,
                  borderRadius: 2.5,
                  bgcolor: '#F0FDF4',
                  color: '#166534',
                  border: '1px solid #BBF7D0',
                  fontSize: { xs: '0.78rem', sm: '0.84rem' },
                  '& .MuiAlert-icon': { color: '#16A34A' }
                }}
              >
                <strong>🛡️ การรับรองมาตรฐานความปลอดภัย (Verified Chauffeur):</strong>
                <br />
                {inspectChauffeur.driver.safetyScore}
              </Alert>

              {/* Assigned Vehicle Preview */}
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  mb: 2,
                  borderRadius: 3,
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  textAlign: 'center'
                }}
              >
                <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>
                  🚘 ยานพาหนะประจำตำแหน่งของกัปตัน
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    color: '#0F172A',
                    mt: 0.5,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  {inspectChauffeur.nameTh} ({inspectChauffeur.model})
                </Typography>

                {/* SVG Vehicle Graphic */}
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: 75, sm: 95 },
                    my: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CarSvgRenderer
                    type={inspectChauffeur.svgType}
                    isUnlocked={true}
                    width="100%"
                    height="100%"
                  />
                </Box>

                <Chip
                  label={`ป้ายทะเบียน: ${inspectChauffeur.plateNo}`}
                  sx={{
                    bgcolor: '#FFFFFF',
                    border: '1.5px solid #1E293B',
                    fontWeight: 800,
                    color: '#1E293B',
                    fontSize: { xs: '0.72rem', sm: '0.8rem' }
                  }}
                />
              </Box>

              {/* Driver Specs & Statistics Grid (Responsive 1-col on xs, 2-col on sm) */}
              <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: '#FFFFFF', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#1E293B' }}>
                  📋 ประวัติและสถิติการทำงาน
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 1.5,
                    fontSize: '0.82rem'
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      คะแนนรีวิวจากผู้โดยสาร
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: '#D97706' }}>
                      ⭐ {inspectChauffeur.driver.rating} / 5.0 ({inspectChauffeur.driver.totalTrips} ทริป)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      ประสบการณ์การขับขี่
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {inspectChauffeur.driver.experienceYears} ปี
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      เลขที่ใบอนุญาตขับขี่
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {inspectChauffeur.driver.licenseNo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      ภาษาที่สื่อสารได้
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {inspectChauffeur.driver.languages.join(', ')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      ความเชี่ยวชาญพิเศษ
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#059669' }}>
                      {inspectChauffeur.driver.specialty}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      จุดสแตนด์บายปัจจุบัน
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
                      📍 {inspectChauffeur.currentStation}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                p: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 3 },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                gap: 1.5
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setCallAlert(`กำลังต่อสายโทรศัพท์ไปยัง ${inspectChauffeur.driver.phone}...`)}
                  sx={{ borderRadius: 2, fontWeight: 700, width: { xs: '100%', sm: 'auto' } }}
                >
                  📞 โทร: {inspectChauffeur.driver.phone}
                </Button>
                <Button
                  variant="outlined"
                  color={onlineDriverIds.has(inspectChauffeur.id) ? 'error' : 'success'}
                  onClick={() => handleToggleDriverStatus(inspectChauffeur.id)}
                  sx={{ borderRadius: 2, fontWeight: 700, width: { xs: '100%', sm: 'auto' } }}
                >
                  {onlineDriverIds.has(inspectChauffeur.id) ? 'สลับเป็น ออฟไลน์' : 'สลับเป็น ออนไลน์'}
                </Button>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
              >
                <Button onClick={() => setInspectChauffeur(null)} sx={{ color: '#64748B' }}>
                  ปิด
                </Button>
                <Button
                  component={Link}
                  href={`/cart`}
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2, fontWeight: 700, flex: { xs: 1, sm: 'initial' } }}
                >
                  🚗 เรียกใช้บริการคนขับ
                </Button>
              </Stack>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Card>
  );
}
