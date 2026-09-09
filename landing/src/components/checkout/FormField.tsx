'use client';

import React, { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  id?: string;
  children: ReactNode;
  className?: string;
  error?: string;
}

export default function FormField({
  label,
  id,
  children,
  className = '',
  error
}: FormFieldProps) {
  return (
    <div className={`checkout-form-field ${className}`} style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-muted, #61738a)',
          marginBottom: 6
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#d32f2f', marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export const inputClassName =
  'w-full border-b border-gray-300 bg-transparent pb-2 text-sm focus:border-black focus:outline-none';

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: '0.95rem',
  color: '#111827',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s'
};
