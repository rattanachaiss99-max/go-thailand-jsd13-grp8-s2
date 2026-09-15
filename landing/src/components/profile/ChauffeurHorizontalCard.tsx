'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';

import { ChauffeurFleetItem } from '@/data/carStamps';
import CarSvgRenderer from '@/components/cars/svg/CarSvgRenderer';

export interface ChauffeurHorizontalCardProps {
  chauffeur: ChauffeurFleetItem;
  isOnline?: boolean;
  onInspect?: (item: ChauffeurFleetItem) => void;
  onCall?: (item: ChauffeurFleetItem) => void;
  className?: string;
}

export default function ChauffeurHorizontalCard({
  chauffeur,
  isOnline = true,
  onInspect,
  onCall,
  className
}: ChauffeurHorizontalCardProps) {
  const driver = chauffeur.driver;

  return (
    <Card
      elevation={0}
      className={className}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: { xs: 3, md: 4 },
        border: isOnline ? '2px solid #10B981' : '1.5px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        boxShadow: isOnline
          ? '0 10px 25px -5px rgba(16, 185, 129, 0.12), 0 4px 10px rgba(0,0,0,0.04)'
          : '0 4px 12px rgba(0,0,0,0.03)',
        transition: 'all 0.25s ease',
        '&:hover': {
          boxShadow: isOnline
            ? '0 16px 32px -5px rgba(16, 185, 129, 0.2), 0 8px 16px rgba(0,0,0,0.06)'
            : '0 8px 20px rgba(0,0,0,0.08)',
          borderColor: isOnline ? '#059669' : '#CBD5E1'
        }
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '210px 1fr 200px' },
          gap: { xs: 2, sm: 2.5, md: 3 },
          alignItems: 'center'
        }}
      >
        {/* ================= 1. ซ้าย: ภาพคนขับและรถยนต์ SVG ================= */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, md: 1.5 },
            p: { xs: 1.5, md: 2 },
            bgcolor: '#F8FAFC',
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Avatar + Live Online Badge */}
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              src={driver.avatar}
              alt={driver.nameTh}
              sx={{
                width: { xs: 54, sm: 64, md: 72 },
                height: { xs: 54, sm: 64, md: 72 },
                border: '3px solid #10B981',
                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)'
              }}
            />
            {isOnline && (
              <Tooltip title="พนักงานขับรถกำลังออนไลน์และพร้อมให้บริการทันที" arrow>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    bgcolor: '#10B981',
                    border: '2.5px solid #FFFFFF',
                    boxShadow: '0 0 8px #10B981',
                    animation: 'pulse 2s infinite'
                  }}
                />
              </Tooltip>
            )}
          </Box>

          {/* Vehicle Mini SVG Card */}
          <Box sx={{ width: '100%', textAlign: 'center', flex: { xs: 1, md: 'none' } }}>
            <Box
              sx={{
                width: '100%',
                height: { xs: 45, sm: 55 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                my: 0.5
              }}
            >
              <CarSvgRenderer
                type={chauffeur.svgType}
                isUnlocked={isOnline}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              sx={{
                display: 'inline-block',
                px: 1,
                py: 0.2,
                bgcolor: '#FFFFFF',
                border: '1.2px solid #1E293B',
                borderRadius: '4px',
                fontSize: { xs: '0.65rem', sm: '0.72rem' },
                fontWeight: 800,
                color: '#1E293B',
                letterSpacing: 0.4
              }}
            >
              {chauffeur.plateNo}
            </Box>
          </Box>
        </Box>

        {/* ================= 2. กลาง: ข้อมูลคนขับ & คุณสมบัติเด่น ================= */}
        <Box sx={{ minWidth: 0 }}>
          {/* Header Row: Online Status & Driver Name */}
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
            <Chip
              label={isOnline ? '🟢 ออนไลน์พร้อมออกเดินทาง' : '⚪ สแตนด์บาย'}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.68rem',
                fontWeight: 800,
                bgcolor: isOnline ? '#ECFDF5' : '#F1F5F9',
                color: isOnline ? '#059669' : '#64748B',
                border: `1px solid ${isOnline ? '#A7F3D0' : '#CBD5E1'}`
              }}
            />
            <Chip
              label={chauffeur.categoryLabelTh}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.65rem',
                fontWeight: 700,
                bgcolor: `${chauffeur.badgeColor}18`,
                color: chauffeur.badgeColor
              }}
            />
          </Stack>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#0F172A',
              fontSize: { xs: '1.05rem', sm: '1.2rem' },
              lineHeight: 1.3,
              mb: 0.2
            }}
          >
            {driver.nameTh}
          </Typography>

          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, mb: 1.2 }}>
            {chauffeur.nameTh} ({chauffeur.model})
          </Typography>

          {/* Rating, Experience & Trips */}
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 1.2 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                gap: 0.4,
                fontSize: '0.8rem'
              }}
            >
              ⭐ {driver.rating} ({driver.totalTrips} ทริปสำเร็จ)
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>•</Typography>
            <Typography variant="caption" sx={{ color: '#334155', fontWeight: 700, fontSize: '0.78rem' }}>
              ประสบการณ์ {driver.experienceYears} ปี
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>•</Typography>
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, fontSize: '0.78rem' }}>
              ใบขับขี่ {driver.licenseNo}
            </Typography>
          </Stack>

          {/* Location & Specialty */}
          <Typography
            variant="body2"
            sx={{
              color: '#64748B',
              fontSize: { xs: '0.78rem', sm: '0.84rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 0.8
            }}
          >
            <strong>📍 ประจำการ:</strong> {chauffeur.currentStation.replace('สแตนด์บาย: ', '')}
          </Typography>

          {/* Languages */}
          <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.72rem' }}>
              ภาษา:
            </Typography>
            {driver.languages.map((lang, idx) => (
              <Chip
                key={idx}
                label={lang}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  borderColor: '#E2E8F0',
                  color: '#475569',
                  bgcolor: '#F8FAFC'
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* ================= 3. ขวา: อัตราค่าบริการและปุ่มดำเนินการ ================= */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: { xs: 'stretch', md: 'flex-end' },
            textAlign: { xs: 'left', md: 'right' },
            borderLeft: { xs: 'none', md: '1px dashed #E2E8F0' },
            pl: { xs: 0, md: 3 },
            pt: { xs: 1.5, md: 0 },
            borderTop: { xs: '1px dashed #E2E8F0', md: 'none' }
          }}
        >
          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              อัตราค่าบริการคนขับ
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: '#059669',
                fontSize: { xs: '1.2rem', md: '1.35rem' },
                lineHeight: 1.2
              }}
            >
              ฿{chauffeur.dailyRate.toLocaleString()}
              <Typography component="span" variant="caption" sx={{ color: '#64748B', ml: 0.5 }}>
                / วัน
              </Typography>
            </Typography>
          </Box>

          <Stack spacing={1} sx={{ width: '100%' }}>
            <Button
              component={Link}
              href="/cart"
              variant="contained"
              color="primary"
              size="small"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                py: 0.9,
                fontSize: '0.84rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
              }}
            >
              🚗 เรียกใช้บริการทันที
            </Button>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() => onCall?.(chauffeur)}
                sx={{
                  flex: 1,
                  fontWeight: 700,
                  borderRadius: 2,
                  fontSize: '0.76rem',
                  py: 0.6
                }}
              >
                📞 โทร
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => onInspect?.(chauffeur)}
                sx={{
                  flex: 1,
                  fontWeight: 700,
                  borderRadius: 2,
                  fontSize: '0.76rem',
                  borderColor: '#CBD5E1',
                  color: '#334155',
                  py: 0.6
                }}
              >
                👤 โปรไฟล์
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
}
