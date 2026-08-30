import React from 'react';
import BookingSuccessHero from '../components/BookingSuccessHero';
import NextStepsBento from '../components/NextStepsBento';
import ActionButtons from '../components/ActionButtons';

// ============================================================================
// BookingSuccessView — เนื้อหาหน้ายืนยันการจอง (ย้ายมาจาก App.jsx เดิม)
// ไม่แก้ logic ของ component ลูก
// ============================================================================

export default function BookingSuccessView({ onViewBooking }) {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh]">
      <BookingSuccessHero carModel="Toyota Fortuner" bookingRef="GT-CR-2026-00128" />
      <NextStepsBento />
      <ActionButtons onViewBooking={onViewBooking} />
    </div>
  );
}
