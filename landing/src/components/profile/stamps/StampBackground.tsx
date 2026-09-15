'use client';

import React from 'react';
import { StampFrameProps, StampVariant } from './types';
import Stamp1Frame from './Stamp1Frame';
import ClassicStampFrame from './ClassicStampFrame';

export interface StampVariantOption {
  id: StampVariant;
  label: string;
  description: string;
}

export const AVAILABLE_STAMP_VARIANTS: StampVariantOption[] = [
  {
    id: 'stamp_1',
    label: 'แสตมป์ 1 (เวกเตอร์ขอบหยัก SVG)',
    description: 'รูปแบบพื้นหลัง SVG ฟันปลาสีครีมวินเทจ พร้อมแถบสีเกรเดียนต์ฟ้าครามและเส้นกรอบสีขาว'
  },
  {
    id: 'classic',
    label: 'คลาสสิก (วินเทจเดิม)',
    description: 'รูปแบบดั้งเดิม เส้นประและขอบหยักด้วย CSS Radial Gradient'
  }
];

export default function StampBackground({
  variant = 'stamp_1',
  ...props
}: StampFrameProps) {
  switch (variant) {
    case 'classic':
      return <ClassicStampFrame {...props} />;
    case 'stamp_1':
    default:
      return <Stamp1Frame {...props} />;
  }
}
