'use client';

import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { BookingRecord, RawCarBooking } from '@/data/crm/mockData';

interface BookingListProps {
  bookings: BookingRecord[];
  filterCategory?: 'all' | 'car' | 'hotel' | 'guide';
}

const CATEGORY_LABEL: Record<string, { label: string; icon: string }> = {
  car: { label: 'เช่ารถ', icon: '🚗' },
  hotel: { label: 'ที่พัก', icon: '🏨' },
  guide: { label: 'ไกด์นำเที่ยว', icon: '🧭' }
};

const STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'default' | 'error' }> = {
  confirmed: { label: 'ยืนยันแล้ว', color: 'success' },
  completed: { label: 'เสร็จสิ้น', color: 'default' },
  cancelled: { label: 'ยกเลิกแล้ว', color: 'error' },
  pending: { label: 'รอดำเนินการ', color: 'default' }
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  card: 'บัตรเครดิต / เดบิต (Credit/Debit Card)',
  promptpay: 'พร้อมเพย์ QR Code (PromptPay)',
  bank: 'โอนเงินผ่านธนาคาร (Bank Transfer)'
};

function formatDate(isoString: string) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return isoString;
  }
}

/**
 * ข้อมูลตัวอย่างสำหรับใช้แสดงโครงสร้างการจัดวางฟิลด์ (Preview Card Template)
 */
const SCHEMA_PREVIEW_BOOKING: BookingRecord = {
  _id: 'preview-schema-sample-01',
  bookingReference: 'GT-CR-2026-00128',
  userId: 'preview-user',
  bookingStatus: 'confirmed',
  paymentStatus: 'paid',
  item: {
    category: 'car',
    title: 'Toyota Fortuner (ฟิลด์: carName)',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    pickupLocation: 'สนามบินสุวรรณภูมิ (BKK), กรุงเทพฯ (ฟิลด์: pickupReturn)',
    dropoffLocation: 'สนามบินสุวรรณภูมิ (BKK), กรุงเทพฯ (ฟิลด์: pickupReturn)',
    pickupDate: new Date().toISOString(),
    returnDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    pricePerDay: 2500,
    totalDays: 3
  },
  pricing: {
    subtotal: 7500,
    tax: 0,
    discount: 0,
    totalAmount: 7500,
    currency: 'THB'
  },
  customerInfo: {
    fullName: 'John Doe (ฟิลด์: fullName)',
    email: 'john@example.com (ฟิลด์: email)',
    phone: '+1 234 567 890 (ฟิลด์: phone)'
  },
  rawCarBooking: {
    carName: 'Toyota Fortuner (ฟิลด์: carName)',
    carImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    carDetails: 'SUV · 7 Seats · Diesel (ฟิลด์: carDetails)',
    carRating: '4.9 (ฟิลด์: carRating)',
    pickupReturn: 'สนามบินสุวรรณภูมิ (BKK), กรุงเทพฯ (ฟิลด์: pickupReturn)',
    dates: 'Oct 15, 10:00 AM - Oct 18, 10:00 AM (3 Days) (ฟิลด์: dates)',
    rentalPrice: 7500,
    serviceFee: 0,
    totalPrice: 7500,
    fullName: 'John Doe (ฟิลด์: fullName)',
    email: 'john@example.com (ฟิลด์: email)',
    phone: '+1 234 567 890 (ฟิลด์: phone)',
    country: 'United States (ฟิลด์: country)',
    driverName: 'John Doe (ฟิลด์: driverName)',
    licenseNumber: 'DL-12345678 (ฟิลด์: licenseNumber)',
    licenseCountry: 'United States (ฟิลด์: licenseCountry)',
    driverAge: '35 (ฟิลด์: driverAge)',
    paymentMethod: 'card',
    cardName: 'John Doe (ฟิลด์: cardName)',
    cardNumber: '**** **** **** 0000 (ฟิลด์: cardNumber)',
    termsAccepted: true,
    status: 'confirmed'
  }
};

/**
 * คอมโพเนนต์แสดงผลรายละเอียดการจองรถเช่าครบทุกฟิลด์ตาม Guitar bookingSchema
 */
function CarBookingDetailCard({ booking, isPreview = false }: { booking: BookingRecord; isPreview?: boolean }) {
  const raw: RawCarBooking = booking.rawCarBooking || {};
  const status = STATUS_CONFIG[booking.bookingStatus] || { label: booking.bookingStatus, color: 'default' };

  // ค่าฟิลด์จาก Schema
  const carName = raw.carName || booking.item.title;
  const carImage = raw.carImage || booking.item.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600';
  const carDetails = raw.carDetails || 'SUV · 7 Seats · Diesel';
  const carRating = raw.carRating || '4.9';
  const pickupReturn = raw.pickupReturn || booking.item.pickupLocation || 'สนามบินสุวรรณภูมิ (BKK), กรุงเทพฯ';
  const dates = raw.dates || `${formatDate(booking.item.pickupDate)} — ${formatDate(booking.item.returnDate)} (${booking.item.totalDays} วัน)`;
  const rentalPrice = raw.rentalPrice ?? booking.pricing.subtotal;
  const serviceFee = raw.serviceFee ?? 0;
  const totalPrice = raw.totalPrice ?? booking.pricing.totalAmount;

  const travelerName = raw.fullName || booking.customerInfo.fullName || '-';
  const travelerEmail = raw.email || booking.customerInfo.email || '-';
  const travelerPhone = raw.phone || booking.customerInfo.phone || '-';
  const travelerCountry = raw.country || 'Thailand';

  const driverName = raw.driverName || travelerName;
  const driverAge = raw.driverAge || '35';
  const licenseNumber = raw.licenseNumber || 'DL-12345678';
  const licenseCountry = raw.licenseCountry || travelerCountry;

  const paymentMethod = raw.paymentMethod || 'card';
  const cardName = raw.cardName || travelerName;
  const cardNumber = raw.cardNumber || raw.maskedCardNumber || '**** **** **** 0000';
  const termsAccepted = raw.termsAccepted ?? true;

  return (
    <Card
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: isPreview ? 'warning.main' : 'primary.light',
        boxShadow: '0 4px 20px rgba(8, 35, 64, 0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 6px 24px rgba(8, 35, 64, 0.1)'
        }
      }}
    >
      {/* Header Bar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap>
          <Chip
            label="🚗 เช่ารถยนต์ (Car Rental)"
            size="small"
            sx={{ fontWeight: 700, bgcolor: '#082340', color: '#fff' }}
          />
          {isPreview && (
            <Chip
              label="👁️ ตัวอย่างการจัดวางฟิลด์ (Schema Preview)"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          )}
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.85rem' }}>
            REF: {booking.bookingReference}
          </Typography>
        </Stack>
        <Chip
          label={status.label}
          color={status.color}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      </Stack>

      {/* Section 1: ข้อมูลรถยนต์ & ทริป (Car & Trip) */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2.5} alignItems="center">
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Box
              component="img"
              src={carImage}
              alt={carName}
              sx={{
                width: '100%',
                height: { xs: 180, sm: 130 },
                objectFit: 'cover',
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider'
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.8 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {carName}
              </Typography>
              <Chip
                label={`⭐ ${carRating}`}
                size="small"
                sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 700 }}
              />
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 1.5 }}>
              ⚙️ {carDetails}
            </Typography>
            <Stack spacing={0.8} sx={{ fontSize: '0.88rem', color: 'text.secondary' }}>
              <Box>
                📍 <strong>จุดรับและคืนรถ (Pickup & Return):</strong> {pickupReturn}
              </Box>
              <Box>
                📅 <strong>ช่วงเวลาเดินทาง (Dates):</strong> {dates}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Section 2: ผู้เดินทาง & คนขับรถ (Traveler & Driver) */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {/* ข้อมูลผู้เดินทาง */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#082340' }}>
              👤 ข้อมูลผู้เดินทาง (Traveler Info)
            </Typography>
            <Stack spacing={0.6} sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
              <Box><strong>ชื่อ-นามสกุล:</strong> {travelerName}</Box>
              <Box><strong>อีเมล:</strong> {travelerEmail}</Box>
              <Box><strong>เบอร์โทร:</strong> {travelerPhone}</Box>
              <Box><strong>สัญชาติ/ประเทศ:</strong> {travelerCountry}</Box>
            </Stack>
          </Box>
        </Grid>

        {/* ข้อมูลคนขับ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#082340' }}>
              🪪 ข้อมูลคนขับรถ (Driver Info)
            </Typography>
            <Stack spacing={0.6} sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
              <Box><strong>ชื่อผู้ขับขี่:</strong> {driverName}</Box>
              <Box><strong>หมายเลขใบขับขี่:</strong> {licenseNumber}</Box>
              <Box><strong>ประเทศที่ออกใบอนุญาต:</strong> {licenseCountry}</Box>
              <Box><strong>อายุผู้ขับขี่:</strong> {driverAge} ปี</Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Section 3: ข้อมูลการชำระเงิน (Payment & Billing) */}
      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#082340' }}>
          💳 ข้อมูลการชำระเงิน (Payment & Billing)
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={0.6} sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
              <Box><strong>วิธีชำระเงิน:</strong> {PAYMENT_METHOD_LABEL[paymentMethod] || paymentMethod}</Box>
              {paymentMethod === 'card' && (
                <>
                  <Box><strong>ชื่อบนบัตร:</strong> {cardName}</Box>
                  <Box><strong>หมายเลขบัตร:</strong> {cardNumber}</Box>
                </>
              )}
              <Box>
                <strong>เงื่อนไขการเช่า:</strong> {termsAccepted ? '✅ ยอมรับเงื่อนไขแล้ว (Terms Accepted)' : '❌ ยังไม่ยอมรับ'}
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={0.6} sx={{ fontSize: '0.85rem', textAlign: { sm: 'right' } }}>
              <Box sx={{ color: 'text.secondary' }}>ค่าเช่ารถ (Rental Price): ฿{rentalPrice.toLocaleString()}</Box>
              <Box sx={{ color: 'text.secondary' }}>ค่าธรรมเนียมบริการ (Service Fee): ฿{serviceFee.toLocaleString()}</Box>
              <Box sx={{ mt: 1, pt: 0.8, borderTop: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main' }}>
                  ยอดชำระสุทธิ: ฿{totalPrice.toLocaleString()} THB
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

/**
 * คอมโพเนนต์แสดงรายการฟิลด์ Schema ทั้งหมด เพื่อแจ้งผู้ใช้ว่าระบบพร้อมรับฟิลด์อะไรบ้าง
 */
function CarSchemaFieldDirectory() {
  const [showTemplate, setShowTemplate] = useState(false);

  return (
    <Stack spacing={3} sx={{ mt: 3, textAlign: 'left' }}>
      {/* Schema Specification Bento */}
      <Card
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 3,
          bgcolor: '#f8fafc',
          border: '1px solid',
          borderColor: 'primary.light',
          boxShadow: '0 4px 14px rgba(8, 35, 64, 0.05)'
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#082340' }}>
            📌 โครงสร้างฟิลด์ข้อมูลการเช่ารถที่ระบบพร้อมรองรับ (Schema Fields Guide)
          </Typography>
          <Chip label="22 Fields Supported" size="small" color="primary" sx={{ fontWeight: 700 }} />
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          ระบบแดชบอร์ดของ Landing ถูกเตรียมความพร้อมในการแมปข้อมูลตามโมเดลรถเช่า (Guitar & Render Web Service) ครบถ้วนทุกฟิลด์ โดยแบ่งเป็น 4 กลุ่มฟิลด์หลักดังนี้:
        </Typography>

        <Grid container spacing={2}>
          {/* หมวด 1 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#082340', mb: 1 }}>
                🚗 1. ข้อมูลรถยนต์ & ทริป (Car & Trip)
              </Typography>
              <Stack spacing={0.6} sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                <Box><code>carName</code> : ชื่อรุ่นรถยนต์ (เช่น Toyota Fortuner)</Box>
                <Box><code>carImage</code> : URL รูปภาพพาหนะ</Box>
                <Box><code>carDetails</code> : สเปก/ที่นั่ง (เช่น SUV · 7 Seats · Diesel)</Box>
                <Box><code>carRating</code> : คะแนนรีวิว (เช่น 4.9)</Box>
                <Box><code>pickupReturn</code> : จุดรับ-ส่งคืนรถ (สนามบินสุวรรณภูมิ ฯลฯ)</Box>
                <Box><code>dates</code> : วันที่และระยะเวลาเช่า</Box>
                <Box><code>rentalPrice</code> / <code>serviceFee</code> / <code>totalPrice</code> : ราคาและยอดรวม</Box>
              </Stack>
            </Box>
          </Grid>

          {/* หมวด 2 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#082340', mb: 1 }}>
                👤 2. ข้อมูลผู้เดินทาง (Traveler Info)
              </Typography>
              <Stack spacing={0.6} sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                <Box><code>fullName</code> : ชื่อ-นามสกุล ผู้เดินทาง</Box>
                <Box><code>email</code> : อีเมลติดต่อสำหรับส่งใบเสร็จ</Box>
                <Box><code>phone</code> : เบอร์โทรศัพท์สำหรับติดต่อ</Box>
                <Box><code>country</code> : สัญชาติ / ประเทศต้นทาง</Box>
              </Stack>
            </Box>
          </Grid>

          {/* หมวด 3 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#082340', mb: 1 }}>
                🪪 3. ข้อมูลคนขับรถ (Driver Info)
              </Typography>
              <Stack spacing={0.6} sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                <Box><code>driverName</code> : ชื่อผู้ขับขี่ที่ได้รับอนุญาต</Box>
                <Box><code>licenseNumber</code> : หมายเลขใบอนุญาตขับขี่</Box>
                <Box><code>licenseCountry</code> : ประเทศที่ออกใบอนุญาต</Box>
                <Box><code>driverAge</code> : อายุของผู้ขับขี่</Box>
              </Stack>
            </Box>
          </Grid>

          {/* หมวด 4 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#082340', mb: 1 }}>
                💳 4. การชำระเงิน & เงื่อนไข (Payment & Billing)
              </Typography>
              <Stack spacing={0.6} sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                <Box><code>paymentMethod</code> : วิธีชำระเงิน (card / promptpay / bank)</Box>
                <Box><code>cardName</code> / <code>cardNumber</code> : ข้อมูลบัตรเครดิต (Masked ปลอดภัย)</Box>
                <Box><code>termsAccepted</code> : การยอมรับเงื่อนไขการเช่ารถ</Box>
                <Box><code>status</code> : สถานะคำสั่งจอง (confirmed / cancelled)</Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Action Toggle Preview */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setShowTemplate((prev) => !prev)}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            {showTemplate ? '▲ ซ่อนตัวอย่างการจัดวางฟิลด์ (Hide Template Preview)' : '👁️ แสดงตัวอย่างการจัดวางฟิลด์บนหน้าจอ (Show Template Preview)'}
          </Button>
        </Box>
      </Card>

      {/* Collapse Card Preview */}
      <Collapse in={showTemplate}>
        <Box sx={{ mb: 2 }}>
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontWeight: 500 }}>
            ด้านล่างนี้คือตัวอย่างหน้าตาการ์ดที่จะแสดงผลจริง เมื่อ Endpoint บน Render ส่งข้อมูลการจองรถเข้ามาในระบบ:
          </Alert>
          <CarBookingDetailCard booking={SCHEMA_PREVIEW_BOOKING} isPreview={true} />
        </Box>
      </Collapse>
    </Stack>
  );
}

export default function BookingList({ bookings, filterCategory = 'all' }: BookingListProps) {
  const items = filterCategory === 'all'
    ? bookings
    : bookings.filter((b) => b.item.category === filterCategory);

  if (items.length === 0) {
    const emptyTitle =
      filterCategory === 'car'
        ? 'ไม่มีข้อมูลรถเช่า'
        : filterCategory === 'hotel'
        ? 'ไม่มีข้อมูลการจองที่พัก'
        : filterCategory === 'guide'
        ? 'ไม่มีข้อมูลการจองไกด์นำเที่ยว'
        : 'ยังไม่มีรายการจองในระบบ';

    const emptyDesc =
      filterCategory === 'car'
        ? 'ยังไม่พบรายการจองรถเช่าในระบบของคุณ (ระบบพร้อมเชื่อมต่อกับ Render Endpoint)'
        : 'ยังไม่มีรายการจองในหมวดหมู่นี้';

    const emptyIcon =
      filterCategory === 'car'
        ? '🚗'
        : filterCategory === 'hotel'
        ? '🏨'
        : filterCategory === 'guide'
        ? '🧭'
        : '📋';

    return (
      <Box>
        <Card
          sx={{
            py: 5,
            px: 3,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            {emptyIcon}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
            {emptyTitle}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {emptyDesc}
          </Typography>
        </Card>

        {/* หากเป็นหมวดรถเช่าและไม่มีข้อมูล ให้แสดง Schema Guide บอกผู้ใช้ว่ามีฟิลด์อะไรบ้าง พร้อมปุ่ม Preview */}
        {filterCategory === 'car' && <CarSchemaFieldDirectory />}
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      {items.map((booking) => {
        // หากเป็นหมวดรถเช่า ให้แสดงผลแบบเต็มทุกฟิลด์ตาม Guitar bookingSchema
        if (booking.item.category === 'car') {
          return <CarBookingDetailCard key={booking._id} booking={booking} />;
        }

        const cat = CATEGORY_LABEL[booking.item.category] || { label: 'บริการ', icon: '✈️' };
        const status = STATUS_CONFIG[booking.bookingStatus] || { label: booking.bookingStatus, color: 'default' };

        return (
          <Card
            key={booking._id}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 10px rgba(8, 35, 64, 0.04)',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: '0 4px 16px rgba(8, 35, 64, 0.08)'
              }
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Chip
                  label={`${cat.icon} ${cat.label}`}
                  size="small"
                  sx={{ fontWeight: 700, bgcolor: 'primary.lighter', color: 'primary.darker' }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontFamily: 'monospace' }}>
                  REF: {booking.bookingReference}
                </Typography>
              </Stack>
              <Chip
                label={status.label}
                color={status.color}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, alignSelf: { xs: 'flex-start', sm: 'center' } }}
              />
            </Stack>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              {booking.item.title}
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} sx={{ mb: 2, color: 'text.secondary', fontSize: '0.88rem' }}>
              <Box>
                📍 จุดรับ/สถานที่: <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>{booking.item.pickupLocation}</Box>
              </Box>
              <Box>
                📅 วันที่: <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  {formatDate(booking.item.pickupDate)} — {formatDate(booking.item.returnDate)} ({booking.item.totalDays} วัน)
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                ชำระแล้ว (รวมภาษี 7%)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'var(--font-serif)' }}>
                ฿{booking.pricing.totalAmount.toLocaleString()} {booking.pricing.currency}
              </Typography>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}
