'use client';

import React from 'react';
import { Province } from '@/data/thailandProvinces';
import DynamicRegionMap from './DynamicRegionMap';

interface WesternRegionMapProps {
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

export default function WesternRegionMap(props: WesternRegionMapProps) {
  return <DynamicRegionMap region="west" {...props} />;
}
