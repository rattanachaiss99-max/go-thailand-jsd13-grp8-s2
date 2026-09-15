import React from 'react';

export type StampVariant = 'classic' | 'stamp_1' | string;

export interface StampFrameProps {
  variant?: StampVariant;
  isVisited?: boolean;
  paperBg?: string;
  accentColor?: string;
  className?: string;
  children?: React.ReactNode;
}
