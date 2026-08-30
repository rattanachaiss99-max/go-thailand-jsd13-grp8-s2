import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingSuccessView from './views/BookingSuccessView';
import DashboardView from './views/DashboardView';

// ============================================================================
// App — สลับ view ด้วย state `currentView` (ยังไม่ใช้ React Router)
// 'booking-success' | 'dashboard'
// ============================================================================

const VIEWS = ['booking-success', 'dashboard'];

/** อ่าน view จาก URL hash เพื่อให้ refresh/แชร์ลิงก์ไม่หลุดหน้า */
const viewFromHash = () => {
  const v = window.location.hash.replace('#', '');
  return VIEWS.includes(v) ? v : 'booking-success';
};

export default function App() {
  const [currentView, setCurrentView] = useState(viewFromHash);

  useEffect(() => {
    const onHashChange = () => setCurrentView(viewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (view) => {
    setCurrentView(view);
    window.location.hash = view;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md">
      <Header currentView={currentView} onNavigate={navigate} />

      <main className="flex-grow max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg md:py-margin-desktop flex flex-col">
        {currentView === 'booking-success' && (
          <BookingSuccessView onViewBooking={() => navigate('dashboard')} />
        )}
        {currentView === 'dashboard' && <DashboardView />}
      </main>

      <Footer />
    </div>
  );
}
