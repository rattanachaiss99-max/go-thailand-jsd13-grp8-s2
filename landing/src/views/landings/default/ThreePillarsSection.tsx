'use client';

import React from 'react';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ContainerWrapper from '@/components/ContainerWrapper';
import { useUser } from '@/contexts/UserContext';

export default function ThreePillarsSection() {
  const { user } = useUser();

  const featurePillars = [
    {
      icon: '🚗',
      tag: 'CHAUFFEUR SERVICE',
      title: 'คนขับรถส่วนตัวออนไลน์ (Dedicated Chauffeur)',
      desc: 'อุ่นใจทุกการเดินทางด้วยคนขับรถมืออาชีพที่ได้รับใบอนุญาต ตรวจสอบประวัติ ทะเบียนรถ และสถานะออนไลน์ 🟢 พร้อมติดต่อผ่านการ์ดคนขับในหน้าโปรไฟล์ของคุณได้ทันที',
      ctaText: 'ดูโปรไฟล์คนขับ',
      ctaLink: user ? '/profile' : '/login'
    },
    {
      icon: '🗺️',
      tag: 'GAMIFICATION & PASSPORT',
      title: 'พาสปอร์ตสะสมแสตมป์ 77 จังหวัด',
      desc: 'เปลี่ยนทุกการจองที่พักและทริปเดินทางให้เป็นตราประทับเวกเตอร์ SVG เอกลักษณ์ประจำจังหวัด ปลดล็อกถ้วยรางวัลความสำเร็จและสะสมเลเวลนักเดินทางตัวจริง',
      ctaText: 'เปิดสมุดพาสปอร์ต',
      ctaLink: user ? '/profile' : '/login'
    },
    {
      icon: '🎒',
      tag: 'TRIO BUNDLE',
      title: 'จัดทริปมัดรวม 3 ขา (Trio Trip Bundle)',
      desc: 'มิติใหม่ของการจองบริการท่องเที่ยว ครบจบในบิลเดียว ทั้งที่พัก รถเช่าพร้อมคนขับ และไกด์ท้องถิ่น พร้อมรับส่วนลดพิเศษและสิทธิ์อัปเกรด Gold Member อัตโนมัติ',
      ctaText: 'สำรวจแพ็กเกจทัวร์',
      ctaLink: '/products'
    }
  ];

  return (
    <Box component="section" id="three-pillars-section" sx={{ bgcolor: '#f8fafc', py: { xs: 8, md: 10 } }}>
      <ContainerWrapper>
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Chip
            label="ECOSYSTEM HIGHLIGHTS"
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              mb: 1.5,
              bgcolor: 'rgba(2, 132, 199, 0.1)',
              color: '#0284c7'
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' } }}>
            3 เสาหลักฟีเจอร์ที่ยกระดับทุกการเดินทาง
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 640, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
            ออกแบบเพื่อตอบโจทย์นักเดินทางยุคใหม่ ให้ทุกก้าวการเดินทางเชื่อมโยงกันอย่างสมบูรณ์แบบ
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {featurePillars.map((pillar, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3.5,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                    borderColor: '#cbd5e1'
                  }
                }}
              >
                <CardContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2.5,
                      bgcolor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      mb: 2.5
                    }}
                  >
                    {pillar.icon}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      color: '#0284c7',
                      letterSpacing: '0.06em',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    {pillar.tag}
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5, lineHeight: 1.4 }}>
                    {pillar.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.65, mb: 3, flexGrow: 1 }}>
                    {pillar.desc}
                  </Typography>

                  <Button
                    component={NextLink}
                    href={pillar.ctaLink}
                    variant="outlined"
                    size="medium"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: 'none',
                      borderColor: '#cbd5e1',
                      color: '#0f172a',
                      '&:hover': {
                        borderColor: '#0284c7',
                        bgcolor: 'rgba(2, 132, 199, 0.04)'
                      }
                    }}
                  >
                    {pillar.ctaText} →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </ContainerWrapper>
    </Box>
  );
}
