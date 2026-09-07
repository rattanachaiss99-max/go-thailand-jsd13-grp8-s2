'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ContainerWrapper from '@/components/ContainerWrapper';
import NextStepsBento from '@/components/crm/NextStepsBento';
import { useBooking } from '@/contexts/BookingContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { bookingRef, selectedProperty, booking, customer, nights } = useBooking();

  const refCode = searchParams.get('ref') || bookingRef || 'GT20260907-CONFIRMED';
  const pricePerNight = selectedProperty?.pricePerNight ?? 5000;
  const subtotal = pricePerNight * nights;
  const total = subtotal + Math.round(subtotal * 0.07);

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <ContainerWrapper>
        <Card
          sx={{
            maxWidth: 720,
            mx: 'auto',
            p: { xs: 4, sm: 6 },
            borderRadius: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 30px rgba(8, 35, 64, 0.08)',
            mb: 7
          }}
        >
          {/* Animated checkmark circle */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#fdf4e1',
              color: '#c99a33',
              fontSize: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 4px 14px rgba(239, 194, 101, 0.35)'
            }}
          >
            ✓
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, fontFamily: 'var(--font-serif)' }}>
            Booking Confirmed!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            การจองทริปท่องเที่ยวของคุณได้รับการยืนยันเรียบร้อยแล้ว
          </Typography>

          {/* Reference Badge */}
          <Box
            sx={{
              display: 'inline-block',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
              border: '1px solid',
              borderColor: 'primary.light',
              mb: 4
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
              Booking Reference / รหัสอ้างอิงการจอง
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
              {refCode}
            </Typography>
          </Box>

          {/* Booking Summary Box */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'left',
              mb: 4
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
              🏨 {selectedProperty?.name || 'ที่พักแนะนำ Go Thailand'}
            </Typography>
            <Stack spacing={1} sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
              <Box>📍 <strong>สถานที่:</strong> {selectedProperty?.location || 'ประเทศไทย'}</Box>
              <Box>📅 <strong>ช่วงเวลา:</strong> {booking.checkIn} — {booking.checkOut} ({nights} คืน)</Box>
              <Box>👤 <strong>ผู้จอง:</strong> {customer?.fullName || 'สมชาย ใจดี'} ({customer?.email || 'somchai@example.com'})</Box>
              <Box>💰 <strong>ยอดชำระสุทธิ:</strong> <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>฿{total.toLocaleString()} THB</Box></Box>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                px: 4,
                bgcolor: '#082340',
                '&:hover': { bgcolor: '#0c3157' }
              }}
            >
              ดูแดชบอร์ดและรายการจองของฉัน →
            </Button>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 3 }}
            >
              กลับสู่หน้าแรก
            </Button>
          </Stack>
        </Card>

        {/* Guidance / Next Steps Bento */}
        <Box sx={{ maxWidth: 960, mx: 'auto' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center', mb: 4, color: 'text.primary' }}>
            ขั้นตอนต่อไปสำหรับคุณ (Next Steps)
          </Typography>
          <NextStepsBento />
        </Box>
      </ContainerWrapper>
    </Box>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<Box sx={{ p: 10, textAlign: 'center' }}>กำลังโหลดข้อมูล...</Box>}>
      <SuccessContent />
    </Suspense>
  );
}
