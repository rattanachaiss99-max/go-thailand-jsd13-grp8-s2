'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ContainerWrapper from '@/components/ContainerWrapper';
import ThailandInteractiveMap from '@/components/maps/ThailandInteractiveMap';
import PropertyCard from '@/components/yok/PropertyCard';
import { properties } from '@/data/properties';
import { Province } from '@/data/thailandProvinces';

export default function ExploreDestinations() {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);

  // กรองที่พักตามภาคของจังหวัดที่เลือก หรือแสดงตัวอย่างที่พัก
  const matchedProperties = React.useMemo(() => {
    if (!selectedProvince) {
      return properties.slice(0, 3);
    }
    const filtered = properties.filter((p) => p.region === selectedProvince.simplifiedRegion);
    return filtered.length > 0 ? filtered.slice(0, 3) : properties.slice(0, 3);
  }, [selectedProvince]);

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff' }}>
      <ContainerWrapper>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Chip
            label="EXPLORE THAILAND MAP"
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
            ค้นพบการเดินทางในทุกจังหวัดทั่วไทย
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 680, mx: 'auto' }}>
            เลือกจุดหมายปลายทางที่คุณใฝ่ฝันผ่านแผนที่แบบอินเทอร์แอคทีฟ หรือค้นหาชื่อจังหวัดเพื่อดูที่พักและกิจกรรมยอดนิยม
          </Typography>
        </Box>

        {/* Interactive Map Component */}
        <ThailandInteractiveMap
          onSelectProvince={(prov) => setSelectedProvince(prov)}
        />

        {/* ที่พักแนะนำในโซนที่เลือก */}
        <Box sx={{ mt: { xs: 6, md: 8 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                ที่พักแนะนำในโซน {selectedProvince ? selectedProvince.nameTh : 'ยอดนิยม'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                คัดสรรเพื่อการเดินทางที่สะดวกสบายที่สุดของคุณ
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {matchedProperties.map((property) => (
              <Grid key={property.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <PropertyCard property={property} mode="mini" />
              </Grid>
            ))}
          </Grid>
        </Box>
      </ContainerWrapper>
    </Box>
  );
}
