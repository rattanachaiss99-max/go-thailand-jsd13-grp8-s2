import React from 'react';

export default function BookingSuccessHero({ 
  carModel = "Toyota Fortuner", 
  bookingRef = "GT-CR-2026-00128" 
}) {
  return (
    <div class="text-center w-full max-w-2xl mx-auto space-y-stack-md mb-section-gap pt-12">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary-fixed mb-6 shadow-sm shadow-[0px_12px_32px_rgba(0,51,102,0.05)]">
        <span 
          class="material-symbols-outlined text-[48px] text-primary" 
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check
        </span>
      </div>
      <h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Your Car Rental is Confirmed!
      </h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant">
        Your {carModel} rental has been successfully booked.
      </p>
      <div class="inline-block bg-surface-container-low px-6 py-3 rounded-lg border border-outline-variant/30 mt-4">
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
          Booking Reference ID
        </span>
        <span class="font-headline-md text-headline-md text-primary">
          {bookingRef}
        </span>
      </div>
      <p class="font-body-md text-body-md text-on-surface-variant mt-6">
        Thank you for booking with GoThailand. Your booking confirmation has been sent to your email address.
      </p>
    </div>
  );
}
