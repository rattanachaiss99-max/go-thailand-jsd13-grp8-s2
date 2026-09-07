'use client';

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { properties } from '@/data/properties';

export interface Guests {
  adults: number;
  children: number;
}

export interface BookingState {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: Guests;
  rooms: number;
}

export interface CustomerInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialRequests?: string;
  [key: string]: any;
}

export interface BookingContextType {
  booking: BookingState;
  selectedProperty: any;
  nights: number;
  customer: CustomerInfo | null;
  bookingRef: string | null;
  guestLimits: {
    adults: [number, number];
    children: [number, number];
    rooms: [number, number];
  };
  todayISO: string;
  selectProperty: (propertyId: string) => void;
  updateDates: (patch: Partial<{ checkIn: string; checkOut: string }>) => void;
  changeGuestCount: (field: 'adults' | 'children', delta: number) => void;
  changeRoomCount: (delta: number) => void;
  confirmBooking: (customerInfo: CustomerInfo) => string;
}

const BookingContext = createContext<BookingContextType | null>(null);

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildDefaultBooking(): BookingState {
  const today = new Date();
  const checkOutDate = new Date(today);
  checkOutDate.setDate(checkOutDate.getDate() + 3);
  return {
    propertyId: properties[0]?.id || 'emerald-jungle-retreat',
    checkIn: toISODate(today),
    checkOut: toISODate(checkOutDate),
    guests: { adults: 2, children: 0 },
    rooms: 1
  };
}

const GUEST_LIMITS: { adults: [number, number]; children: [number, number]; rooms: [number, number] } = {
  adults: [1, 10],
  children: [0, 6],
  rooms: [1, 6]
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(buildDefaultBooking);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const selectProperty = (propertyId: string) => {
    setBooking((prev) => ({ ...prev, propertyId }));
  };

  const updateDates = (patch: Partial<{ checkIn: string; checkOut: string }>) => {
    setBooking((prev) => {
      const next = { ...prev, ...patch };
      if (new Date(next.checkOut) <= new Date(next.checkIn)) {
        const forcedCheckOut = new Date(next.checkIn);
        forcedCheckOut.setDate(forcedCheckOut.getDate() + 1);
        next.checkOut = toISODate(forcedCheckOut);
      }
      return next;
    });
  };

  const changeGuestCount = (field: 'adults' | 'children', delta: number) => {
    const [min, max] = GUEST_LIMITS[field];
    setBooking((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [field]: Math.min(max, Math.max(min, prev.guests[field] + delta))
      }
    }));
  };

  const changeRoomCount = (delta: number) => {
    const [min, max] = GUEST_LIMITS.rooms;
    setBooking((prev) => ({
      ...prev,
      rooms: Math.min(max, Math.max(min, prev.rooms + delta))
    }));
  };

  const nights = useMemo(() => {
    const inDate = new Date(booking.checkIn);
    const outDate = new Date(booking.checkOut);
    const diff = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [booking.checkIn, booking.checkOut]);

  const selectedProperty = useMemo(() => {
    return properties.find((p) => p.id === booking.propertyId) || properties[0];
  }, [booking.propertyId]);

  const confirmBooking = (customerInfo: CustomerInfo) => {
    setCustomer(customerInfo);
    const stamp = new Date();
    const y = stamp.getFullYear();
    const m = String(stamp.getMonth() + 1).padStart(2, '0');
    const d = String(stamp.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const ref = `GT${y}${m}${d}${rand}`;
    setBookingRef(ref);
    return ref;
  };

  const value = {
    booking,
    selectedProperty,
    nights,
    customer,
    bookingRef,
    guestLimits: GUEST_LIMITS,
    todayISO: toISODate(new Date()),
    selectProperty,
    updateDates,
    changeGuestCount,
    changeRoomCount,
    confirmBooking
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
