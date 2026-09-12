'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import ProvincePostageStamp from './ProvincePostageStamp';
import { THAILAND_PROVINCES, Province, REGION_METAS, RegionKey, getProvinceByIdOrSlug } from '@/data/thailandProvinces';
import { BookingData } from '@/services/bookingService';

interface PassportStampAlbumProps {
  visitedProvinceIds: string[];
  completedBookings?: BookingData[];
  onSimulateTrip?: (province: Province) => void;
}

export default function PassportStampAlbum({
  visitedProvinceIds = [],
  completedBookings = [],
  onSimulateTrip
}: PassportStampAlbumProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | 'all'>('north');
  const [statusFilter, setStatusFilter] = useState<'all' | 'visited' | 'unvisited'>('all');
  const [inspectProvince, setInspectProvince] = useState<Province | null>(null);

  // Helper check
  const isVisitedProvince = (province: Province) => {
    return visitedProvinceIds.some((id) => {
      const match = getProvinceByIdOrSlug(id);
      return (
        id === province.id ||
        id === province.slug ||
        id === `${province.slug}-province` ||
        match?.id === province.id ||
        match?.slug === province.slug
      );
    });
  };

  // Find booking that unlocked this province
  const getBookingForProvince = (province: Province) => {
    return completedBookings.find((b) => {
      const p = getProvinceByIdOrSlug(b.province || b.item?.province || b.item?.location || '');
      return p?.id === province.id || p?.slug === province.slug || b.province === province.slug;
    });
  };

  // Filtered list
  const filteredProvinces = useMemo(() => {
    return THAILAND_PROVINCES.filter((p) => {
      if (selectedRegion !== 'all' && p.region !== selectedRegion) {
        return false;
      }
      const visited = isVisitedProvince(p);
      if (statusFilter === 'visited' && !visited) return false;
      if (statusFilter === 'unvisited' && visited) return false;
      return true;
    });
  }, [selectedRegion, statusFilter, visitedProvinceIds]);

  const totalVisited = THAILAND_PROVINCES.filter(isVisitedProvince).length;
  const northVisited = THAILAND_PROVINCES.filter((p) => p.region === 'north' && isVisitedProvince(p)).length;
  const eastVisited = THAILAND_PROVINCES.filter((p) => p.region === 'east' && isVisitedProvince(p)).length;
  const southVisited = THAILAND_PROVINCES.filter((p) => p.region === 'south' && isVisitedProvince(p)).length;
  const westVisited = THAILAND_PROVINCES.filter((p) => p.region === 'west' && isVisitedProvince(p)).length;
  const isanVisited = THAILAND_PROVINCES.filter((p) => p.region === 'isan' && isVisitedProvince(p)).length;
  const centralVisited = THAILAND_PROVINCES.filter((p) => p.region === 'central' && isVisitedProvince(p)).length;

  return (
    <Card
      sx={{
        borderRadius: 4,
        p: { xs: 2.5, md: 3.5 },
        bgcolor: '#FFFFFF',
        border: '1px solid',
        borderColor: 'grey.200',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}
    >
      {/* Header สไตล์สมุดสะสมแสตมป์ */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            📮 สมุดสะสมแสตมป์ท่องเที่ยว 77 จังหวัด
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ปลดล็อกดวงแสตมป์และตราประทับอัตโนมัติจากการจองทริปและที่พักที่เสร็จสิ้นสมบูรณ์ (Completed Bookings Only)
          </Typography>
        </Box>

        {/* Badge สรุปสถิติแสตมป์ */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: '#F8FAFC',
            p: 1.5,
            borderRadius: 3,
            border: '1px solid #E2E8F0'
          }}
        >
          <Box sx={{ minWidth: 100 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>
              แสตมป์ที่ประทับแล้ว
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', lineHeight: 1.2 }}>
              {totalVisited} / 77 <Typography component="span" variant="caption" color="text.secondary">ดวง</Typography>
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(totalVisited / 77) * 100}
            sx={{
              width: 70,
              height: 8,
              borderRadius: 4,
              bgcolor: '#E2E8F0',
              '& .MuiLinearProgress-bar': { bgcolor: '#10B981', borderRadius: 4 }
            }}
          />
        </Box>
      </Box>

      {/* แถบตัวกรอง (Filters) */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {/* ตัวกรองรายภาค */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 0.5,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          <Chip
            label={`ภาคเหนือ เวกเตอร์เดี่ยว (${northVisited}/9)`}
            clickable
            color={selectedRegion === 'north' ? 'primary' : 'default'}
            variant={selectedRegion === 'north' ? 'filled' : 'outlined'}
            onClick={() => setSelectedRegion('north')}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          />
          <Chip
            label={`ภาคตะวันออก เวกเตอร์เดี่ยว (${eastVisited}/7)`}
            clickable
            onClick={() => setSelectedRegion('east')}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              bgcolor: selectedRegion === 'east' ? '#ea580c' : '#ffffff',
              color: selectedRegion === 'east' ? '#ffffff' : 'text.primary',
              borderColor: selectedRegion === 'east' ? '#ea580c' : 'grey.300',
              border: '1px solid',
              '&:hover': {
                bgcolor: selectedRegion === 'east' ? '#c2410c' : '#ffedd5'
              }
            }}
          />
          <Chip
            label={`ภาคใต้ เวกเตอร์เดี่ยว (${southVisited}/14)`}
            clickable
            onClick={() => setSelectedRegion('south')}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              bgcolor: selectedRegion === 'south' ? '#2563eb' : '#ffffff',
              color: selectedRegion === 'south' ? '#ffffff' : 'text.primary',
              borderColor: selectedRegion === 'south' ? '#2563eb' : 'grey.300',
              border: '1px solid',
              '&:hover': {
                bgcolor: selectedRegion === 'south' ? '#1d4ed8' : '#dbeafe'
              }
            }}
          />
          <Chip
            label={`ภาคตะวันตก เวกเตอร์เดี่ยว (${westVisited}/5)`}
            clickable
            onClick={() => setSelectedRegion('west')}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              bgcolor: selectedRegion === 'west' ? '#9333ea' : '#ffffff',
              color: selectedRegion === 'west' ? '#ffffff' : 'text.primary',
              borderColor: selectedRegion === 'west' ? '#9333ea' : 'grey.300',
              border: '1px solid',
              '&:hover': {
                bgcolor: selectedRegion === 'west' ? '#7e22ce' : '#f3e8ff'
              }
            }}
          />
          <Chip
            label={`ภาคอีสาน เวกเตอร์เดี่ยว (${isanVisited}/20)`}
            clickable
            onClick={() => setSelectedRegion('isan')}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              bgcolor: selectedRegion === 'isan' ? '#d97706' : '#ffffff',
              color: selectedRegion === 'isan' ? '#ffffff' : 'text.primary',
              borderColor: selectedRegion === 'isan' ? '#d97706' : 'grey.300',
              border: '1px solid',
              '&:hover': {
                bgcolor: selectedRegion === 'isan' ? '#b45309' : '#fef3c7'
              }
            }}
          />
          <Chip
            label={`ภาคกลาง เวกเตอร์เดี่ยว (${centralVisited}/22)`}
            clickable
            onClick={() => setSelectedRegion('central')}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              bgcolor: selectedRegion === 'central' ? '#16a34a' : '#ffffff',
              color: selectedRegion === 'central' ? '#ffffff' : 'text.primary',
              borderColor: selectedRegion === 'central' ? '#16a34a' : 'grey.300',
              border: '1px solid',
              '&:hover': {
                bgcolor: selectedRegion === 'central' ? '#15803d' : '#dcfce7'
              }
            }}
          />
          <Chip
            label={`ทั้งหมด (${totalVisited}/77)`}
            clickable
            color={selectedRegion === 'all' ? 'primary' : 'default'}
            variant={selectedRegion === 'all' ? 'filled' : 'outlined'}
            onClick={() => setSelectedRegion('all')}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          />
          {Object.entries(REGION_METAS)
            .filter(([k]) => k !== 'north' && k !== 'east' && k !== 'south' && k !== 'west' && k !== 'isan' && k !== 'central')
            .map(([key, meta]) => {
              const regCount = THAILAND_PROVINCES.filter((p) => p.region === key).length;
              const regVisited = THAILAND_PROVINCES.filter((p) => p.region === key && isVisitedProvince(p)).length;
              const isSelected = selectedRegion === key;
              return (
                <Chip
                  key={key}
                  label={`${meta.labelTh} (${regVisited}/${regCount})`}
                  clickable
                  onClick={() => setSelectedRegion(key as RegionKey)}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: isSelected ? meta.color : '#ffffff',
                    color: isSelected ? '#ffffff' : 'text.primary',
                    borderColor: isSelected ? meta.color : 'grey.300',
                    border: '1px solid'
                  }}
                />
              );
            })}
        </Box>

        {/* ตัวกรองสถานะ */}
        <Stack direction="row" spacing={1}>
          <Chip
            size="small"
            label="ทั้งหมด"
            clickable
            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
            color={statusFilter === 'all' ? 'primary' : 'default'}
            onClick={() => setStatusFilter('all')}
          />
          <Chip
            size="small"
            label={`✓ ประทับตราแล้ว (${totalVisited})`}
            clickable
            variant={statusFilter === 'visited' ? 'filled' : 'outlined'}
            color={statusFilter === 'visited' ? 'success' : 'default'}
            onClick={() => setStatusFilter('visited')}
          />
          <Chip
            size="small"
            label={`🔒 รอปลดล็อกจากการจอง (${77 - totalVisited})`}
            clickable
            variant={statusFilter === 'unvisited' ? 'filled' : 'outlined'}
            color={statusFilter === 'unvisited' ? 'default' : 'default'}
            onClick={() => setStatusFilter('unvisited')}
          />
        </Stack>
      </Stack>

      {/* Grid แสดงดวงแสตมป์แบบ Album */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(auto-fill, minmax(140px, 1fr))',
            sm: 'repeat(auto-fill, minmax(170px, 1fr))'
          },
          gap: { xs: 2, sm: 3 },
          justifyItems: 'center',
          bgcolor: '#FAF8F5',
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: '1px dashed #D6D3D1',
          minHeight: 320
        }}
      >
        {filteredProvinces.map((prov) => {
          const visited = isVisitedProvince(prov);
          return (
            <ProvincePostageStamp
              key={prov.id}
              province={prov}
              isVisited={visited}
              size="medium"
              onClick={() => setInspectProvince(prov)}
            />
          );
        })}

        {filteredProvinces.length === 0 && (
          <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6 }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              📭
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ไม่พบแสตมป์ในหมวดหมู่นี้
            </Typography>
          </Box>
        )}
      </Box>

      {/* Modal ดูแสตมป์ขนาดใหญ่ + ดูประวัติการจองที่ปลดล็อก */}
      {inspectProvince && (
        <Dialog
          open={Boolean(inspectProvince)}
          onClose={() => setInspectProvince(null)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 1,
              bgcolor: '#FEFDF9'
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 800 }}>
            ดวงแสตมป์ประจำจังหวัด
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
            <ProvincePostageStamp
              province={inspectProvince}
              isVisited={isVisitedProvince(inspectProvince)}
              size="large"
            />

            <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                📍 {inspectProvince.nameTh} ({inspectProvince.nameEn})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {REGION_METAS[inspectProvince.region]?.labelTh} • {inspectProvince.id}
              </Typography>

              {/* ข้อมูลการจองที่ปลดล็อกแสตมป์นี้ */}
              {isVisitedProvince(inspectProvince) ? (
                <Alert severity="success" sx={{ mt: 2, textAlign: 'left', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>
                    ✓ ปลดล็อกจากการจองสำเร็จ
                  </Typography>
                  {(() => {
                    const b = getBookingForProvince(inspectProvince);
                    if (b) {
                      return (
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
                          รหัสการจอง: <strong>{b.bookingReference}</strong>
                          <br />
                          ทริป: {b.item.title}
                        </Typography>
                      );
                    }
                    return (
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
                        บันทึกการเดินทางผ่านระบบ Booking เรียบร้อยแล้ว
                      </Typography>
                    );
                  })()}
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mt: 2, textAlign: 'left', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                    🔒 ตราประทับจะปลดล็อกเมื่อการจองทริปเสร็จสิ้น
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
                    เลือกจองแพ็กเกจทัวร์หรือที่พักในจังหวัด{inspectProvince.nameTh} เพื่อสะสมแสตมป์ดวงนี้
                  </Typography>
                </Alert>
              )}

              {inspectProvince.popularDestinations && inspectProvince.popularDestinations.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    สถานที่ท่องเที่ยวแนะนำ:
                  </Typography>
                  <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ rowGap: 0.5 }}>
                    {inspectProvince.popularDestinations.map((dest) => (
                      <Chip key={dest} label={dest} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Button onClick={() => setInspectProvince(null)} color="inherit" size="small">
              ปิด
            </Button>

            <Stack direction="row" spacing={1}>
              {!isVisitedProvince(inspectProvince) && onSimulateTrip && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    onSimulateTrip(inspectProvince);
                    setInspectProvince(null);
                  }}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  🧪 จำลองจองสำเร็จ
                </Button>
              )}
              <Button
                component={Link}
                href="/products"
                variant="contained"
                color="primary"
                size="small"
                sx={{ fontWeight: 700, borderRadius: 2 }}
              >
                ค้นหาทัวร์ & ที่พัก
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
}
