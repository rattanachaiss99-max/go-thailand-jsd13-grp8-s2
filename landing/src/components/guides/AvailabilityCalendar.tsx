'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { getAvailableDays } from '@/data/guides';

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface AvailabilityCalendarProps {
  guideId: number;
  guideName?: string;
  onSelectDate?: (day: number, month: number, year: number) => void;
}

export default function AvailabilityCalendar({
  guideId,
  guideName = 'Guide',
  onSelectDate
}: AvailabilityCalendarProps) {
  const today = new Date();
  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth() // 0 = Jan ... 11 = Dec
  });

  const availableDays = getAvailableDays(guideId, view.year, view.month);
  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const goPrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setView(function (prev) {
      return prev.month === 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: prev.month - 1 };
    });
  };

  const goNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setView(function (prev) {
      return prev.month === 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: prev.month + 1 };
    });
  };

  return (
    <Box
      sx={{
        mt: 1.5,
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        fontSize: '11px'
      }}
    >
      {/* Dark Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#082340',
          color: '#ffffff',
          px: 1,
          py: 0.5
        }}
      >
        <IconButton
          size="small"
          onClick={goPrevMonth}
          aria-label="Previous month"
          sx={{ color: '#ffffff', p: 0.5, fontSize: '14px', '&:hover': { color: '#f2b429' } }}
        >
          ‹
        </IconButton>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 700, lineHeight: 1.1, color: '#ffffff' }}>
            Available Date
          </Typography>
          <Typography sx={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
            {MONTH_NAMES[view.month]} {view.year}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={goNextMonth}
          aria-label="Next month"
          sx={{ color: '#ffffff', p: 0.5, fontSize: '14px', '&:hover': { color: '#f2b429' } }}
        >
          ›
        </IconButton>
      </Box>

      {/* Weekday Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          bgcolor: '#f1f5f9',
          textAlign: 'center',
          py: 0.25,
          fontSize: '8px',
          fontWeight: 600,
          color: '#64748b'
        }}
      >
        {WEEK_DAYS.map(function (day) {
          return <span key={day}>{day}</span>;
        })}
      </Box>

      {/* Days Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          p: '4px',
          textAlign: 'center',
          fontSize: '9px'
        }}
      >
        {Array.from({ length: firstWeekday }, function (_, i) {
          return <span key={'blank-' + i} />;
        })}

        {Array.from({ length: daysInMonth }, function (_, i) {
          const day = i + 1;
          const isAvailable = availableDays.indexOf(day) !== -1;

          return (
            <Box
              key={day}
              component="span"
              title={isAvailable ? guideName + ' is available on ' + day + ' ' + MONTH_NAMES[view.month] : undefined}
              onClick={function (e) {
                if (isAvailable && onSelectDate) {
                  e.stopPropagation();
                  onSelectDate(day, view.month, view.year);
                }
              }}
              sx={{
                width: 18,
                height: 18,
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                fontSize: '9px',
                lineHeight: 1,
                cursor: isAvailable ? 'pointer' : 'default',
                fontWeight: isAvailable ? 700 : 400,
                bgcolor: isAvailable ? '#f2b429' : 'transparent',
                color: isAvailable ? '#082340' : '#94a3b8',
                transition: 'all 0.15s ease-in-out',
                '&:hover': isAvailable
                  ? {
                      bgcolor: '#ffc95e',
                      transform: 'scale(1.15)'
                    }
                  : {}
              }}
            >
              {day}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
