'use client';

// ============================================================================
// Page: /login — เข้าสู่ระบบ Go Thailand
// Dedicated direct route for User Login
// ============================================================================

import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import AuthLogin from '@/components/auth/AuthLogin';

export default function LoginPage() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Card sx={{ p: { xs: 3, md: 4.5 }, borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h3" align="center" sx={{ mb: 1, fontWeight: 700 }}>
          เข้าสู่ระบบ
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
          ยินดีต้อนรับกลับสู่ Go Thailand ท่องเที่ยวทั่วไทย
        </Typography>

        <AuthLogin />

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              ยังไม่มีบัญชีผู้ใช้?
            </Typography>
            <Link
              component={NextLink}
              href="/register"
              underline="hover"
              variant="subtitle2"
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              สมัครสมาชิกที่นี่
            </Link>
          </Stack>
        </Box>
      </Card>
    </Container>
  );
}
