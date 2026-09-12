'use client';

// ============================================================================
// User Profile Page (/profile) — Go Thailand
// Displays and manages personal information, addresses, membership tier,
// loyalty points, feedback submission, and quick links to booking/cart.
// ============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ContainerWrapper from '@/components/ContainerWrapper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Paper from '@mui/material/Paper';

import { useUser } from '@/contexts/UserContext';
import { submitFeedback } from '@/server/api/auth';
import SvgIcon from '@/components/SvgIcon';
import TravelTrophyPassport from '@/components/profile/TravelTrophyPassport';

const TIER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  bronze: { bg: '#CD7F32', text: '#FFFFFF', label: 'Bronze Member' },
  silver: { bg: '#9E9E9E', text: '#FFFFFF', label: 'Silver Member' },
  gold: { bg: '#DAA520', text: '#FFFFFF', label: 'Gold Member' },
  platinum: { bg: '#4A148C', text: '#FFFFFF', label: 'Platinum VIP' }
};

export default function ProfilePage() {
  const { user, token, loading, updateProfile, logout } = useUser();

  const [tab, setTab] = useState(0);

  // Profile edit form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatarUrl: '',
    preferredLanguage: 'th',
    addressLine1: '',
    city: '',
    province: '',
    postalCode: ''
  });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState<number | null>(5);
  const [feedbackTopic, setFeedbackTopic] = useState('แพ็กเกจท่องเที่ยว');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Populate form with user data once loaded
  useEffect(() => {
    if (user) {
      const primaryAddress = user.addresses?.[0] || {};
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || '',
        preferredLanguage: user.preferredLanguage || 'th',
        addressLine1: primaryAddress.line1 || '',
        city: primaryAddress.city || '',
        province: primaryAddress.province || '',
        postalCode: primaryAddress.postalCode || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);
    setSaving(true);

    try {
      const addresses = formData.addressLine1
        ? [
            {
              line1: formData.addressLine1,
              city: formData.city || 'กรุงเทพมหานคร',
              province: formData.province || 'กรุงเทพมหานคร',
              postalCode: formData.postalCode || '10110',
              country: 'TH'
            }
          ]
        : [];

      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        avatarUrl: formData.avatarUrl,
        preferredLanguage: formData.preferredLanguage,
        addresses
      });

      setSaveStatus({ type: 'success', message: 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว' });
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setFeedbackStatus(null);
    setFeedbackSubmitting(true);

    try {
      await submitFeedback(token, {
        rating: feedbackRating || 5,
        topic: feedbackTopic,
        comment: feedbackComment
      });
      setFeedbackStatus({ type: 'success', message: 'ขอบพระคุณสำหรับความคิดเห็นของท่าน!' });
      setFeedbackComment('');
    } catch (err) {
      setFeedbackStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'ไม่สามารถส่งความคิดเห็นได้ในขณะนี้'
      });
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not logged in, prompt user to log in or register
  if (!user) {
    return (
      <ContainerWrapper sx={{ py: { xs: 8, md: 12 } }}>
        <Card sx={{ maxWidth: 540, mx: 'auto', textAlign: 'center', p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Avatar sx={{ width: 72, height: 72, mx: 'auto', bgcolor: 'primary.light', color: 'primary.main', mb: 2 }}>
              <SvgIcon name="tabler-user-off" size={36} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              กรุณาเข้าสู่ระบบ
            </Typography>
            <Typography variant="body1" color="text.secondary">
              เข้าสู่ระบบเพื่อดูและจัดการข้อมูลส่วนตัว คะแนนสะสมสมาชิก และประวัติการจองทัวร์ Go Thailand
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button component={Link} href="/login?redirect=/profile" variant="contained" color="primary" size="large">
              เข้าสู่ระบบ (Sign In)
            </Button>
            <Button component={Link} href="/register?redirect=/profile" variant="outlined" color="primary" size="large">
              สมัครสมาชิกใหม่
            </Button>
          </Stack>
        </Card>
      </ContainerWrapper>
    );
  }

  const tier = user.membershipTier || 'bronze';
  const tierInfo = TIER_COLORS[tier] || TIER_COLORS.bronze;

  return (
    <ContainerWrapper sx={{ py: { xs: 4, md: 7 } }}>
      {/* Top Header Card */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          p: { xs: 3, md: 4 },
          boxShadow: 4
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: 'auto' }}>
            <Avatar
              src={formData.avatarUrl || user.avatarUrl}
              alt={user.firstName}
              sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                border: '3px solid #D4AF37',
                bgcolor: 'primary.main',
                fontSize: 36,
                fontWeight: 700
              }}
            >
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </Grid>

          <Grid size={{ xs: 12, sm: 'grow' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label={tierInfo.label}
                sx={{
                  bgcolor: tierInfo.bg,
                  color: tierInfo.text,
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              />
              <Chip
                label={user.role === 'admin' ? 'Administrator' : 'Verified Traveler'}
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.4)', color: '#E2E8F0', fontSize: '0.75rem' }}
              />
            </Stack>

            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
              {user.email} {user.phone ? `• 📞 ${user.phone}` : ''}
            </Typography>

            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap sx={{ rowGap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase' }}>
                  คะแนนสะสม (Points)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#D4AF37' }}>
                  🪙 {(user.points || 0).toLocaleString()} pt
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase' }}>
                  ยอดการจอง (Bookings)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#38BDF8' }}>
                  🎟️ {user.bookingCount || 0} รายการ
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase' }}>
                  เที่ยวไทย (Provinces)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#10B981' }}>
                  🗺️ {(user.visitedProvinces?.length || 0)} / 77 จว.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 'auto' }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={logout}
              sx={{ borderColor: 'rgba(239, 68, 68, 0.6)', color: '#FCA5A5', '&:hover': { borderColor: '#EF4444' } }}
            >
              ออกจากระบบ
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Main Tabs Navigation */}
      <Paper sx={{ mb: 3, borderRadius: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="profile tabs"
          sx={{ px: 2 }}
        >
          <Tab label="🏆 พาสปอร์ต & แผนที่ท่องเที่ยว 77 จังหวัด" />
          <Tab label="👤 ข้อมูลส่วนตัว & ที่อยู่" />
          <Tab label="💬 ส่งความคิดเห็น / รีวิว" />
          <Tab label="🧭 แพ็กเกจ & เมนูด่วน" />
        </Tabs>
      </Paper>

      {/* Tab 0: Travel Trophy & Thailand Map */}
      {tab === 0 && (
        <TravelTrophyPassport />
      )}

      {/* Tab 1: Profile & Address Form */}
      {tab === 1 && (
        <Card sx={{ borderRadius: 3, p: { xs: 2.5, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            จัดการข้อมูลส่วนตัว
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            อัปเดตข้อมูลการติดต่อและที่อยู่สำหรับการจัดส่งเอกสารและยืนยันการจองแพ็กเกจท่องเที่ยว
          </Typography>

          {saveStatus && (
            <Alert severity={saveStatus.type} sx={{ mb: 3 }}>
              {saveStatus.message}
            </Alert>
          )}

          <form onSubmit={handleProfileSubmit}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="ชื่อจริง (First Name)"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="นามสกุล (Last Name)"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="อีเมล (Email)"
                  value={user.email}
                  disabled
                  helperText="อีเมลผูกกับบัญชีหลัก ไม่สามารถเปลี่ยนได้"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="เบอร์โทรศัพท์ (Phone Number)"
                  placeholder="081-234-5678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  fullWidth
                  label="ลิงก์รูปโปรไฟล์ (Avatar Image URL)"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatarUrl}
                  onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                  helperText="ใส่ URL รูปภาพเพื่อใช้เป็นอวตารของคุณ"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  select
                  label="ภาษาที่ต้องการ (Language)"
                  value={formData.preferredLanguage}
                  onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                >
                  <MenuItem value="th">ภาษาไทย (Thai)</MenuItem>
                  <MenuItem value="en">English (US)</MenuItem>
                </TextField>
              </Grid>

              <Grid size={12}>
                <Divider sx={{ my: 1.5 }}>
                  <Chip label="ที่อยู่จัดส่ง / ติดต่อ (Primary Address)" size="small" />
                </Divider>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="ที่อยู่ (Address Line 1)"
                  placeholder="เช่น 123/45 หมู่บ้านสุขสำราญ ถ.สุขุมวิท"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="เขต / อำเภอ (City/District)"
                  placeholder="คลองเตย"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="จังหวัด (Province)"
                  placeholder="กรุงเทพมหานคร"
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="รหัสไปรษณีย์ (Postal Code)"
                  placeholder="10110"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                />
              </Grid>

              <Grid size={12} sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={saving}
                  sx={{ px: 4, py: 1.2, fontWeight: 700 }}
                >
                  {saving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการเปลี่ยนแปลง (Save Changes)'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}

      {/* Tab 2: Feedback Form */}
      {tab === 2 && (
        <Card sx={{ borderRadius: 3, p: { xs: 2.5, md: 4 }, maxWidth: 720 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            ส่งข้อเสนอแนะและรีวิวการบริการ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            ความคิดเห็นของคุณมีคุณค่าอย่างยิ่งในการพัฒนาประสบการณ์การท่องเที่ยวของ Go Thailand
          </Typography>

          {feedbackStatus && (
            <Alert severity={feedbackStatus.type} sx={{ mb: 3 }}>
              {feedbackStatus.message}
            </Alert>
          )}

          <form onSubmit={handleFeedbackSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  ความพึงพอใจโดยรวม (Rating)
                </Typography>
                <Rating
                  name="feedback-rating"
                  value={feedbackRating}
                  size="large"
                  onChange={(_, val) => setFeedbackRating(val)}
                />
              </Box>

              <TextField
                select
                label="หัวข้อความคิดเห็น (Topic)"
                value={feedbackTopic}
                onChange={(e) => setFeedbackTopic(e.target.value)}
                fullWidth
              >
                <MenuItem value="แพ็กเกจท่องเที่ยว">แพ็กเกจท่องเที่ยว (Tour Packages)</MenuItem>
                <MenuItem value="ที่พักและโรงแรม">ที่พักและโรงแรม (Accommodations)</MenuItem>
                <MenuItem value="ไกด์นำเที่ยว">ไกด์นำเที่ยว (Tour Guides)</MenuItem>
                <MenuItem value="ระบบเว็บไซต์และการชำระเงิน">ระบบเว็บไซต์และการชำระเงิน (Website & Payment)</MenuItem>
                <MenuItem value="อื่นๆ">อื่นๆ (Other)</MenuItem>
              </TextField>

              <TextField
                label="รายละเอียดความคิดเห็น (Comment)"
                placeholder="เล่าประสบการณ์หรือแนะนำสิ่งที่ต้องการให้เราปรับปรุง..."
                multiline
                rows={4}
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={feedbackSubmitting}
                sx={{ alignSelf: 'flex-start', px: 4 }}
              >
                {feedbackSubmitting ? 'กำลังส่งความคิดเห็น...' : 'ส่งความคิดเห็น (Submit Review)'}
              </Button>
            </Stack>
          </form>
        </Card>
      )}

      {/* Tab 3: Quick Links & Summary */}
      {tab === 3 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
            >
              <Box>
                <Typography variant="h1" sx={{ mb: 1 }}>
                  🏝️
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  เลือกชมทัวร์
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  เลือกแพ็กเกจท่องเที่ยวและทัวร์วันเดียวทั่วไทย
                </Typography>
              </Box>
              <Button component={Link} href="/products" variant="contained" color="primary" fullWidth>
                ไปที่หน้าทัวร์
              </Button>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
            >
              <Box>
                <Typography variant="h1" sx={{ mb: 1 }}>
                  🛒
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  ตะกร้าสินค้า
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  จัดการรายการแพ็กเกจที่เลือกไว้และดำเนินการชำระเงิน
                </Typography>
              </Box>
              <Button component={Link} href="/cart" variant="outlined" color="primary" fullWidth>
                ดูตะกร้าของฉัน
              </Button>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
            >
              <Box>
                <Typography variant="h1" sx={{ mb: 1 }}>
                  📊
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  แดชบอร์ดภาพรวม
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ดูสถิติและสถานะการให้บริการทั้งหมดของระบบ
                </Typography>
              </Box>
              <Button component={Link} href="/dashboard" variant="outlined" color="primary" fullWidth>
                เปิดแดชบอร์ด
              </Button>
            </Card>
          </Grid>

          {user.role === 'admin' && (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  height: '100%',
                  bgcolor: 'grey.50',
                  border: '1px dashed #D4AF37',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="h1" sx={{ mb: 1 }}>
                    ⚙️
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    จัดการแพ็กเกจ (Admin)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ฟังก์ชันสร้าง ลบ และแก้ไขแพ็กเกจท่องเที่ยว (CRUD)
                  </Typography>
                </Box>
                <Button component={Link} href="/admin/products" variant="contained" color="secondary" fullWidth>
                  ระบบจัดการสินค้า
                </Button>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </ContainerWrapper>
  );
}
