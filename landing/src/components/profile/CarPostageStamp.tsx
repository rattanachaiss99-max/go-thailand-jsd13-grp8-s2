'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { ChauffeurFleetItem } from '@/data/carStamps';
import CarSvgRenderer from '@/components/cars/svg/CarSvgRenderer';

export interface ChauffeurCardProps {
  chauffeur?: ChauffeurFleetItem;
  car?: ChauffeurFleetItem; // backward-compatibility
  isUnlocked?: boolean;      // backward-compatibility
  isActive?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (item: ChauffeurFleetItem) => void;
  className?: string;
  rentedDate?: string;
}

export default function CarPostageStamp({
  chauffeur,
  car,
  isActive = true,
  isUnlocked = true,
  size = 'medium',
  onClick,
  className
}: ChauffeurCardProps) {
  const item = chauffeur || car;
  if (!item) return null;

  const isOnline = isActive ?? isUnlocked;

  // Responsive scale dimensions
  const dims = {
    small: { maxW: 200, minH: 220, svgH: { xs: 50, sm: 60 }, titleSize: { xs: '0.78rem', sm: '0.84rem' } },
    medium: { maxW: 260, minH: 270, svgH: { xs: 60, sm: 78 }, titleSize: { xs: '0.84rem', sm: '0.94rem' } },
    large: { maxW: 340, minH: 320, svgH: { xs: 75, sm: 100 }, titleSize: { xs: '0.95rem', sm: '1.1rem' } }
  }[size];

  return (
    <Box
      onClick={() => onClick?.(item)}
      className={className}
      sx={{
        width: '100%',
        maxWidth: dims.maxW,
        minHeight: dims.minH,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: { xs: 2.5, sm: 3.5 },
        bgcolor: '#FFFFFF',
        border: isOnline ? `2px solid ${item.badgeColor}` : '1.5px solid #E2E8F0',
        p: { xs: 1.25, sm: 1.75 },
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
        userSelect: 'none',
        boxShadow: isOnline
          ? '0 10px 25px -5px rgba(16, 185, 129, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
          : '0 4px 10px rgba(0, 0, 0, 0.04)',
        '&:hover': onClick
          ? {
              transform: { xs: 'none', sm: 'translateY(-5px)' },
              boxShadow: isOnline
                ? '0 18px 32px -6px rgba(16, 185, 129, 0.25), 0 10px 15px -4px rgba(0, 0, 0, 0.1)'
                : '0 10px 20px rgba(0, 0, 0, 0.08)'
            }
          : {}
      }}
    >
      {/* 1. ส่วนบน: ข้อมูลคนขับ & สถานะออนไลน์ (Responsive Driver Header) */}
      <Box sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            {/* อวตารคนขับ พร้อมจุดไฟสถานะสีเขียวกะพริบ */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={item.driver.avatar}
                alt={item.driver.nameTh}
                sx={{
                  width: { xs: 34, sm: 40 },
                  height: { xs: 34, sm: 40 },
                  border: `2px solid ${isOnline ? '#10B981' : '#CBD5E1'}`
                }}
              />
              {isOnline && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: { xs: 9, sm: 11 },
                    height: { xs: 9, sm: 11 },
                    borderRadius: '50%',
                    bgcolor: '#10B981',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 0 6px #10B981'
                  }}
                />
              )}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: dims.titleSize,
                  color: '#0F172A',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.2
                }}
              >
                {item.driver.nameTh.split('(')[0].trim()}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.62rem', sm: '0.7rem' },
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                ⭐ {item.driver.rating} • ขับ {item.driver.experienceYears} ปี
              </Typography>
            </Box>
          </Stack>

          {/* ป้ายบอกสถานะ Online / Standby */}
          <Chip
            label={isOnline ? '🟢 ออนไลน์' : '⚪ ว่าง'}
            size="small"
            sx={{
              height: { xs: 18, sm: 20 },
              fontSize: { xs: '0.58rem', sm: '0.62rem' },
              fontWeight: 800,
              bgcolor: isOnline ? '#ECFDF5' : '#F1F5F9',
              color: isOnline ? '#059669' : '#64748B',
              border: `1px solid ${isOnline ? '#A7F3D0' : '#CBD5E1'}`,
              flexShrink: 0
            }}
          />
        </Stack>
      </Box>

      {/* 2. ส่วนกลาง: ภาพเวกเตอร์รถยนต์ประจำตำแหน่ง (Responsive SVG Vehicle) */}
      <Box
        sx={{
          my: 0.5,
          p: { xs: 0.8, sm: 1 },
          bgcolor: '#F8FAFC',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: dims.svgH,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CarSvgRenderer
            type={item.svgType}
            isUnlocked={isOnline}
            width="100%"
            height="100%"
          />
        </Box>

        {/* ป้ายทะเบียนรถยนต์ */}
        <Box
          sx={{
            mt: 0.6,
            px: 0.8,
            py: 0.15,
            bgcolor: '#FFFFFF',
            border: '1.2px solid #1E293B',
            borderRadius: '4px',
            fontSize: { xs: '0.58rem', sm: '0.68rem' },
            fontWeight: 800,
            color: '#1E293B',
            letterSpacing: 0.4,
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.plateNo}
        </Box>
      </Box>

      {/* 3. ส่วนล่าง: ข้อมูลรุ่นรถ & ปุ่มดูโปรไฟล์ (Responsive Details & Actions) */}
      <Box sx={{ pt: 0.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.3 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: dims.titleSize,
              color: '#0F172A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
              mr: 0.5
            }}
          >
            {item.nameTh}
          </Typography>
          <Chip
            label={item.categoryLabelTh}
            size="small"
            sx={{
              height: 16,
              fontSize: '0.56rem',
              fontWeight: 700,
              bgcolor: `${item.badgeColor}15`,
              color: item.badgeColor,
              flexShrink: 0
            }}
          />
        </Stack>

        <Typography
          variant="caption"
          sx={{
            fontSize: { xs: '0.6rem', sm: '0.68rem' },
            color: '#64748B',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 0.8
          }}
        >
          📍 {item.currentStation.replace('สแตนด์บาย: ', '')}
        </Typography>

        {/* ปุ่มคลิกเพื่อดูโปรไฟล์คนขับ */}
        <Box
          sx={{
            py: { xs: 0.6, sm: 0.8 },
            px: 1,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: isOnline ? '#F0FDF4' : '#F8FAFC',
            border: isOnline ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
            color: isOnline ? '#166534' : '#64748B',
            fontSize: { xs: '0.66rem', sm: '0.74rem' },
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: isOnline ? '#DCFCE7' : '#F1F5F9'
            }
          }}
        >
          <span>👤 ดูโปรไฟล์คนขับ</span>
        </Box>
      </Box>
    </Box>
  );
}
