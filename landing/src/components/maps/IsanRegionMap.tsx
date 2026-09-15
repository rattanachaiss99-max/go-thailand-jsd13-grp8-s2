'use client';

import React from 'react';
import { Province } from '@/data/thailandProvinces';
import DynamicRegionMap from './DynamicRegionMap';

interface IsanRegionMapProps {
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

export default function IsanRegionMap(props: IsanRegionMapProps) {
  return <DynamicRegionMap region="isan" {...props} />;
}
