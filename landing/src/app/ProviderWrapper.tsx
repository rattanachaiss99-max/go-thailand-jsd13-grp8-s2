'use client';

import { ConfigProvider } from '@/contexts/ConfigContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BookingProvider } from '@/contexts/BookingContext';
import { UserProvider } from '@/contexts/UserContext';

// @types
import { ChildrenProps } from '@/types/root';

/***************************  COMMON - CONFIG, THEME  ***************************/

export default function ProviderWrapper({ children }: ChildrenProps) {
  return (
    <LanguageProvider>
      <ConfigProvider>
        <UserProvider>
          <BookingProvider>{children}</BookingProvider>
        </UserProvider>
      </ConfigProvider>
    </LanguageProvider>
  );
}
