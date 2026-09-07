'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import CheckoutSection from './CheckoutSection';
import FormField, { inputStyle } from './FormField';

export interface PaymentFormValues {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

interface PaymentPanelProps {
  paymentMethod: 'card' | 'promptpay' | 'bank';
  setPaymentMethod: (method: 'card' | 'promptpay' | 'bank') => void;
  form: PaymentFormValues;
  onChange: (field: keyof PaymentFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalAmount?: number;
}

const METHODS = [
  { id: 'card' as const, label: 'Credit / Debit Card', icon: '💳' },
  { id: 'promptpay' as const, label: 'PromptPay QR', icon: '📱' },
  { id: 'bank' as const, label: 'Bank Transfer', icon: '🏦' }
];

export default function PaymentPanel({
  paymentMethod,
  setPaymentMethod,
  form,
  onChange,
  totalAmount = 0
}: PaymentPanelProps) {
  return (
    <CheckoutSection title="Payment Method / ช่องทางชำระเงิน" icon="💳">
      {/* 3 Payment Methods Selector */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {METHODS.map((method) => {
          const selected = paymentMethod === method.id;
          return (
            <Grid key={method.id} size={{ xs: 12, sm: 4 }}>
              <ButtonBase
                onClick={() => setPaymentMethod(method.id)}
                sx={{
                  width: '100%',
                  p: 2,
                  borderRadius: 2.5,
                  border: '2px solid',
                  borderColor: selected ? 'primary.main' : 'divider',
                  bgcolor: selected ? 'primary.lighter' : 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  fontWeight: selected ? 700 : 500,
                  color: selected ? 'primary.dark' : 'text.secondary',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: selected ? 'primary.lighter' : 'grey.50'
                  }
                }}
              >
                <Box component="span" sx={{ fontSize: '1.25rem' }}>{method.icon}</Box>
                <Typography variant="body2" sx={{ fontWeight: 'inherit', color: 'inherit' }}>
                  {method.label}
                </Typography>
              </ButtonBase>
            </Grid>
          );
        })}
      </Grid>

      {/* Credit / Debit Card Form */}
      {paymentMethod === 'card' && (
        <Box sx={{ mt: 1 }}>
          <FormField label="Name on Card / ชื่อผู้ถือบัตร" id="cardName">
            <input
              id="cardName"
              placeholder="e.g. SOMCHAI JAIDEE"
              value={form.cardName}
              onChange={onChange('cardName')}
              style={inputStyle}
              autoComplete="cc-name"
            />
          </FormField>

          <FormField label="Card Number / หมายเลขบัตรเครดิต" id="cardNumber">
            <input
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
              value={form.cardNumber}
              onChange={onChange('cardNumber')}
              style={inputStyle}
              inputMode="numeric"
              maxLength={19}
              autoComplete="cc-number"
            />
          </FormField>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <FormField label="Expiry Date / วันหมดอายุ" id="expiryDate">
                <input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={form.expiryDate}
                  onChange={onChange('expiryDate')}
                  style={inputStyle}
                  maxLength={5}
                  autoComplete="cc-exp"
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormField label="CVV / CVC" id="cvv">
                <input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  value={form.cvv}
                  onChange={onChange('cvv')}
                  style={inputStyle}
                  maxLength={4}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                />
              </FormField>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
            <input
              type="checkbox"
              id="saveCard"
              checked={form.saveCard}
              onChange={onChange('saveCard')}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <Typography component="label" htmlFor="saveCard" variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
              บันทึกข้อมูลบัตรไว้สำหรับการจองครั้งต่อไป (Save card for future bookings)
            </Typography>
          </Box>
        </Box>
      )}

      {/* PromptPay QR Code Notice */}
      {paymentMethod === 'promptpay' && (
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'primary.main',
            bgcolor: 'primary.lighter',
            textAlign: 'center'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.dark', mb: 1 }}>
            📱 ชำระเงินผ่าน PromptPay QR Code
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 460, mx: 'auto', mb: 2 }}>
            เมื่อกดปุ่ม "ยืนยันและชำระเงิน" ระบบจะสร้าง QR Code พร้อมยอดเงิน ฿{totalAmount.toLocaleString()} THB เพื่อให้ท่านสแกนผ่านแอปธนาคารใดก็ได้ทันที
          </Typography>
          <Box
            sx={{
              display: 'inline-block',
              p: 2,
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              PROMPTPAY READY
            </Typography>
            <Box sx={{ fontSize: '3rem', lineHeight: 1 }}>📲</Box>
          </Box>
        </Box>
      )}

      {/* Bank Transfer Notice */}
      {paymentMethod === 'bank' && (
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
            🏦 ข้อมูลการโอนเงินผ่านบัญชีธนาคาร (Bank Transfer)
          </Typography>
          <Box sx={{ fontSize: '0.88rem', color: 'text.secondary', lineHeight: 1.8 }}>
            <Box>• <strong>ธนาคารกสิกรไทย (KBANK):</strong> 012-3-45678-9 (บจก. โก ไทยแลนด์ เทรเวล)</Box>
            <Box>• <strong>ธนาคารไทยพาณิชย์ (SCB):</strong> 987-6-54321-0 (บจก. โก ไทยแลนด์ เทรเวล)</Box>
            <Box sx={{ mt: 1, color: 'text.disabled', fontSize: '0.8rem' }}>
              * หลังจากยืนยันคำสั่งจองแล้ว กรุณาอัปโหลดสลิปหรือแจ้งหลักฐานการโอนเงินภายใน 2 ชั่วโมง
            </Box>
          </Box>
        </Box>
      )}
    </CheckoutSection>
  );
}
