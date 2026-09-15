'use client';

import React from 'react';
import { Province } from '@/data/thailandProvinces';
import DynamicRegionMap from './DynamicRegionMap';

interface CentralRegionMapProps {
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

export default function CentralRegionMap(props: CentralRegionMapProps) {
  return <DynamicRegionMap region="central" {...props} />;
}
