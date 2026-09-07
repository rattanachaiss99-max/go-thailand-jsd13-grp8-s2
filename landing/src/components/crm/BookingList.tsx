'use client';

import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { BookingRecord } from '@/data/crm/mockData';

interface BookingListProps {
  bookings: BookingRecord[];
  filterCategory?: 'all' | 'car' | 'hotel' | 'guide';
}

const CATEGORY_LABEL: Record<string, { label: string; icon: string }> = {
  car: { label: 'เช่ารถ', icon: '🚗' },
  hotel: { label: 'ที่พัก', icon: '🏨' },
  guide: { label: 'ไกด์นำเที่ยว', icon: '🧭' }
};

const STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'default' | 'error' }> = {
  confirmed: { label: 'ยืนยันแล้ว', color: 'success' },
  completed: { label: 'เสร็จสิ้น', color: 'default' },
  cancelled: { label: 'ยกเลิกแล้ว', color: 'error' }
};

function formatDate(isoString: string) {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return isoString;
  }
}

export default function BookingList({ bookings }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <Card sx={{ p: 5, textAlign: 'center', borderRadius: 3, bgcolor: 'background.paper', border: '1px dashed', borderColor: 'divider' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          ยังไม่มีรายการจองในหมวดนี้
        </Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={2.5}>
      {bookings.map((booking) => {
        const cat = CATEGORY_LABEL[booking.item.category] || { label: 'บริการ', icon: '✈️' };
        const status = STATUS_CONFIG[booking.bookingStatus] || { label: booking.bookingStatus, color: 'default' };

        return (
          <Card
            key={booking._id}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 10px rgba(8, 35, 64, 0.04)',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: '0 4px 16px rgba(8, 35, 64, 0.08)'
              }
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Chip
                  label={`${cat.icon} ${cat.label}`}
                  size="small"
                  sx={{ fontWeight: 700, bgcolor: 'primary.lighter', color: 'primary.darker' }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontFamily: 'monospace' }}>
                  REF: {booking.bookingReference}
                </Typography>
              </Stack>
              <Chip
                label={status.label}
                color={status.color}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, alignSelf: { xs: 'flex-start', sm: 'center' } }}
              />
            </Stack>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              {booking.item.title}
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} sx={{ mb: 2, color: 'text.secondary', fontSize: '0.88rem' }}>
              <Box>
                📍 จุดรับ/สถานที่: <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>{booking.item.pickupLocation}</Box>
              </Box>
              <Box>
                📅 วันที่: <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  {formatDate(booking.item.pickupDate)} — {formatDate(booking.item.returnDate)} ({booking.item.totalDays} วัน)
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                ชำระแล้ว (รวมภาษี 7%)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'var(--font-serif)' }}>
                ฿{booking.pricing.totalAmount.toLocaleString()} {booking.pricing.currency}
              </Typography>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}
