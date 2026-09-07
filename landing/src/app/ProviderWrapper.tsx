import { ConfigProvider } from '@/contexts/ConfigContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BookingProvider } from '@/contexts/BookingContext';

// @types
import { ChildrenProps } from '@/types/root';

/***************************  COMMON - CONFIG, THEME  ***************************/

export default function ProviderWrapper({ children }: ChildrenProps) {
  return (
    <LanguageProvider>
      <ConfigProvider>
        <BookingProvider>{children}</BookingProvider>
      </ConfigProvider>
    </LanguageProvider>
  );
}

