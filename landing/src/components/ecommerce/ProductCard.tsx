'use client';

// ============================================================================
// ProductCard Component — E-Commerce Single Item Card (Task 5)
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useCart } from '@/contexts/CartContext';
import { THAILAND_PROVINCES } from '@/data/thailandProvinces';

export interface ProductItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  date: string | Date;
  tag: string;
  isService: boolean;
  imageUrl?: string;
  province?: string;
  serviceType?: string;
}

export default function ProductCard({ product }: { product: ProductItem }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formattedDate = product.date
    ? new Date(product.date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addToCart(product, 1);
      setSnackbarOpen(true);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3.5,
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.25s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
            borderColor: 'primary.light'
          }
        }}
      >
        {/* Media Image */}
        <Box sx={{ position: 'relative', height: 220 }}>
          <CardMedia
            component="img"
            image={
              product.imageUrl ||
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
            }
            alt={product.name}
            sx={{ height: '100%', objectFit: 'cover' }}
          />

          {/* Badges */}
          <Stack
            direction="row"
            spacing={0.8}
            flexWrap="wrap"
            useFlexGap
            sx={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 1 }}
          >
            <Chip
              label={product.tag}
              size="small"
              sx={{
                bgcolor: 'rgba(8, 35, 64, 0.88)',
                backdropFilter: 'blur(6px)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.72rem'
              }}
            />
            {product.province && (
              <Chip
                label={`📍 ${THAILAND_PROVINCES.find((p) => p.id === product.province)?.nameTh || product.province}`}
                size="small"
                sx={{
                  bgcolor: 'rgba(14, 116, 144, 0.92)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.72rem'
                }}
              />
            )}
            {product.serviceType && (
              <Chip
                label={
                  product.serviceType === 'stay'
                    ? '🏠 ที่พัก'
                    : product.serviceType === 'car'
                    ? '🚗 รถเช่า'
                    : product.serviceType === 'guide'
                    ? '🧭 ไกด์'
                    : '🛶 ทัวร์'
                }
                size="small"
                sx={{
                  bgcolor: 'rgba(234, 179, 8, 0.95)',
                  backdropFilter: 'blur(6px)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.72rem'
                }}
              />
            )}
            {product.isService && !product.serviceType && (
              <Chip
                label="✨ บริการท่องเที่ยว"
                size="small"
                sx={{
                  bgcolor: 'rgba(234, 179, 8, 0.9)',
                  backdropFilter: 'blur(6px)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.72rem'
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Content */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
          >
            📅 {formattedDate ? `กำหนดการ: ${formattedDate}` : 'เปิดจองตลอดปี'}
          </Typography>

          <Typography
            variant="h6"
            component={Link}
            href={`/products/${product._id}`}
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              textDecoration: 'none',
              lineHeight: 1.4,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              '&:hover': { color: 'primary.main' }
            }}
          >
            {product.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.description}
          </Typography>

          <Box sx={{ mt: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  ราคาเริ่มต้น
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ฿{product.price.toLocaleString()}
                </Typography>
              </Box>

              <Chip
                label={`เหลือ ${product.quantity} ที่`}
                size="small"
                variant="outlined"
                color={product.quantity > 5 ? 'success' : 'warning'}
                sx={{ fontWeight: 600 }}
              />
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button
                component={Link}
                href={`/products/${product._id}`}
                variant="outlined"
                size="small"
                sx={{ flex: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                ดูรายละเอียด
              </Button>
              <Button
                variant="contained"
                size="small"
                disabled={adding || product.quantity <= 0}
                onClick={handleAddToCart}
                sx={{
                  flex: 1.3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: '#082340',
                  '&:hover': { bgcolor: '#0d3b66' }
                }}
              >
                {adding ? <CircularProgress size={16} color="inherit" /> : '🛒 เพิ่มลงตะกร้า'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
          เพิ่ม "{product.name}" ลงในตะกร้าเรียบร้อยแล้ว!
        </Alert>
      </Snackbar>
    </>
  );
}
