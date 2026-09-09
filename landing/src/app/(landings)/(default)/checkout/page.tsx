'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ContainerWrapper from '@/components/ContainerWrapper';
import CheckoutSection from '@/components/checkout/CheckoutSection';
import FormField, { inputStyle } from '@/components/checkout/FormField';
import PaymentPanel, { PaymentFormValues } from '@/components/checkout/PaymentPanel';
import BookingSummary from '@/components/checkout/BookingSummary';
import { useBooking } from '@/contexts/BookingContext';
import { useUser } from '@/contexts/UserContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const { confirmBooking, selectedProperty, nights } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'promptpay' | 'bank'>('card');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Traveler & Driver form
  const [travelerForm, setTravelerForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Thailand',
    specialRequests: '',
    driverName: '',
    licenseNumber: '',
    driverAge: '30',
    sameAsTraveler: true,
    agreeTerms: false
  });

  // Payment card form
  const [cardForm, setCardForm] = useState<PaymentFormValues>({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });

  // Auto-fill from logged in user if available
  useEffect(() => {
    if (user) {
      setTravelerForm((prev) => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: prev.phone || '081-234-5678',
        driverName: prev.driverName || `${user.firstName} ${user.lastName}`
      }));
      setCardForm((prev) => ({
        ...prev,
        cardName: prev.cardName || `${user.firstName} ${user.lastName}`.toUpperCase()
      }));
    }
  }, [user]);

  const handleTravelerChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setTravelerForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleCardChange = (field: keyof PaymentFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCardForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleConfirm = async () => {
    if (!travelerForm.fullName.trim() || !travelerForm.email.trim()) {
      setError('กรุณากรอกชื่อ-นามสกุล และอีเมลของผู้เดินทางให้ครบถ้วน');
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    if (!travelerForm.agreeTerms) {
      setError('กรุณากดยอมรับข้อกำหนดและเงื่อนไขการให้บริการ (Terms & Conditions)');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardForm.cardNumber.trim() || !cardForm.expiryDate.trim() || !cardForm.cvv.trim()) {
        setError('กรุณากรอกข้อมูลบัตรเครดิต/เดบิตให้ครบถ้วน');
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      const ref = confirmBooking({
        fullName: travelerForm.fullName,
        email: travelerForm.email,
        phone: travelerForm.phone,
        specialRequests: travelerForm.specialRequests
      });

      // Redirect to booking-success page with ref parameter
      router.push(`/booking-success?ref=${ref}`);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการยืนยันคำสั่งจอง');
      setSubmitting(false);
    }
  };

  const subtotal = (selectedProperty?.pricePerNight ?? 5000) * nights;
  const total = subtotal + Math.round(subtotal * 0.07);

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <ContainerWrapper>
        {/* Stepper & Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            หน้าแรก &gt; ที่พัก &gt; การจอง &gt; <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>ชำระเงิน (Checkout)</Box>
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: 'text.primary' }}>
            Checkout / ยืนยันการจอง
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4} alignItems="flex-start">
          {/* Left Column: Forms */}
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            {/* 1. Traveler Information */}
            <CheckoutSection title="1. Traveler Information / ข้อมูลผู้ติดต่อ" icon="👤">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField label="Full Name / ชื่อ-นามสกุล *" id="fullName">
                    <input
                      id="fullName"
                      placeholder="e.g. สมชาย ใจดี"
                      value={travelerForm.fullName}
                      onChange={handleTravelerChange('fullName')}
                      style={inputStyle}
                      autoComplete="name"
                      required
                    />
                  </FormField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField label="Email / อีเมลติดต่อ *" id="email">
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. somchai@example.com"
                      value={travelerForm.email}
                      onChange={handleTravelerChange('email')}
                      style={inputStyle}
                      autoComplete="email"
                      required
                    />
                  </FormField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField label="Phone Number / เบอร์โทรศัพท์" id="phone">
                    <input
                      id="phone"
                      placeholder="e.g. 081-234-5678"
                      value={travelerForm.phone}
                      onChange={handleTravelerChange('phone')}
                      style={inputStyle}
                      autoComplete="tel"
                    />
                  </FormField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField label="Country / ประเทศ" id="country">
                    <select
                      id="country"
                      value={travelerForm.country}
                      onChange={handleTravelerChange('country')}
                      style={inputStyle}
                    >
                      <option value="Thailand">Thailand (ประเทศไทย)</option>
                      <option value="United States">United States</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Japan">Japan</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormField label="Special Requests / คำขอพิเศษเพิ่มเติม (ถ้ามี)" id="requests">
                    <input
                      id="requests"
                      placeholder="e.g. ขอห้องชั้นสูง, เช็คอินช่วงบ่าย, เตียงเดี่ยว"
                      value={travelerForm.specialRequests}
                      onChange={handleTravelerChange('specialRequests')}
                      style={inputStyle}
                    />
                  </FormField>
                </Grid>
              </Grid>
            </CheckoutSection>

            {/* 2. Payment Method Panel */}
            <PaymentPanel
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              form={cardForm}
              onChange={handleCardChange}
              totalAmount={total}
            />

            {/* 3. Terms & Confirmation Agreement */}
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                mb: 4
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={travelerForm.agreeTerms}
                  onChange={handleTravelerChange('agreeTerms')}
                  style={{ width: 18, height: 18, marginTop: 3, cursor: 'pointer' }}
                />
                <Typography component="label" htmlFor="agreeTerms" variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', lineHeight: 1.6 }}>
                  ฉันได้อ่านและยอมรับ <Box component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>ข้อกำหนดการให้บริการ (Terms of Service)</Box>, <Box component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>นโยบายความเป็นส่วนตัว</Box> และเงื่อนไขการยกเลิกการจองของ Go Thailand
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Sticky Summary */}
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <BookingSummary
              onConfirm={handleConfirm}
              submitting={submitting}
              onBack={() => router.back()}
            />
          </Grid>
        </Grid>
      </ContainerWrapper>
    </Box>
  );
}
