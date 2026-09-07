'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const steps = [
  {
    icon: '✉️',
    stepNumber: '01',
    title: 'Check Your Email / ตรวจสอบอีเมล',
    description: 'รับใบเสร็จและเอกสารยืนยันการจอง รายละเอียดทริปจัดส่งไปยังอีเมลของคุณทันที'
  },
  {
    icon: '📄',
    stepNumber: '02',
    title: 'Prepare Documents / เตรียมเอกสาร',
    description: 'เตรียมบัตรประชาชน/พาสปอร์ต หรือใบขับขี่ (สำหรับการเช่ารถ) ให้พร้อมในวันเดินทาง'
  },
  {
    icon: '🚗',
    stepNumber: '03',
    title: 'Pick Up & Enjoy / ออกเดินทาง',
    description: 'เดินทางไปยังจุดนัดพบหรือจุดรับรถตามเวลานัดหมาย แล้วเพลิดเพลินกับทริปท่องเที่ยวไทย'
  }
];

export default function NextStepsBento() {
  return (
    <Grid container spacing={3}>
      {steps.map((step) => (
        <Grid key={step.stepNumber} size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              p: 3.5,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 12px rgba(8, 35, 64, 0.04)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: '0 6px 20px rgba(8, 35, 64, 0.08)'
              }
            }}
          >
            <Box sx={{ fontSize: '2.2rem', mb: 1.5 }}>
              {step.icon}
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              <Box component="span" sx={{ color: '#c99a33', mr: 1 }}>{step.stepNumber}</Box>
              {step.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {step.description}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
