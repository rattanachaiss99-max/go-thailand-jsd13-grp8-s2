'use client';

import React, { useState } from 'react';

interface ChipProps {
  label: string;
  defaultOn?: boolean;
}

export default function Chip({ label, defaultOn = false }: ChipProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      className={`chip ${on ? 'on' : ''}`}
      onClick={() => setOn((v) => !v)}
    >
      {label}
    </button>
  );
}
