import React from 'react';
import Header from './components/Header';
import BookingSuccessHero from './components/BookingSuccessHero';
import NextStepsBento from './components/NextStepsBento';
import ActionButtons from './components/ActionButtons';
import Footer from './components/Footer';

export default function App() {
  return (
    <div class="min-h-screen flex flex-col bg-background text-on-background font-body-md">
      <Header />
      <main class="flex-grow max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg md:py-margin-desktop min-h-[80vh] flex flex-col items-center justify-center">
        <BookingSuccessHero 
          carModel="Toyota Fortuner" 
          bookingRef="GT-CR-2026-00128" 
        />
        <NextStepsBento />
        <ActionButtons />
      </main>
      <Footer />
    </div>
  );
}
