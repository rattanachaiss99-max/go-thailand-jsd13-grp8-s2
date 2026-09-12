'use client';

// ============================================================================
// HomeView Component — Overview & Welcome Screen
// ============================================================================

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useCrm } from '@/contexts/CrmContext';

export default function HomeView() {
  const { members, setCurrentView, loading } = useCrm();

  const adminCount = members.filter((m) => m.role === 'admin').length;
  const userCount = members.filter((m) => m.role === 'user').length;

  return (
    <Box sx={{ py: 2 }}>
      {/* Hero Welcome Card */}
      <Card
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          mb: 4,
          background: 'linear-gradient(135deg, #082340 0%, #0d3b66 100%)',
          color: '#fff',
          boxShadow: '0 12px 32px rgba(8, 35, 64, 0.15)'
        }}
      >
        <Stack spacing={2} sx={{ maxWidth: 800 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label="Generation Thailand Assessment"
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }}
            />
            <Chip
              label="React CRM Lifecycle Pattern"
              size="small"
              sx={{ bgcolor: '#eab308', color: '#000', fontWeight: 700 }}
            />
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            ระบบจัดการสมาชิก Generation Thailand — React CRM
          </Typography>

          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, fontSize: '1.05rem' }}>
            ระบบนี้สร้างขึ้นตามแบบแผน <strong>React CRM Lifecycle</strong> โดยข้อมูลสมาชิกทั้งหมดถูกบริหารจัดการผ่าน{' '}
            <strong>CrmContext</strong> และเชื่อมต่อกับ Network API Boundary โดยไม่มีการแทรกแซงโค้ด UI มีการจัดการวงจรชีวิตด้วย{' '}
            <code>active cleanup flag</code> และการอัปเดตสถานะแบบ <code>Immutable</code>
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setCurrentView('user')}
              sx={{
                bgcolor: '#fff',
                color: '#082340',
                fontWeight: 700,
                borderRadius: 2.5,
                px: 3.5,
                py: 1.2,
                '&:hover': { bgcolor: '#f1f5f9' }
              }}
            >
              👥 ดูรายชื่อสมาชิก (User View)
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setCurrentView('admin')}
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 2.5,
                px: 3.5,
                py: 1.2,
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' }
              }}
            >
              ⚙️ จัดการสมาชิก / เพิ่มข้อมูล (Admin View)
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* Metric Highlights */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 1 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                สมาชิกทั้งหมดในระบบ
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mt: 1 }}>
                {loading ? '...' : members.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                รายการจาก MongoDB / Server Storage
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 1 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                Admin Members
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0284c7', mt: 1 }}>
                {loading ? '...' : adminCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                สิทธิ์ผู้ดูแลและจัดการระบบ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 1 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                General Users
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#16a34a', mt: 1 }}>
                {loading ? '...' : userCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                ผู้ใช้งานทั่วไป / สมาชิกองค์กร
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
