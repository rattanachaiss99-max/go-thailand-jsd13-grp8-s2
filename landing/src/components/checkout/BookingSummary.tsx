'use client';

import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useBooking } from '@/contexts/BookingContext';

interface BookingSummaryProps {
  onConfirm: () => void;
  submitting?: boolean;
  onBack?: () => void;
}

export default function BookingSummary({
  onConfirm,
  submitting = false,
  onBack
}: BookingSummaryProps) {
  const { booking, selectedProperty, nights } = useBooking();

  const pricePerNight = selectedProperty?.pricePerNight ?? 5000;
  const subtotal = pricePerNight * nights;
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax;

  const thumbnail = selectedProperty?.images?.[0] || '/images/amanpuri-retreat-villas/1.jpg';
  const propertyName = selectedProperty?.name || 'โรงแรม/ที่พักแนะนำ';
  const propertyLocation = selectedProperty?.location || 'ประเทศไทย';

  return (
    <Card
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 20px rgba(8, 35, 64, 0.06)',
        position: 'sticky',
        top: 96
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5, fontFamily: 'var(--font-serif)', color: 'text.primary' }}>
        Booking Summary / สรุปรายการจอง
      </Typography>

      {/* Item info */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
        <Box
          component="img"
          src={thumbnail}
          alt={propertyName}
          sx={{
            width: 80,
            height: 64,
            borderRadius: 2,
            objectFit: 'cover',
            border: '1px solid',
            borderColor: 'divider'
          }}
        />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: 'text.primary' }}>
            {propertyName}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            📍 {propertyLocation}
          </Typography>
          <Typography variant="caption" sx={{ color: '#c99a33', fontWeight: 700 }}>
            ★ {selectedProperty?.rating || '4.8'} ({selectedProperty?.reviews || 45} รีวิว)
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Booking Details */}
      <Stack spacing={1.5} sx={{ fontSize: '0.88rem', mb: 2.5 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>
            เช็คอิน - เช็คเอาท์
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {booking.checkIn} — {booking.checkOut}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>
            ระยะเวลา & ผู้เข้าพัก
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {nights} คืน, ผู้ใหญ่ {booking.guests.adults} ท่าน
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Pricing Calculation */}
      <Stack spacing={1.2} sx={{ mb: 2.5 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ค่าที่พัก (฿{pricePerNight.toLocaleString()} × {nights} คืน)
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            ฿{subtotal.toLocaleString()}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ภาษีและค่าธรรมเนียม (VAT 7%)
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            ฿{tax.toLocaleString()}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ค่าบริการระบบ (Service Fee)
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
            ฟรี (฿0)
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Total Amount */}
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
          ยอดชำระสุทธิ (Total)
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'var(--font-serif)' }}>
          ฿{total.toLocaleString()}
        </Typography>
      </Stack>

      {/* Action Buttons */}
      <Stack spacing={1.5}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
          onClick={onConfirm}
          sx={{
            py: 1.5,
            borderRadius: 2.5,
            fontWeight: 700,
            fontSize: '1rem',
            bgcolor: '#efc265',
            color: '#082340',
            boxShadow: '0 4px 14px rgba(239, 194, 101, 0.45)',
            '&:hover': {
              bgcolor: '#f5cf80'
            }
          }}
        >
          {submitting ? 'กำลังดำเนินการ...' : 'ยืนยันและชำระเงิน →'}
        </Button>

        {onBack && (
          <Button
            variant="text"
            size="small"
            onClick={onBack}
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            ย้อนกลับ
          </Button>
        )}
      </Stack>

      {/* Trust Badges */}
      <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid', borderColor: 'divider', fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.8 }}>
        <Box>🔒 ระบบชำระเงินปลอดภัยมาตรฐาน SSL</Box>
        <Box>🛡 มาตรฐานความปลอดภัย 256-bit Encryption</Box>
        <Box>✓ ยกเลิกฟรีล่วงหน้า 48 ชั่วโมงก่อนวันเข้าพัก</Box>
      </Box>
    </Card>
  );
}
