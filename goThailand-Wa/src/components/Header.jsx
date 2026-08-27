import React from 'react';

export default function Header() {
  return (
    <header class="bg-surface-container-lowest shadow-sm shadow-[0px_12px_32px_rgba(0,51,102,0.05)] w-full top-0 z-50 transition-all">
      <div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 max-w-[1280px] mx-auto">
        <a class="font-headline-lg text-headline-lg text-primary tracking-tight" href="#">
          GoThailand
        </a>
        <div class="hidden md:flex items-center gap-6">
          {/* Suppressed nav links per transactional shell rule */}
        </div>
        <button class="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-container transition-colors shadow-sm">
          Return Home
        </button>
      </div>
    </header>
  );
}
