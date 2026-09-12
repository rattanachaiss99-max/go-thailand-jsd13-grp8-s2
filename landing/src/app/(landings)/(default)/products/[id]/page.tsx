'use client';

// ============================================================================
// ProductInfo Page (/products/[id]) — Task 5 E-Commerce Component
// ============================================================================

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ContainerWrapper from '@/components/ContainerWrapper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import { useCart } from '@/contexts/CartContext';
import { ProductItem } from '@/components/ecommerce/ProductCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductInfoPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`/api/products/${resolvedParams.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('ไม่พบข้อมูลสินค้า/บริการนี้');
        return res.json();
      })
      .then((data) => {
        if (active) {
          if (data.success && data.data) {
            setProduct(data.data);
          } else {
            setError(data.error || 'ไม่พบสินค้า');
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
  }, [resolvedParams.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product, quantity);
      setSnackbarOpen(true);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product, quantity);
      router.push('/cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
          กำลังโหลดรายละเอียดแพ็กเกจ...
        </Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <ContainerWrapper sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'ไม่พบข้อมูลสินค้า'}
        </Alert>
        <Button component={Link} href="/products" variant="outlined">
          ← กลับสู่หน้ารวมแพ็กเกจ
        </Button>
      </ContainerWrapper>
    );
  }

  const formattedDate = product.date
    ? new Date(product.date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: '#f8fafc', minHeight: '90vh' }}>
      <ContainerWrapper>
        {/* Breadcrumb / Back Link */}
        <Box sx={{ mb: 3 }}>
          <Button component={Link} href="/products" variant="text" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            ← กลับสู่หน้ารวมสินค้าและแพ็กเกจทัวร์
          </Button>
        </Box>

        {/* Product Details Grid */}
        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', p: { xs: 2.5, md: 5 } }}>
          <Grid container spacing={5}>
            {/* Left Column: Image */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', height: { xs: 280, sm: 400 } }}>
                <CardMedia
                  component="img"
                  image={
                    product.imageUrl ||
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={product.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, left: 16 }}>
                  <Chip
                    label={product.tag}
                    sx={{ bgcolor: 'rgba(8, 35, 64, 0.9)', color: '#fff', fontWeight: 700 }}
                  />
                  {product.isService && (
                    <Chip
                      label="✨ บริการท่องเที่ยว"
                      sx={{ bgcolor: '#eab308', color: '#000', fontWeight: 700 }}
                    />
                  )}
                </Stack>
              </Box>
            </Grid>

            {/* Right Column: Information & Actions */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2.5}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.3 }}>
                  {product.name}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ฿{product.price.toLocaleString()}
                  </Typography>
                  <Chip
                    label={`คงเหลือ ${product.quantity} ที่นั่ง/สิทธิ์`}
                    color={product.quantity > 5 ? 'success' : 'warning'}
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 0.5 }}>
                    📅 วันที่เดินทาง / กำหนดการ
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formattedDate || 'ระบุวันเดินทางได้ในขั้นตอนชำระเงิน'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 0.5 }}>
                    📝 รายละเอียดสินค้าและบริการ
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {product.description}
                  </Typography>
                </Box>

                <Divider />

                {/* Quantity Selector */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    จำนวน (Quantity)
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <IconButton
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                    >
                      -
                    </IconButton>
                    <Typography variant="h6" sx={{ minWidth: 36, textAlign: 'center', fontWeight: 700 }}>
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                      disabled={quantity >= product.quantity}
                      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                    >
                      +
                    </IconButton>
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                      ราคารวม: <strong>฿{(product.price * quantity).toLocaleString()}</strong>
                    </Typography>
                  </Stack>
                </Box>

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={adding || product.quantity <= 0}
                    onClick={handleAddToCart}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2.5,
                      fontWeight: 700,
                      bgcolor: '#082340',
                      '&:hover': { bgcolor: '#0d3b66' }
                    }}
                  >
                    {adding ? <CircularProgress size={20} color="inherit" /> : '🛒 เพิ่มลงตะกร้า'}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={adding || product.quantity <= 0}
                    onClick={handleBuyNow}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2.5,
                      fontWeight: 700,
                      bgcolor: '#eab308',
                      color: '#000',
                      '&:hover': { bgcolor: '#ca8a04' }
                    }}
                  >
                    ⚡ ดำเนินการจองทันที
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </ContainerWrapper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
          เพิ่ม "{product.name}" จำนวน {quantity} ชิ้น ลงในตะกร้าเรียบร้อยแล้ว!
        </Alert>
      </Snackbar>
    </Box>
  );
}
