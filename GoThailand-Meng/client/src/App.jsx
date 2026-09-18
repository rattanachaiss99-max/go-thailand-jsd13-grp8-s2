/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { guidesData } from './data/mockData';
import { HeaderNav } from './components/HeaderNav';
import { Footer } from './components/Footer';
import { Page0Home } from './components/Page0Home';
import { Page1GuideList } from './components/Page1GuideList';
import { Page2GuideProfile } from './components/Page2GuideProfile';
import { Page3BookingDetails } from './components/Page3BookingDetails';
import { Page4Checkout } from './components/Page4Checkout';
import { Page5Confirmation } from './components/Page5Confirmation';
import { ContactGuideModal } from './components/ContactGuideModal';
import { ViewBookingModal } from './components/ViewBookingModal';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [guides, setGuides] = useState(guidesData);
  const [selectedGuide, setSelectedGuide] = useState(guidesData[0]); // Niran S.
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Booking details state
  const [bookingState, setBookingState] = useState({
    guideId: guidesData[0].id,
    guide: guidesData[0],
    date: '2026-09-15',
    guests: 2,
    duration: 'Full Day (8 Hours)',
    meetingPoint: 'Siam Kempinski Hotel Lobby',
    specialRequests: '',
    guideFee: 2500,
    serviceFee: 0,
    totalAmount: 2500,
    traveler: {
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'alex.smith@email.com',
      phone: '+1 234 567 8900',
    },
    payment: {
      method: 'card',
      cardNumber: '4242 •••• •••• 4242',
      cardName: 'Alex Smith',
      expiry: '08/28',
      cvv: '888',
      agreedToTerms: true,
    },
    bookingReference: 'GT-GUIDE-150926',
  });

  // Fetch guides from Express/MongoDB API backend
  useEffect(() => {
    async function loadGuidesFromApi() {
      try {
        const res = await fetch('/api/guides');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setGuides(json.data);
            // Default selected guide is Niran
            const niran = json.data.find((g) => g.id === 'narin');
            if (niran) {
              setSelectedGuide(niran);
            }
          }
        }
      } catch (err) {
        // Fallback to initial mock data
        console.warn('Using local dataset as backend API is initializing...');
      }
    }
    loadGuidesFromApi();
  }, []);

  // Update booking state partially
  const handleUpdateBooking = (updates) => {
    setBookingState((prev) => {
      const next = { ...prev, ...updates };
      if (updates.guide) {
        next.guide = updates.guide;
        next.guideId = updates.guide.id;
      }
      return next;
    });
  };

  // Step transition helper
  const navigateToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Triggered when user selects a guide on Page 1 or Home
  const handleSelectGuide = (guide) => {
    setSelectedGuide(guide);
    handleUpdateBooking({
      guide,
      guideId: guide.id,
      guideFee: guide.pricePerDay,
      totalAmount: guide.pricePerDay,
    });
    navigateToStep(2);
  };

  // Submit payment on Page 4 (Calls Express + MongoDB endpoint)
  const handleConfirmPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const payload = {
        guideId: selectedGuide.id,
        guideName: selectedGuide.name,
        date: bookingState.date,
        guests: bookingState.guests,
        duration: bookingState.duration,
        meetingPoint: bookingState.meetingPoint,
        specialRequests: bookingState.specialRequests,
        totalAmount: bookingState.totalAmount,
        traveler: bookingState.traveler,
        paymentMethod: bookingState.payment.method,
        bookingReference: 'GT-GUIDE-150926',
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data?.bookingReference) {
          handleUpdateBooking({ bookingReference: json.data.bookingReference });
        }
      }
    } catch (e) {
      console.warn('Local store used for confirmation');
    } finally {
      setIsProcessingPayment(false);
      navigateToStep(5);
    }
  };

  // Download PDF receipt action
  const handleDownloadReceipt = () => {
    setToastMessage('Downloading official PDF receipt (GT-GUIDE-150926.pdf)...');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      {/* Top Navigation & Step Flow Indicator */}
      <HeaderNav
        currentStep={currentStep}
        onSelectStep={navigateToStep}
        isConfirmedPage={currentStep === 5}
      />

      {/* Main Step Render */}
      <main className="flex-1">
        {currentStep === 0 && (
          <Page0Home
            onNavigateToGuides={() => navigateToStep(1)}
            onSelectGuideFromHome={handleSelectGuide}
            guides={guides}
          />
        )}

        {currentStep === 1 && (
          <Page1GuideList
            guides={guides}
            onSelectGuide={handleSelectGuide}
          />
        )}

        {currentStep === 2 && (
          <Page2GuideProfile
            guide={selectedGuide}
            bookingState={bookingState}
            onUpdateBooking={handleUpdateBooking}
            onProceedToDetails={() => navigateToStep(3)}
            onBackToDirectory={() => navigateToStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Page3BookingDetails
            guide={selectedGuide}
            bookingState={bookingState}
            onUpdateBooking={handleUpdateBooking}
            onProceedToCheckout={() => navigateToStep(4)}
            onBackToProfile={() => navigateToStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Page4Checkout
            guide={selectedGuide}
            bookingState={bookingState}
            onUpdateBooking={handleUpdateBooking}
            onConfirmPayment={handleConfirmPayment}
            onBackToDetails={() => navigateToStep(3)}
            isProcessing={isProcessingPayment}
          />
        )}

        {currentStep === 5 && (
          <Page5Confirmation
            guide={selectedGuide}
            bookingState={bookingState}
            onRestart={() => navigateToStep(1)}
            onOpenContactModal={() => setShowContactModal(true)}
            onOpenBookingModal={() => setShowBookingModal(true)}
            onDownloadReceipt={handleDownloadReceipt}
          />
        )}
      </main>

      {/* Footer (for Steps 1 to 5; Step 0 has its own dedicated footer) */}
      {currentStep !== 0 && <Footer onSelectStep={navigateToStep} />}

      {/* Modals */}
      {showContactModal && (
        <ContactGuideModal
          guide={selectedGuide}
          bookingState={bookingState}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showBookingModal && (
        <ViewBookingModal
          guide={selectedGuide}
          bookingState={bookingState}
          onClose={() => setShowBookingModal(false)}
          onDownloadPdf={handleDownloadReceipt}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1a30] text-white px-5 py-3 rounded-xl shadow-xl border border-stone-700 text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
