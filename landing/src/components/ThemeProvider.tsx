'use client';

import { Suspense, useEffect, useState } from 'react';

// @mui
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { Theme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// @project
import Loader from './Loader';
import RTLLayout from '@/components/RTLLayout';
import { DEFAULT_THEME_MODE, Themes } from '@/config';
import useConfig from '@/hooks/useConfig';

import defaultTheme from '@/views/landings/default/theme';

// TODO(JSD13): เพิ่ม travelTheme เมื่อสร้างธีมท่องเที่ยวใน Wave 1 (S2-07)
// import travelTheme from '@/views/landings/travel/theme';

// @types
import { ChildrenProps } from '@/types/root';

const modeStorageKey = 'theme-mode';

// Theme Map
const themeMap: Record<Themes, (selector: string) => Theme> = {
  [Themes.THEME_DEFAULT]: defaultTheme
  // [Themes.THEME_TRAVEL]: travelTheme
};

/***************************  COMMON - THEME PROVIDER  ***************************/

export default function ThemeProviders({ children }: ChildrenProps) {
  const { state } = useConfig();

  const [loader, setLoader] = useState<boolean>(true);

  const selectedTheme = themeMap[state.currentTheme]?.('data-color-scheme') || defaultTheme();

  useEffect(() => {
    setLoader(false);
  }, []);

  /**
   * A loader is needed here to initialize the configuration from localStorage and set the default theme.
   * Without a loader,
   * the theme palette and fontFamily don't match, resulting in an error like:
   * "Warning: Prop className did not match".
   */

  return (
    <>
      <InitColorSchemeScript modeStorageKey={modeStorageKey} attribute="data-color-scheme" defaultMode={DEFAULT_THEME_MODE} />
      <Suspense fallback={<Loader />}>
        {loader ? (
          <Loader />
        ) : (
          <ThemeProvider disableTransitionOnChange theme={selectedTheme} modeStorageKey={modeStorageKey} defaultMode={DEFAULT_THEME_MODE}>
            <CssBaseline enableColorScheme />
            <RTLLayout>{children}</RTLLayout>
          </ThemeProvider>
        )}
      </Suspense>
    </>
  );
}
