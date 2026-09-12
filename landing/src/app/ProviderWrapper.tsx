'use client';

import { ConfigProvider } from '@/contexts/ConfigContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BookingProvider } from '@/contexts/BookingContext';
import { UserProvider } from '@/contexts/UserContext';
import { CartProvider } from '@/contexts/CartContext';

// @types
import { ChildrenProps } from '@/types/root';

/***************************  COMMON - CONFIG, THEME  ***************************/

export default function ProviderWrapper({ children }: ChildrenProps) {
  return (
    <LanguageProvider>
      <ConfigProvider>
        <UserProvider>
          <BookingProvider>
            <CartProvider>{children}</CartProvider>
          </BookingProvider>
        </UserProvider>
      </ConfigProvider>
    </LanguageProvider>
  );
}
