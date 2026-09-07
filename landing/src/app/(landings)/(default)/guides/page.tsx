'use client';

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { guides, PAGE_SIZE, Guide } from '@/data/guides';
import GuideCard from '@/components/guides/GuideCard';
import CtaBanner from '@/components/guides/CtaBanner';

export default function TouristGuidePage() {
  const [page, setPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Filter by location if selected
  const filteredGuides = useMemo(() => {
    if (selectedLocation === 'all') return guides;
    return guides.filter(function (g) {
      return g.location.toLowerCase() === selectedLocation.toLowerCase();
    });
  }, [selectedLocation]);

  // Total pages based on filtered guides
  const totalPages = Math.max(1, Math.ceil(filteredGuides.length / PAGE_SIZE));

  // Current page guides
  const visibleGuides = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredGuides.slice(start, start + PAGE_SIZE);
  }, [filteredGuides, page]);

  const goNextPage = () => {
    setPage(function (current) {
      return (current % totalPages) + 1;
    });
  };

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    setPage(1);
  };

  return (
    <Box sx={{ bgcolor: '#faf9f6', minHeight: '100vh' }}>
      {/* 1. Hero Page Banner */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 220, sm: 300, md: 360 },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          component="img"
          src="/images/hero-beach.jpg"
          alt="Thai beach with limestone mountains"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* White soft overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255, 255, 255, 0.45)'
          }}
        />

        {/* Title */}
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-display, serif)',
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
              color: '#082340',
              textShadow: '0 2px 8px rgba(255,255,255,0.8)'
            }}
          >
            Select Your Tourist Guide
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
              fontWeight: 600,
              color: '#1c2f7d',
              fontSize: { xs: '0.9rem', sm: '1.1rem' }
            }}
          >
            สัมผัสประสบการณ์ท่องเที่ยวไทยแท้จริง ผ่านการนำทางของผู้เชี่ยวชาญท้องถิ่น
          </Typography>
        </Box>
      </Box>

      {/* 2. Main Content & Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Quick Filter Bar */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#082340', mr: 1 }}>
            ปลายทาง:
          </Typography>
          <Chip
            label="ทั้งหมด (All Locations)"
            clickable
            onClick={() => handleLocationChange('all')}
            sx={{
              fontWeight: 700,
              bgcolor: selectedLocation === 'all' ? '#082340' : '#ffffff',
              color: selectedLocation === 'all' ? '#ffffff' : '#082340',
              border: '1px solid',
              borderColor: selectedLocation === 'all' ? '#082340' : '#cbd5e1',
              '&:hover': { bgcolor: selectedLocation === 'all' ? '#1c2f7d' : '#f1f5f9' }
            }}
          />
          <Chip
            label="กรุงเทพฯ (Bangkok)"
            clickable
            onClick={() => handleLocationChange('bangkok')}
            sx={{
              fontWeight: 700,
              bgcolor: selectedLocation === 'bangkok' ? '#082340' : '#ffffff',
              color: selectedLocation === 'bangkok' ? '#ffffff' : '#082340',
              border: '1px solid',
              borderColor: selectedLocation === 'bangkok' ? '#082340' : '#cbd5e1',
              '&:hover': { bgcolor: selectedLocation === 'bangkok' ? '#1c2f7d' : '#f1f5f9' }
            }}
          />
          <Chip
            label="เชียงใหม่ (Chiang Mai)"
            clickable
            onClick={() => handleLocationChange('chiang mai')}
            sx={{
              fontWeight: 700,
              bgcolor: selectedLocation === 'chiang mai' ? '#082340' : '#ffffff',
              color: selectedLocation === 'chiang mai' ? '#ffffff' : '#082340',
              border: '1px solid',
              borderColor: selectedLocation === 'chiang mai' ? '#082340' : '#cbd5e1',
              '&:hover': { bgcolor: selectedLocation === 'chiang mai' ? '#1c2f7d' : '#f1f5f9' }
            }}
          />
        </Stack>

        {/* Guide Cards 3-Column Responsive Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 4,
            pb: 6
          }}
        >
          {visibleGuides.map(function (guide: Guide) {
            return <GuideCard key={guide.id} guide={guide} />;
          })}
        </Box>

        {/* 3. Pagination */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="center"
          sx={{ pt: 2, pb: 6 }}
        >
          {Array.from({ length: totalPages }, function (_, index) {
            const pageNum = index + 1;
            const isActive = page === pageNum;

            return (
              <Button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                sx={{
                  minWidth: 40,
                  height: 40,
                  p: 0,
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: '1px solid',
                  borderColor: isActive ? '#082340' : '#cbd5e1',
                  bgcolor: isActive ? '#082340' : '#ffffff',
                  color: isActive ? '#ffffff' : '#082340',
                  boxShadow: isActive ? '0 4px 10px rgba(8,35,64,0.2)' : 'none',
                  '&:hover': {
                    bgcolor: isActive ? '#1c2f7d' : '#fef3c7',
                    borderColor: '#f2b429'
                  }
                }}
              >
                {pageNum}
              </Button>
            );
          })}

          {totalPages > 1 && (
            <Button
              onClick={goNextPage}
              sx={{
                ml: 1,
                borderRadius: '10px',
                px: 2,
                py: 1,
                fontWeight: 800,
                fontSize: '1rem',
                color: '#082340',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(242,180,41,0.15)',
                  color: '#d3940a'
                }
              }}
            >
              More Guides &rsaquo;
            </Button>
          )}
        </Stack>
      </Container>

      {/* 4. Bottom CTA Booking Banner */}
      <CtaBanner />
    </Box>
  );
}
