'use client';

// @next
import NextLink from 'next/link';

// @mui
import Button, { ButtonProps } from '@mui/material/Button';

/***************************  NAVBAR - PRIMARY BUTTON  ***************************/

export default function NavPrimaryButton({ sx, children, ...rest }: ButtonProps) {
  return (
    <Button
      variant="contained"
      size="small"
      sx={sx}
      {...rest}
      {...(rest?.href && { component: NextLink })}
      rel="noopener noreferrer"
      aria-label="nav-primary-btn"
    >
      {children || 'Primary Button'}
    </Button>
  );
}
