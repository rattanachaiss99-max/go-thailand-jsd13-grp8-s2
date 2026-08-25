import { ConfigProvider } from '@/contexts/ConfigContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// @types
import { ChildrenProps } from '@/types/root';

/***************************  COMMON - CONFIG, THEME  ***************************/

export default function ProviderWrapper({ children }: ChildrenProps) {
  return (
    <LanguageProvider>
      <ConfigProvider>{children}</ConfigProvider>
    </LanguageProvider>
  );
}
