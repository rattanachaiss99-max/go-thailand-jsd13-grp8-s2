'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import ContainerWrapper from '@/components/ContainerWrapper';
import DashboardStats from '@/components/crm/DashboardStats';
import BookingList from '@/components/crm/BookingList';
import NextStepsBento from '@/components/crm/NextStepsBento';
import { useUser } from '@/contexts/UserContext';
import {
  fetchDashboardStats,
  fetchUserBookings,
  DashboardStatsData,
  isUpcoming
} from '@/services/dashboardService';
import { BookingRecord, mockUser } from '@/data/crm/mockData';

const TIER_BADGE: Record<string, { label: string; bgcolor: string; color: string }> = {
  bronze: { label: 'Bronze Member', bgcolor: '#f4ede4', color: '#8d6e4e' },
  silver: { label: 'Silver Member', bgcolor: '#e7edf5', color: '#4a6582' },
  gold: { label: 'Gold Member (ระดับทอง)', bgcolor: '#fdf4e1', color: '#c99a33' },
  platinum: { label: 'Platinum Member', bgcolor: '#ede9fe', color: '#6d28d9' }
};

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetchDashboardStats(user as any), fetchUserBookings()])
      .then(([statsData, bookingsData]) => {
        setStats(statsData);
        setBookings(bookingsData);
      })
      .catch((err) => {
        setError(err.message || 'FAILED_TO_LOAD');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const greetingName = user ? `${user.firstName} ${user.lastName}` : `${mockUser.firstName} ${mockUser.lastName}`;
  const tier = user?.role === 'customer' ? 'gold' : 'gold'; // default gold for demonstration
  const tierConfig = TIER_BADGE[tier] || TIER_BADGE.gold;

  const upcomingBookings = bookings.filter((b) => isUpcoming(b));

  return (
    <Box sx={{ pb: 12, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Top Banner */}
      <Box
        sx={{
          bgcolor: '#082340',
          color: '#fff',
          py: { xs: 5, md: 7 },
          mb: { xs: 4, md: 5 }
        }}
      >
        <ContainerWrapper>
          {!user && (
            <Alert
              severity="info"
              action={
                <Button color="inherit" size="small" component={Link} href="/register">
                  เข้าสู่ระบบ
                </Button>
              }
              sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#fff' }}
            >
              คุณกำลังดูแดชบอร์ดในโหมดตัวอย่าง (Demo) — เข้าสู่ระบบเพื่อดูประวัติจริงของคุณ
            </Alert>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600
                }}
              >
                Customer Portal & CRM
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, color: '#fff' }}>
                สวัสดี, {greetingName}
              </Typography>
            </Box>

            <Chip
              label={`👑 ${tierConfig.label}`}
              sx={{
                bgcolor: tierConfig.bgcolor,
                color: tierConfig.color,
                fontWeight: 700,
                fontSize: '0.88rem',
                py: 2.2,
                px: 1,
                alignSelf: { xs: 'flex-start', sm: 'center' }
              }}
            />
          </Stack>
        </ContainerWrapper>
      </Box>

      <ContainerWrapper>
        {/* 4 Stat Cards */}
        <Box sx={{ mb: 6 }}>
          <DashboardStats stats={stats} loading={loading} error={error} onRetry={loadData} />
        </Box>

        {/* Trips / Bookings Section */}
        <Box sx={{ mb: 6 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
              รายการจองและทริปของฉัน
            </Typography>
            <Button
              component={Link}
              href="/accommodations"
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              + วางแผนทริปใหม่ / จองที่พัก
            </Button>
          </Stack>

          <Tabs
            value={tabIndex}
            onChange={(_, val) => setTabIndex(val)}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={`ทริปเร็วๆ นี้ (${upcomingBookings.length})`} sx={{ fontWeight: 700 }} />
            <Tab label={`ประวัติการจองทั้งหมด (${bookings.length})`} sx={{ fontWeight: 700 }} />
          </Tabs>

          {tabIndex === 0 ? (
            <BookingList bookings={upcomingBookings} />
          ) : (
            <BookingList bookings={bookings} />
          )}
        </Box>

        {/* Guidance / Next Steps */}
        <Box sx={{ mt: 7 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 3 }}>
            คำแนะนำก่อนการเดินทาง (Next Steps)
          </Typography>
          <NextStepsBento />
        </Box>
      </ContainerWrapper>
    </Box>
  );
}
