'use client';

import { useEffect, ReactNode } from 'react';

// @mui
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// @third-party
import rtlPlugin from 'stylis-plugin-rtl';

// @project
import { ThemeDirection } from '@/config';
import useConfig from '@/hooks/useConfig';

/***************************  RTL LAYOUT  ***************************/

interface Props {
  children: ReactNode;
}

const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin]
});

const ltrCache = createCache({
  key: 'mui'
});

export default function RTLLayout({ children }: Props) {
  const { state } = useConfig();

  useEffect(() => {
    document.dir = state.themeDirection;
  }, [state.themeDirection]);

  return <CacheProvider value={state.themeDirection === ThemeDirection.RTL ? rtlCache : ltrCache}>{children}</CacheProvider>;
}
