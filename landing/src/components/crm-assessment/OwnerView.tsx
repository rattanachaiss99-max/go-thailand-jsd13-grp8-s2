'use client';

// ============================================================================
// OwnerView Component — Project Owner & Developer Profile
// Follows Generation Thailand Assessment specification
// ============================================================================

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

export default function OwnerView() {
  return (
    <Box sx={{ py: 1 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
          👤 Owner View — ข้อมูลผู้พัฒนา & ข้อมูลโครงการ
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          ข้อมูลผู้รับผิดชอบโครงการและสถาปัตยกรรมทางเทคนิค Generation Thailand (JSD13)
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ height: 120, background: 'linear-gradient(90deg, #082340 0%, #1e3a8a 50%, #3b82f6 100%)' }} />
        <CardContent sx={{ px: { xs: 3, md: 5 }, pb: 5, pt: 0, mt: -6 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-end' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                border: '4px solid #fff',
                bgcolor: '#082340',
                fontSize: '2rem',
                fontWeight: 700,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }}
            >
              GT
            </Avatar>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Go Thailand Team — Group 8
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Junior Software Developer Bootcamp (JSD#13)
              </Typography>
            </Box>
            <Chip
              label="Sprint 2 Assessment"
              color="primary"
              sx={{ fontWeight: 700, py: 1.5, px: 0.5, borderRadius: 2 }}
            />
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                🎯 เป้าหมายและรายละเอียดโครงการ (Project Vision)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                <strong>Go Thailand</strong> เป็นแพลตฟอร์มการท่องเที่ยวและจัดการจองบริการท่องเที่ยวชั้นนำในประเทศไทย
                โดยนำสถาปัตยกรรม <strong>Distributed Microservices (MERN Stack)</strong> มาผสานกับ Next.js 16
                ระบบ CRM ส่วนนี้ถูกออกแบบตามกฎเกณฑ์ <strong>React CRM Lifecycle</strong> เพื่อบริหารจัดการสมาชิก
                และข้อมูลผู้ใช้งานร่วมกันระหว่างหลายหน้ามุมมองโดยปราศจากปัญหา Re-render loops และ Memory leak
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                🛠️ ทักษะและเทคโนโลยีที่ใช้ (Tech Stack)
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {['React 19', 'Next.js 16', 'TypeScript', 'Material UI (MUI)', 'React Context API', 'MongoDB Atlas', 'Express.js', 'Render Cloud', 'JWT Authentication', 'Clean Architecture'].map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    variant="outlined"
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
