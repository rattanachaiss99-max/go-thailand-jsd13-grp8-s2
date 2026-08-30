import React from 'react';

export default function ActionButtons({ onViewBooking }) {
  return (
    <div className="flex flex-col sm:flex-row gap-stack-md justify-center w-full max-w-md mx-auto">
      <button
        onClick={onViewBooking}
        className="flex-1 bg-secondary-fixed hover:bg-secondary-container text-on-secondary-fixed font-label-md text-label-md px-6 py-4 rounded-lg transition-colors shadow-sm text-center"
      >
        View My Booking
      </button>
      <button className="flex-1 bg-transparent border border-primary text-primary hover:bg-primary/5 font-label-md text-label-md px-6 py-4 rounded-lg transition-colors text-center">
        Back to Home
      </button>
    </div>
  );
}
