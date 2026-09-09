'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function CtaBanner() {
  return (
    <Box
      component="section"
      id="book"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minHeight: { xs: 260, md: 320 },
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src="/images/cta-sunset.jpg"
        alt="Sunset over a Thai beach with an infinity pool"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Light gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.65) 45%, rgba(255,255,255,0.1) 100%)'
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
        <Box sx={{ maxWidth: 540 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'var(--font-display, serif)',
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              lineHeight: 1.15,
              color: '#082340',
              mb: 1.5
            }}
          >
            Book Your Unforgettable Thai Experience Today!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(8, 35, 64, 0.9)',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              fontWeight: 500,
              mb: 3
            }}
          >
            Let us take care of your journey while you create beautiful memories.
          </Typography>

          <Button
            component={Link}
            href="/accommodations"
            variant="contained"
            sx={{
              bgcolor: '#f2b429',
              color: '#082340',
              fontWeight: 800,
              fontSize: { xs: '1rem', md: '1.1rem' },
              borderRadius: '9999px',
              px: { xs: 3.5, md: 4.5 },
              py: { xs: 1.2, md: 1.5 },
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(242,180,41,0.35)',
              '&:hover': {
                bgcolor: '#ffc95e',
                boxShadow: '0 10px 24px rgba(242,180,41,0.45)',
                transform: 'translateY(-2px)'
              },
              '&:active': {
                bgcolor: '#d3940a',
                transform: 'scale(0.98)'
              }
            }}
          >
            Book Now &rsaquo;
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
