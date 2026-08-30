import React from 'react';

export default function Header({ currentView, onNavigate }) {
  const navItems = [
    { key: 'booking-success', label: 'Booking' },
    { key: 'dashboard', label: 'My Dashboard' }
  ];

  return (
    <header className="bg-surface-container-lowest shadow-sm shadow-[0px_12px_32px_rgba(0,51,102,0.05)] w-full top-0 z-50 transition-all">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 max-w-[1280px] mx-auto">
        <button
          onClick={() => onNavigate?.('booking-success')}
          className="font-headline-lg text-headline-lg text-primary tracking-tight"
        >
          GoThailand
        </button>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate?.(item.key)}
              aria-current={currentView === item.key ? 'page' : undefined}
              className={`font-label-md text-label-md transition-colors ${
                currentView === item.key
                  ? 'text-primary border-b-2 border-secondary-fixed-dim pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => onNavigate?.('dashboard')}
          className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-container transition-colors shadow-sm"
        >
          My Dashboard
        </button>
      </div>
    </header>
  );
}
