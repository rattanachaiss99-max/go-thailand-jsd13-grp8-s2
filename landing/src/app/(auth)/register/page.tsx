'use client';

import { useState } from 'react';

// @mui
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// @project
import AuthRegister from '@/components/auth/AuthRegister';
import AuthLogin from '@/components/auth/AuthLogin';
import AuthForgotPassword from '@/components/auth/AuthForgotPassword';

// ----------------------------------------------------------------------------
// Page: /register  — ลงทะเบียน / ล็อกอิน / ลืมรหัส (แท็บสลับ)
// ----------------------------------------------------------------------------

function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    'aria-controls': `auth-tabpanel-${index}`
  };
}

export default function RegisterPage() {
  const [tab, setTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h3" align="center" sx={{ mb: 1 }}>
        บัญชี Go Thailand
      </Typography>
      <Typography variant="body1" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
        เข้าสู่ระบบหรือสมัครสมาชิกเพื่อจองทัวร์และที่พัก
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={handleChange} variant="fullWidth" aria-label="auth tabs">
          <Tab label="สมัครสมาชิก" {...a11yProps(0)} />
          <Tab label="ล็อกอิน" {...a11yProps(1)} />
          <Tab label="ลืมรหัส" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tab !== 0} id="auth-tabpanel-0" aria-labelledby="auth-tab-0">
        {tab === 0 && <AuthRegister />}
      </Box>
      <Box role="tabpanel" hidden={tab !== 1} id="auth-tabpanel-1" aria-labelledby="auth-tab-1">
        {tab === 1 && <AuthLogin />}
      </Box>
      <Box role="tabpanel" hidden={tab !== 2} id="auth-tabpanel-2" aria-labelledby="auth-tab-2">
        {tab === 2 && <AuthForgotPassword />}
      </Box>
    </Container>
  );
}
