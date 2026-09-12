'use client';

// ============================================================================
// Shopping Cart Page (/cart) — Task 5 & Task 6
// ============================================================================

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ContainerWrapper from '@/components/ContainerWrapper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, itemCount, totalAmount, loading, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: '#f8fafc', minHeight: '90vh' }}>
      <ContainerWrapper>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
          <Box>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'primary.main', fontWeight: 700 }}>
              Shopping Cart & Booking Review
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5 }}>
              ตะกร้าสินค้าและการจองของคุณ ({itemCount} รายการ)
            </Typography>
          </Box>

          {items.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={clearCart}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, alignSelf: { xs: 'flex-start', sm: 'center' } }}
            >
              🗑️ ล้างตะกร้าทั้งหมด
            </Button>
          )}
        </Stack>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
            <CircularProgress size={44} />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              กำลังโหลดรายการในตะกร้า...
            </Typography>
          </Box>
        ) : items.length === 0 ? (
          <Card sx={{ borderRadius: 4, border: '1px dashed', borderColor: 'divider', p: { xs: 4, md: 8 }, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '3.5rem', mb: 1 }}>🛒</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              ตะกร้าสินค้าของคุณยังว่างอยู่
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: 450, mx: 'auto' }}>
              เลือกชมแพ็กเกจท่องเที่ยว ทัวร์ หรือบริการยานพาหนะของ Go Thailand แล้วเพิ่มลงในตะกร้าได้เลยครับ
            </Typography>
            <Button
              component={Link}
              href="/products"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#082340',
                borderRadius: 2.5,
                px: 4,
                py: 1.2,
                fontWeight: 700,
                '&:hover': { bgcolor: '#0d3b66' }
              }}
            >
              ✨ เลือกดูแพ็กเกจท่องเที่ยว
            </Button>
          </Card>
        ) : (
          <Grid container spacing={4}>
            {/* Left: Cart Items List */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2}>
                {items.map((item) => {
                  const itemId = (item._id as string) || item.productId;
                  return (
                    <Card
                      key={itemId}
                      sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 2.5,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2.5,
                        alignItems: { sm: 'center' }
                      }}
                    >
                      {/* Item Image */}
                      <Box sx={{ width: { xs: '100%', sm: 120 }, height: 90, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                        <CardMedia
                          component="img"
                          image={
                            item.imageUrl ||
                            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
                          }
                          alt={item.name}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>

                      {/* Details */}
                      <Box sx={{ flexGrow: 1 }}>
                        {item.tag && (
                          <Chip
                            label={item.tag}
                            size="small"
                            sx={{ fontWeight: 600, fontSize: '0.72rem', height: 20, mb: 0.5 }}
                          />
                        )}
                        <Typography
                          variant="subtitle1"
                          component={Link}
                          href={`/products/${item.productId}`}
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            textDecoration: 'none',
                            display: 'block',
                            '&:hover': { color: 'primary.main' }
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, mt: 0.5 }}>
                          ฿{item.price.toLocaleString()} / สิทธิ์
                        </Typography>
                      </Box>

                      {/* Quantity Controls (Task 6 PUT) */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                        >
                          -
                        </IconButton>
                        <Typography variant="body1" sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                        >
                          +
                        </IconButton>
                      </Stack>

                      {/* Subtotal & Delete (Task 6 DELETE) */}
                      <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: 110, flexShrink: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </Typography>
                        <Button
                          color="error"
                          size="small"
                          onClick={() => removeFromCart(itemId)}
                          sx={{ p: 0, minWidth: 0, textTransform: 'none', fontSize: '0.8rem', mt: 0.5 }}
                        >
                          ลบรายการ
                        </Button>
                      </Box>
                    </Card>
                  );
                })}
              </Stack>
            </Grid>

            {/* Right: Order Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 3.5, border: '1px solid', borderColor: 'divider', p: 3, position: 'sticky', top: 90 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
                  สรุปคำสั่งซื้อ (Order Summary)
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      รวมมูลค่าสินค้า ({itemCount} รายการ)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ฿{totalAmount.toLocaleString()}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ค่าบริการ & ภาษีมูลค่าเพิ่ม (VAT 7%)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      รวมแล้ว
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    ยอดชำระสุทธิ
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ฿{totalAmount.toLocaleString()}
                  </Typography>
                </Stack>

                <Button
                  component={Link}
                  href="/checkout"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.4,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    bgcolor: '#082340',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#0d3b66' }
                  }}
                >
                  💳 ดำเนินการชำระเงิน (Checkout)
                </Button>

                <Button
                  component={Link}
                  href="/products"
                  variant="text"
                  fullWidth
                  sx={{ mt: 1.5, textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
                >
                  ← เลือกซื้อแพ็กเกจท่องเที่ยวเพิ่ม
                </Button>
              </Card>
            </Grid>
          </Grid>
        )}
      </ContainerWrapper>
    </Box>
  );
}
