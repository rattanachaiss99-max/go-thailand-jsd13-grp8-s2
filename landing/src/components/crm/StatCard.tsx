'use client';

import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  suffix?: string;
  variant?: 'default' | 'highlight';
  onClick?: () => void;
}

export default function StatCard({
  icon,
  label,
  value,
  suffix,
  variant = 'default',
  onClick
}: StatCardProps) {
  const isHighlight = variant === 'highlight';
  const isInteractive = typeof onClick === 'function';

  return (
    <Card
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: 3,
        minHeight: 148,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: isInteractive ? 'pointer' : 'default',
        transition: 'all 0.25s ease',
        ...(isHighlight
          ? {
              bgcolor: '#082340',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(8, 35, 64, 0.16)',
              '&:hover': isInteractive ? { transform: 'translateY(-3px)' } : {}
            }
          : {
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 10px rgba(8, 35, 64, 0.04)',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: '0 6px 18px rgba(8, 35, 64, 0.08)',
                transform: isInteractive ? 'translateY(-3px)' : 'none'
              }
            })
      }}
    >
      <Box sx={{ fontSize: '2rem', lineHeight: 1 }}>
        {icon}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: isHighlight ? 'rgba(255, 255, 255, 0.75)' : 'text.secondary'
          }}
        >
          {label}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: 'var(--font-serif)',
              color: isHighlight ? '#efc265' : 'text.primary'
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          {suffix && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: isHighlight ? 'rgba(255, 255, 255, 0.65)' : 'text.secondary'
              }}
            >
              {suffix}
            </Typography>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
