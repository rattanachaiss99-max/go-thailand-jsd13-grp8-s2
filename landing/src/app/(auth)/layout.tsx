'use client';

// @project
import ThemeProviders from '@/components/ThemeProvider';

// @types
import { ChildrenProps } from '@/types/root';

// ----------------------------------------------------------------------------
// Layout for (auth) routes — wraps MUI Theme so useTheme() works on /register
// ----------------------------------------------------------------------------

export default function AuthLayout({ children }: ChildrenProps) {
  return <ThemeProviders>{children}</ThemeProviders>;
}
