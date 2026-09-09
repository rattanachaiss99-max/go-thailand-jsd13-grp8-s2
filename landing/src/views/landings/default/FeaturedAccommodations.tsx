'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ContainerWrapper from '@/components/ContainerWrapper';
import SearchBar from '@/components/yok/SearchBar';
import PropertyCard from '@/components/yok/PropertyCard';
import Button from '@/components/yok/Button';
import { properties } from '@/data/properties';

export default function FeaturedAccommodations() {
  // Take first 4 properties as featured highlights
  const featured = properties.slice(0, 4);

  return (
    <Box className="yok-container" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc' }}>
      <ContainerWrapper>
        {/* Search Bar section */}
        <Box sx={{ mb: { xs: 6, md: 8 }, mt: { xs: -6, md: -8 }, position: 'relative', zIndex: 10 }}>
          <SearchBar />
        </Box>

        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Chip
            label="RECOMMENDED STAYS"
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              mb: 1.5,
              bgcolor: 'primary.light',
              color: 'primary.main'
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
            ที่พักแนะนำยอดนิยม
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 640, mx: 'auto' }}>
            คัดสรรรีสอร์ตและโรงแรมคุณภาพทั่วไทย พร้อมสิ่งอำนวยความสะดวกครบครัน เพื่อช่วงเวลาพักผ่อนที่ดีที่สุดของคุณ
          </Typography>
        </Box>

        {/* 4 Featured Property Cards in a Grid */}
        <Grid container spacing={3}>
          {featured.map((property) => (
            <Grid key={property.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <PropertyCard property={property} mode="mini" />
            </Grid>
          ))}
        </Grid>

        {/* Bottom Call to Action */}
        <Box sx={{ textAlign: 'center', mt: { xs: 5, md: 7 } }}>
          <Button to="/accommodations" variant="primary" size="lg">
            ดูที่พักทั้งหมด ({properties.length} แห่ง) →
          </Button>
        </Box>
      </ContainerWrapper>
    </Box>
  );
}
