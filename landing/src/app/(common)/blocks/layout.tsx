'use client';

// @mui
import Box from '@mui/material/Box';

// @types
import { ChildrenProps } from '@/types/root';

/***************************  LAYOUT - BLOCKS  ***************************/

export default function Blocks({ children }: ChildrenProps) {
  return (
    <main>
      <Box sx={{ '& :focus-visible': { outline: 'none' } }}>{children}</Box>
    </main>
  );
}
