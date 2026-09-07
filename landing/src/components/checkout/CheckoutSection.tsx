'use client';

import React, { ReactNode } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CheckoutSectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function CheckoutSection({
  title,
  icon,
  children,
  className = '',
  style = {}
}: CheckoutSectionProps) {
  return (
    <Card
      className={className}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 10px rgba(8, 35, 64, 0.04)',
        mb: 3,
        ...style
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        {icon && (
          <Typography component="span" sx={{ fontSize: '1.25rem' }}>
            {icon}
          </Typography>
        )}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontFamily: 'var(--font-serif)'
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Card>
  );
}
