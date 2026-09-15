'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Link from 'next/link';

import ChauffeurHorizontalCard from './ChauffeurHorizontalCard';
import TravelStampShowcase from './TravelStampShowcase';
import { CHAUFFEUR_FLEET, ChauffeurFleetItem } from '@/data/carStamps';
import CarSvgRenderer from '@/components/cars/svg/CarSvgRenderer';

interface MyJourneyAndChauffeurTabProps {
  visitedProvinces?: string[];
  initialHasBookedDriver?: boolean;
}

export default function MyJourneyAndChauffeurTab({
  visitedProvinces = ['chiang-mai', 'phuket', 'bangkok', 'krabi'],
  initialHasBookedDriver = false
}: MyJourneyAndChauffeurTabProps) {
  // Booking state: default to false (not booked) so the user immediately sees the "No active driver" box as requested!
  const [isDriverBooked, setIsDriverBooked] = useState<boolean>(initialHasBookedDriver);
  const [showAvailableDrivers, setShowAvailableDrivers] = useState<boolean>(false);
  const [inspectDriver, setInspectDriver] = useState<ChauffeurFleetItem | null>(null);
  const [callAlert, setCallAlert] = useState<string | null>(null);

  // Active drivers to show when booked or previewing
  const displayedChauffeurs = CHAUFFEUR_FLEET.slice(0, 2);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      {/* ==================================================================== */}
      {/* 1. SECTION: พนักงานขับรถประจำตัว (Chauffeur Section)                 */}
      {/* ==================================================================== */}
      <Box>
        {/* Section Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: '#0F172A',
                fontSize: { xs: '1.2rem', sm: '1.45rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.3
              }}
            >
              <span>🤵 พนักงานขับรถประจำทริปของคุณ (Dedicated Chauffeur)</span>
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', fontSize: { xs: '0.8rem', sm: '0.88rem' } }}>
              บริการพนักงานขับรถส่วนตัวระดับพรีเมียม สแตนด์บายดูแลคุณตลอดการเดินทางในประเทศไทย
            </Typography>
          </Box>

          {/* Demo Toggle: ให้ทดสอบสลับระหว่าง 'ยังไม่จอง' กับ 'จองแล้ว' ได้อย่างสะดวก */}
          <Chip
            clickable
            onClick={() => setIsDriverBooked(!isDriverBooked)}
            label={isDriverBooked ? '🧪 จำลอง: จองแล้ว (คลิกสลับ)' : '🧪 จำลอง: ยังไม่จอง (คลิกสลับ)'}
            variant="outlined"
            size="small"
            color={isDriverBooked ? 'success' : 'default'}
            sx={{
              fontWeight: 700,
              fontSize: '0.72rem',
              borderStyle: 'dashed'
            }}
          />
        </Stack>

        {/* ------------------------------------------------------------------ */}
        {/* กรณีที่ 1: ผู้ใช้ "ยังไม่ได้จองคนขับ" (NO ACTIVE DRIVER BOOKED)     */}
        {/* ------------------------------------------------------------------ */}
        {!isDriverBooked && (
          <Card
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4 },
              borderRadius: { xs: 3, md: 4 },
              border: '1.5px dashed #CBD5E1',
              bgcolor: '#F8FAFC',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Chauffeur Icon */}
            <Box
              sx={{
                width: { xs: 56, sm: 68 },
                height: { xs: 56, sm: 68 },
                borderRadius: '50%',
                bgcolor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: { xs: '1.75rem', sm: '2.2rem' },
                mb: 2,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
              }}
            >
              🤵
            </Box>

            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: '#0F172A',
                mb: 1,
                fontSize: { xs: '1.05rem', sm: '1.25rem' }
              }}
            >
              คุณยังไม่มีพนักงานขับรถประจำตัวในขณะนี้
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              sx={{
                color: '#64748B',
                maxWidth: 520,
                mb: 3,
                lineHeight: 1.6,
                fontSize: { xs: '0.82rem', sm: '0.9rem' }
              }}
            >
              ต้องการเดินทางท่องเที่ยวอย่างสะดวกสบายโดยไม่ต้องขับเองไหม?
              พนักงานขับรถมืออาชีพของเราผ่านการอบรมมาตรฐานความปลอดภัย 100% พร้อมรถยนต์ประจำตำแหน่งสแตนด์บายรอคุณ
            </Typography>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ width: { xs: '100%', sm: 'auto' }, mb: showAvailableDrivers ? 3 : 0 }}
            >
              <Button
                component={Link}
                href="/cart"
                variant="contained"
                color="primary"
                size="medium"
                sx={{
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3.5,
                  py: 1,
                  fontSize: '0.88rem',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
                  textTransform: 'none'
                }}
              >
                🚗 จองรถพร้อมคนขับทันที
              </Button>

              <Button
                variant="outlined"
                onClick={() => setShowAvailableDrivers(!showAvailableDrivers)}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3,
                  py: 1,
                  fontSize: '0.86rem',
                  borderColor: '#CBD5E1',
                  color: '#334155',
                  textTransform: 'none',
                  bgcolor: '#FFFFFF'
                }}
              >
                {showAvailableDrivers ? '▲ ซ่อนรายชื่อคนขับ' : '🔍 ดูคนขับที่ออนไลน์อยู่ในระบบ (2 นาย)'}
              </Button>
            </Stack>

            {/* Preview of Available Chauffeurs if user clicks to see */}
            {showAvailableDrivers && (
              <Box sx={{ width: '100%', mt: 2, textAlign: 'left' }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    color: '#334155',
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <span>🟢 ตัวอย่างคนขับที่กำลังออนไลน์และพร้อมรับทริปของคุณ:</span>
                </Typography>
                <Stack spacing={2}>
                  {displayedChauffeurs.map((chauffeur) => (
                    <ChauffeurHorizontalCard
                      key={chauffeur.id}
                      chauffeur={chauffeur}
                      isOnline={true}
                      onInspect={(driver) => setInspectDriver(driver)}
                      onCall={(driver) => setCallAlert(`กำลังต่อสายโทรศัพท์ไปยัง ${driver.driver.nameTh} (${driver.driver.phone})...`)}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Card>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* กรณีที่ 2: ผู้ใช้ "มีคนขับที่จองไว้แล้วและกำลังออนไลน์"             */}
        {/* ------------------------------------------------------------------ */}
        {isDriverBooked && (
          <Stack spacing={2.5}>
            {displayedChauffeurs.map((chauffeur) => (
              <ChauffeurHorizontalCard
                key={chauffeur.id}
                chauffeur={chauffeur}
                isOnline={true}
                onInspect={(driver) => setInspectDriver(driver)}
                onCall={(driver) => setCallAlert(`กำลังต่อสายโทรศัพท์ไปยัง ${driver.driver.nameTh} (${driver.driver.phone})...`)}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* ==================================================================== */}
      {/* 2. SECTION: แสตมป์การเดินทางทรงคุณค่า (Travel Stamp Showcase)       */}
      {/* ==================================================================== */}
      <Box>
        <TravelStampShowcase visitedProvinceSlugs={visitedProvinces} />
      </Box>

      {/* ==================================================================== */}
      {/* 3. MODAL: หน้าโปรไฟล์คนขับแบบเต็ม (Driver Full Profile Dialog)      */}
      {/* ==================================================================== */}
      <Dialog
        open={Boolean(inspectDriver)}
        onClose={() => {
          setInspectDriver(null);
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
        {inspectDriver && (
          <>
            <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar
                      src={inspectDriver.driver.avatar}
                      alt={inspectDriver.driver.nameTh}
                      sx={{
                        width: { xs: 50, sm: 60 },
                        height: { xs: 50, sm: 60 },
                        border: '3px solid #10B981'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        bgcolor: '#10B981',
                        border: '2px solid #FFFFFF'
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1.2, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}
                    >
                      {inspectDriver.driver.nameTh}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      {inspectDriver.driver.nameEn} • อายุ {inspectDriver.driver.age} ปี
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  label="🟢 ออนไลน์พร้อมรับงาน"
                  size="small"
                  sx={{
                    fontWeight: 800,
                    bgcolor: '#ECFDF5',
                    color: '#059669',
                    border: '1px solid #A7F3D0',
                    fontSize: '0.72rem'
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
                {inspectDriver.driver.safetyScore}
              </Alert>

              {/* Assigned Vehicle Graphic */}
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
                  🚘 ยานพาหนะประจำตำแหน่ง
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}
                >
                  {inspectDriver.nameTh} ({inspectDriver.model})
                </Typography>

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
                    type={inspectDriver.svgType}
                    isUnlocked={true}
                    width="100%"
                    height="100%"
                  />
                </Box>

                <Chip
                  label={`ป้ายทะเบียน: ${inspectDriver.plateNo}`}
                  sx={{
                    bgcolor: '#FFFFFF',
                    border: '1.5px solid #1E293B',
                    fontWeight: 800,
                    color: '#1E293B'
                  }}
                />
              </Box>

              {/* Driver Specs Grid */}
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
                      ⭐ {inspectDriver.driver.rating} / 5.0 ({inspectDriver.driver.totalTrips} ทริป)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      ประสบการณ์การขับขี่
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {inspectDriver.driver.experienceYears} ปี
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      เลขที่ใบอนุญาตขับขี่
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {inspectDriver.driver.licenseNo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      ภาษาที่สื่อสารได้
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {inspectDriver.driver.languages.join(', ')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      ความเชี่ยวชาญพิเศษ
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#059669' }}>
                      {inspectDriver.driver.specialty}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      จุดสแตนด์บายปัจจุบัน
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
                      📍 {inspectDriver.currentStation}
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
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setCallAlert(`กำลังต่อสายโทรศัพท์ไปยัง ${inspectDriver.driver.phone}...`)}
                sx={{ borderRadius: 2, fontWeight: 700, width: { xs: '100%', sm: 'auto' } }}
              >
                📞 โทร: {inspectDriver.driver.phone}
              </Button>

              <Stack
                direction="row"
                spacing={1}
                sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
              >
                <Button onClick={() => setInspectDriver(null)} sx={{ color: '#64748B' }}>
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
    </Box>
  );
}
