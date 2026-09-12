'use client';

// ============================================================================
// Products Catalog & Custom Travel Service Page (/products)
// Sprint 2: Task 4 (Form Validation) + Task 5 (E-Commerce Catalog)
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import ContainerWrapper from '@/components/ContainerWrapper';
import ProductList from '@/components/ecommerce/ProductList';
import CustomTravelServiceForm from '@/components/ecommerce/CustomTravelServiceForm';

export default function ProductsPage() {
  const [activeView, setActiveView] = useState<'catalog' | 'form'>('catalog');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSuccess = () => {
    // Refresh product catalog and return to catalog view
    setRefreshKey((k) => k + 1);
    setActiveView('catalog');
  };

  return (
    <Box sx={{ pb: 12, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Header Banner */}
      <Box
        sx={{
          bgcolor: '#082340',
          color: '#fff',
          py: { xs: 5, md: 6 },
          mb: { xs: 3, md: 4 }
        }}
      >
        <ContainerWrapper>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ md: 'center' }}
            spacing={3}
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Chip
                  label="Sprint 2 MERN E-Commerce"
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700 }}
                />
                <Chip
                  label="Task 4: Form Validation"
                  size="small"
                  sx={{ bgcolor: '#eab308', color: '#000', fontWeight: 800 }}
                />
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, color: '#fff' }}>
                บริการท่องเที่ยว & ทริปแพ็กเกจ
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mt: 1, maxWidth: 680 }}>
                ค้นหาและจองบริการท่องเที่ยว หรือระบุจังหวัดและประเภทบริการท่องเที่ยวที่ต้องการด้วยตนเอง
                พร้อมระบบตรวจสอบข้อมูลฟอร์ม (Form Validation) ตามเกณฑ์ Task 4
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant={activeView === 'form' ? 'contained' : 'outlined'}
                onClick={() => setActiveView(activeView === 'form' ? 'catalog' : 'form')}
                sx={{
                  bgcolor: activeView === 'form' ? '#eab308' : 'rgba(255,255,255,0.1)',
                  color: activeView === 'form' ? '#000' : '#fff',
                  borderColor: 'rgba(255,255,255,0.4)',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 2.5,
                  py: 1.2,
                  '&:hover': {
                    bgcolor: activeView === 'form' ? '#ca8a04' : 'rgba(255,255,255,0.2)',
                    borderColor: '#fff'
                  }
                }}
              >
                {activeView === 'form' ? '🛍️ ดูรายการสินค้า (Catalog)' : '➕ ระบุจังหวัด & บริการ (Task 4)'}
              </Button>
              <Button
                component={Link}
                href="/cart"
                variant="contained"
                sx={{
                  bgcolor: '#38bdf8',
                  color: '#082340',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 2.5,
                  py: 1.2,
                  '&:hover': { bgcolor: '#0284c7', color: '#fff' }
                }}
              >
                🛒 ตะกร้าสินค้า
              </Button>
              <Button
                component={Link}
                href="/admin/products"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  px: 2,
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' }
                }}
              >
                ⚙️ จัดการสินค้า (Admin)
              </Button>
            </Stack>
          </Stack>
        </ContainerWrapper>
      </Box>

      {/* Main Container */}
      <ContainerWrapper>
        {/* Navigation Switch Tabs */}
        <Paper
          elevation={0}
          sx={{
            p: 1,
            mb: 4,
            borderRadius: 3,
            bgcolor: '#ffffff',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 1
          }}
        >
          <Button
            onClick={() => setActiveView('catalog')}
            variant={activeView === 'catalog' ? 'contained' : 'text'}
            sx={{
              flex: 1,
              py: 1.3,
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              bgcolor: activeView === 'catalog' ? '#082340' : 'transparent',
              color: activeView === 'catalog' ? '#fff' : 'text.secondary',
              '&:hover': {
                bgcolor: activeView === 'catalog' ? '#0d3b66' : 'rgba(0,0,0,0.04)'
              }
            }}
          >
            🛍️ รายการบริการและแพ็กเกจ (Catalog Grid)
          </Button>

          <Button
            onClick={() => setActiveView('form')}
            variant={activeView === 'form' ? 'contained' : 'text'}
            sx={{
              flex: 1,
              py: 1.3,
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              bgcolor: activeView === 'form' ? '#eab308' : 'transparent',
              color: activeView === 'form' ? '#000' : 'text.secondary',
              '&:hover': {
                bgcolor: activeView === 'form' ? '#ca8a04' : 'rgba(0,0,0,0.04)'
              }
            }}
          >
            ➕ ฟอร์มระบุจังหวัด & บริการท่องเที่ยว (Task 4 Form Validation)
          </Button>
        </Paper>

        {/* View 1: User-Facing Form (Task 4 Validation) */}
        {activeView === 'form' && (
          <Box sx={{ mb: 6 }}>
            <CustomTravelServiceForm onSuccess={handleFormSuccess} />
          </Box>
        )}

        {/* View 2: Product Catalog Grid */}
        {activeView === 'catalog' && (
          <Box>
            {/* Quick Callout to Form */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 3,
                bgcolor: 'rgba(234, 179, 8, 0.08)',
                border: '1px dashed #eab308',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { sm: 'center' },
                gap: 2
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#854d0e' }}>
                  ✨ ต้องการระบุจังหวัดหรือประเภทบริการท่องเที่ยวด้วยตนเอง? (Task 4)
                </Typography>
                <Typography variant="body2" sx={{ color: '#713f12', mt: 0.2 }}>
                  คุณสามารถกรอกฟอร์มเพื่อเสนอแพ็กเกจหรือบริการท่องเที่ยวตาม 77 จังหวัด พร้อมระบบตรวจสอบความถูกต้องแบบครบวงจร
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => setActiveView('form')}
                sx={{
                  bgcolor: '#082340',
                  color: '#fff',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  borderRadius: 2,
                  px: 2.5,
                  '&:hover': { bgcolor: '#0d3b66' }
                }}
              >
                เปิดฟอร์มระบุบริการ ➔
              </Button>
            </Paper>

            <ProductList key={refreshKey} />
          </Box>
        )}
      </ContainerWrapper>
    </Box>
  );
}
