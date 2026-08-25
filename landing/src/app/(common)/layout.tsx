'use client';

// @types
import { ChildrenProps } from '@/types/root';
import ThemeProviders from '@/components/ThemeProvider';

/***************************  LAYOUT - COMMON  ***************************/

export default function CommonLayout({ children }: ChildrenProps) {
  return <ThemeProviders>{children}</ThemeProviders>;
}
