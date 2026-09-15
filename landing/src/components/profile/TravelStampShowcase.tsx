'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import ProvincePostageStamp from '@/components/profile/ProvincePostageStamp';
import CarSvgRenderer from '@/components/cars/svg/CarSvgRenderer';
import { THAILAND_PROVINCES, Province } from '@/data/thailandProvinces';
import { CHAUFFEUR_FLEET, ChauffeurFleetItem } from '@/data/carStamps';

interface TravelStampShowcaseProps {
  visitedProvinceSlugs?: string[];
  className?: string;
}

export default function TravelStampShowcase({
  visitedProvinceSlugs = ['chiang-mai', 'phuket', 'bangkok', 'chup-sukhothai', 'krabi'],
  className
}: TravelStampShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'provinces' | 'vehicles'>('provinces');
  const [inspectProvince, setInspectProvince] = useState<Province | null>(null);
  const [inspectVehicle, setInspectVehicle] = useState<ChauffeurFleetItem | null>(null);

  // Selected sample showcase provinces (visited ones first + next destinations)
  const showcaseProvinces = React.useMemo(() => {
    const visitedSet = new Set(visitedProvinceSlugs);
    const visitedList = THAILAND_PROVINCES.filter((p) => visitedSet.has(p.slug) || visitedSet.has(p.id));
    const nextList = THAILAND_PROVINCES.filter((p) => !visitedSet.has(p.slug) && !visitedSet.has(p.id)).slice(0, 3);
    return [...visitedList.slice(0, 5), ...nextList];
  }, [visitedProvinceSlugs]);

  const visitedCount = visitedProvinceSlugs.length || 3;

  return (
    <Card
      elevation={0}
      className={className}
      sx={{
        p: { xs: 2.5, sm: 3, md: 4 },
        borderRadius: { xs: 3, md: 4 },
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)'
      }}
    >
      {/* 1. Showcase Header (Clean & Tourist-Centric) */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#0F172A',
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5
            }}
          >
            <span>🔖 สมุดสะสมตรายางการเดินทาง (Travel Stamps Showcase)</span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            บันทึกความทรงจำและตราประทับแห่งสยาม — ปลดล็อกอัตโนมัติเมื่อออกทริปและท่องเที่ยวกับ Go Thailand
          </Typography>
        </Box>

        {/* Category Switcher Tabs */}
        <Stack direction="row" spacing={1}>
          <Chip
            label="🇹🇭 แสตมป์จังหวัด"
            clickable
            onClick={() => setActiveTab('provinces')}
            variant={activeTab === 'provinces' ? 'filled' : 'outlined'}
            color={activeTab === 'provinces' ? 'primary' : 'default'}
            sx={{ fontWeight: 700, fontSize: '0.78rem' }}
          />
          <Chip
            label="🚗 ตรายางยานพาหนะ"
            clickable
            onClick={() => setActiveTab('vehicles')}
            variant={activeTab === 'vehicles' ? 'filled' : 'outlined'}
            color={activeTab === 'vehicles' ? 'primary' : 'default'}
            sx={{ fontWeight: 700, fontSize: '0.78rem' }}
          />
        </Stack>
      </Stack>

      {/* 2. Milestone Summary Ribbon */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 3,
          borderRadius: 2.5,
          bgcolor: '#FFFBEB',
          border: '1px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ fontSize: '1.5rem' }}>🏆</Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400E', fontSize: { xs: '0.84rem', sm: '0.9rem' } }}>
              ระดับนักเดินทาง: นักสำรวจสยาม (Siam Explorer)
            </Typography>
            <Typography variant="caption" sx={{ color: '#B45309', fontSize: { xs: '0.72rem', sm: '0.78rem' } }}>
              คุณได้ประทับตราการเดินทางแล้ว {visitedCount} จังหวัด และสะสมประสบการณ์ขับขี่ 2 คลาสยานยนต์
            </Typography>
          </Box>
        </Stack>

        <Chip
          label="✓ ได้รับการรับรองอย่างเป็นทางการ"
          size="small"
          sx={{
            bgcolor: '#FEF3C7',
            color: '#92400E',
            fontWeight: 800,
            fontSize: '0.72rem',
            border: '1px solid #FCD34D'
          }}
        />
      </Box>

      {/* 3. Showcase Content Grid */}
      {activeTab === 'provinces' ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(130px, 1fr))',
              sm: 'repeat(auto-fill, minmax(150px, 1fr))',
              md: 'repeat(auto-fill, minmax(170px, 1fr))'
            },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            justifyItems: 'center',
            py: 1
          }}
        >
          {showcaseProvinces.map((prov) => {
            const isVisited = visitedProvinceSlugs.includes(prov.slug) || visitedProvinceSlugs.includes(prov.id);
            return (
              <ProvincePostageStamp
                key={prov.id}
                province={prov}
                isVisited={isVisited}
                size="small"
                onClick={(p) => setInspectProvince(p)}
              />
            );
          })}
        </Box>
      ) : (
        /* Vehicle Badges Grid */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fill, minmax(140px, 1fr))',
              sm: 'repeat(auto-fill, minmax(170px, 1fr))',
              md: 'repeat(auto-fill, minmax(190px, 1fr))'
            },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            justifyItems: 'center',
            py: 1
          }}
        >
          {CHAUFFEUR_FLEET.map((fleetItem, index) => {
            const isUnlocked = index < 3; // First 3 unlocked as sample driven
            return (
              <Box
                key={fleetItem.id}
                onClick={() => setInspectVehicle(fleetItem)}
                sx={{
                  width: '100%',
                  maxWidth: 200,
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: isUnlocked ? '#FFFFFF' : '#F8FAFC',
                  border: isUnlocked ? `2px solid ${fleetItem.badgeColor}` : '1.5px dashed #CBD5E1',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isUnlocked ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Chip
                  label={isUnlocked ? '★ ประทับตราแล้ว' : '🔒 ล็อก'}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    bgcolor: isUnlocked ? '#ECFDF5' : '#F1F5F9',
                    color: isUnlocked ? '#059669' : '#94A3B8',
                    mb: 1
                  }}
                />

                <Box sx={{ width: '100%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CarSvgRenderer
                    type={fleetItem.svgType}
                    isUnlocked={isUnlocked}
                    width="100%"
                    height="100%"
                  />
                </Box>

                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: isUnlocked ? '#0F172A' : '#64748B', mt: 1 }}>
                  {fleetItem.nameTh}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', display: 'block' }}>
                  {fleetItem.plateNo}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Inspection Modal for Province Stamp */}
      <Dialog
        open={Boolean(inspectProvince)}
        onClose={() => setInspectProvince(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        {inspectProvince && (
          <>
            <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
              {inspectProvince.nameTh} ({inspectProvince.nameEn})
            </DialogTitle>
            <DialogContent dividers sx={{ textAlign: 'center', py: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ProvincePostageStamp
                  province={inspectProvince}
                  isVisited={visitedProvinceSlugs.includes(inspectProvince.slug) || visitedProvinceSlugs.includes(inspectProvince.id)}
                  size="medium"
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                {inspectProvince.slogan || `ตราประทับการเดินทางประจำจังหวัด${inspectProvince.nameTh} พร้อมบันทึกการเดินทางในสมุดพาสปอร์ต`}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 1.5 }}>
              <Button onClick={() => setInspectProvince(null)} sx={{ color: '#64748B' }}>
                ปิด
              </Button>
              <Button component="a" href={`/products?province=${inspectProvince.slug}`} variant="contained" color="primary">
                ดูแพ็กเกจเที่ยวจังหวัดนี้
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Inspection Modal for Vehicle Badge */}
      <Dialog
        open={Boolean(inspectVehicle)}
        onClose={() => setInspectVehicle(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        {inspectVehicle && (
          <>
            <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
              {inspectVehicle.nameTh}
            </DialogTitle>
            <DialogContent dividers sx={{ textAlign: 'center', py: 2.5 }}>
              <Box sx={{ width: '100%', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CarSvgRenderer
                  type={inspectVehicle.svgType}
                  isUnlocked={true}
                  width="100%"
                  height="100%"
                />
              </Box>
              <Chip label={`ป้ายทะเบียน: ${inspectVehicle.plateNo}`} sx={{ mb: 1.5, fontWeight: 800 }} />
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                {inspectVehicle.description}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 1.5 }}>
              <Button onClick={() => setInspectVehicle(null)} sx={{ color: '#64748B' }}>
                ปิด
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Card>
  );
}
