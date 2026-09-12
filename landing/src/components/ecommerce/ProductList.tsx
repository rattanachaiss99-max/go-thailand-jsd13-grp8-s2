'use client';

// ============================================================================
// ProductList Component — E-Commerce Catalog Grid & Filter (Task 5)
// Follows react-crm-lifecycle:
// - Mount → fetch once with [] deps + cleanup flag (active = false)
// - loading + error states handled
// ============================================================================

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ProductCard, { ProductItem } from './ProductCard';

const CATEGORY_TAGS = ['ทั้งหมด', 'ทัวร์ทางทะเล', 'ภูเขาและธรรมชาติ', 'กิจกรรมผจญภัย', 'บริการเดินทาง'];

export default function ProductList() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchProducts = (tag = selectedTag, search = searchQuery) => {
    let active = true;
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (tag && tag !== 'ทั้งหมด') queryParams.append('tag', tag);
    if (search.trim()) queryParams.append('search', search.trim());

    fetch(`/api/products?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลสินค้าได้');
        return res.json();
      })
      .then((data) => {
        if (active) {
          if (data.success && Array.isArray(data.data)) {
            setProducts(data.data);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  };

  useEffect(() => {
    const cleanup = fetchProducts(selectedTag, searchQuery);
    return cleanup;
  }, [selectedTag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(selectedTag, searchQuery);
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Search & Tag Filter Bar */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          sx={{ mb: 2.5 }}
        >
          {/* Category Tags */}
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {CATEGORY_TAGS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                clickable
                onClick={() => setSelectedTag(tag)}
                color={selectedTag === tag ? 'primary' : 'default'}
                variant={selectedTag === tag ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2.5,
                  py: 2,
                  px: 1,
                  fontSize: '0.85rem',
                  borderColor: selectedTag === tag ? 'primary.main' : 'divider'
                }}
              />
            ))}
          </Stack>

          {/* Search Box */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ minWidth: { xs: '100%', md: 320 } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="ค้นหาแพ็กเกจทัวร์, ทะเล, ภูเขา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">🔍</InputAdornment>
              }}
              sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchProducts()}>
              ลองใหม่
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
          <CircularProgress size={44} />
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
            กำลังโหลดรายการแพ็กเกจท่องเที่ยว Go Thailand...
          </Typography>
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            ไม่พบแพ็กเกจท่องเที่ยวที่ตรงกับเงื่อนไข
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นดูสิครับ
          </Typography>
          <Button variant="outlined" onClick={() => { setSelectedTag('ทั้งหมด'); setSearchQuery(''); }}>
            แสดงแพ็กเกจทั้งหมด
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
