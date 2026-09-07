'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import StatCard from './StatCard';
import { DashboardStatsData } from '@/services/dashboardService';

interface DashboardStatsProps {
  stats: DashboardStatsData | null;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCardClick?: (key: string) => void;
}

const CARDS_CONFIG = [
  { key: 'upcomingTrips', icon: '✈️', label: 'Upcoming Trips / ทริปเร็วๆ นี้', variant: 'highlight' as const },
  { key: 'totalBookings', icon: '📅', label: 'Total Bookings / ยอดจองทั้งหมด' },
  { key: 'rewardsPoints', icon: '🏆', label: 'Rewards Points / คะแนนสะสม', suffix: 'PTS' },
  { key: 'savedPlaces', icon: '🔖', label: 'Saved Places / รายการที่บันทึก' }
];

export default function DashboardStats({
  stats,
  loading,
  error,
  onRetry,
  onCardClick
}: DashboardStatsProps) {
  if (loading) {
    return (
      <Grid container spacing={3} sx={{ width: '100%' }}>
        {CARDS_CONFIG.map((c) => (
          <Grid key={c.key} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ p: 3, borderRadius: 3, minHeight: 148, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={36} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              ลองใหม่อีกครั้ง
            </Button>
          )
        }
        sx={{ borderRadius: 3, mb: 3 }}
      >
        ไม่สามารถโหลดสถิติแดชบอร์ดได้: {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3} sx={{ width: '100%' }}>
      {CARDS_CONFIG.map((c) => {
        const val = stats ? (stats as any)[c.key] : 0;
        return (
          <Grid key={c.key} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              icon={c.icon}
              label={c.label}
              value={val ?? 0}
              suffix={c.suffix}
              variant={c.variant}
              onClick={onCardClick ? () => onCardClick(c.key) : undefined}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
