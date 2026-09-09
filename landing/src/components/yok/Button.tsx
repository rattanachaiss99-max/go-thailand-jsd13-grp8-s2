'use client';

import React, { ReactNode, MouseEventHandler } from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: ReactNode;
  to?: string;
  variant?: 'primary' | 'gold' | 'ghost' | 'link';
  size?: 'md' | 'lg';
  full?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  full = false,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...rest
}: ButtonProps) {
  const btnClasses = [
    'btn',
    `btn-${variant}`,
    size === 'lg' ? 'btn-lg' : '',
    full ? 'btn-full' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link href={to} className={btnClasses} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={btnClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
