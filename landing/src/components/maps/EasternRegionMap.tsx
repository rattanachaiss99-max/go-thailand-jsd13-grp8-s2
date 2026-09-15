'use client';

import React from 'react';
import { Province } from '@/data/thailandProvinces';
import DynamicRegionMap from './DynamicRegionMap';

interface EasternRegionMapProps {
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

export default function EasternRegionMap(props: EasternRegionMapProps) {
  return <DynamicRegionMap region="east" {...props} />;
}
