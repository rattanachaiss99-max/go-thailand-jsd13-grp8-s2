'use client';

import React from 'react';
import { Province } from '@/data/thailandProvinces';
import DynamicRegionMap from './DynamicRegionMap';

interface NorthernRegionMapProps {
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

export default function NorthernRegionMap(props: NorthernRegionMapProps) {
  return <DynamicRegionMap region="north" {...props} />;
}
