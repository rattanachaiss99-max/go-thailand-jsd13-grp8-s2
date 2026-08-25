// @next
import { Metadata } from 'next';

// @style
import './globals.css';

// @mui
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

// @project
import ProviderWrapper from './ProviderWrapper';
import { mainMetadata } from '@/metadata';

// @types
import { ChildrenProps } from '@/types/root';

/***************************  METADATA - MAIN  ***************************/

// export const viewport: Viewport = {
//   userScalable: false
// };

export const metadata: Metadata = { ...mainMetadata };

/***************************  LAYOUT - MAIN  ***************************/

// Root layout component that wraps the entire application
export default function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* Preconnect and DNS Prefetch */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ProviderWrapper>{children}</ProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
