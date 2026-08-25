'use client';

// @mui
import { useTheme } from '@mui/material/styles';

/***************************  IMAGE - CIRCLES BACKGROUND  ***************************/

export default function CirclesBackground() {
  const theme = useTheme();

  return (
    <svg viewBox="0 0 553 447" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="276.5" cy="170.5" r="276" stroke="url(#paint0_linear_13388_120755)" />
      <circle cx="276.2" cy="170.5" r="220.7" stroke={theme.vars.palette.grey[300]} />
      <circle cx="276.9" cy="170.5" r="165.4" stroke={theme.vars.palette.grey[300]} />
      <circle cx="276.6" cy="170.5" r="110.1" stroke={theme.vars.palette.grey[300]} />
      <circle cx="276.3" cy="170.5" r="54.8" stroke={theme.vars.palette.grey[300]} />
      <defs>
        <linearGradient id="paint0_linear_13388_120755" x1="276" y1="-121" x2="276" y2="565.5" gradientUnits="userSpaceOnUse">
          <stop stopColor={theme.vars.palette.grey[100]} />
          <stop offset="0.495" stopColor={theme.vars.palette.grey[300]} />
          <stop offset="1" stopColor={theme.vars.palette.grey[100]} />
        </linearGradient>
      </defs>
    </svg>
  );
}
