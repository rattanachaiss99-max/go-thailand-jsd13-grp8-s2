'use client';

import React from 'react';
import { facilityKeywords, bedroomOptions, renovationOptions } from '@/data/properties';

interface FilterSidebarProps {
  maxPrice: number;
  onMaxPriceChange: (val: number) => void;
  selectedKeywords: string[];
  onToggleKeyword: (keyword: string) => void;
  selectedBedroom: string | null;
  onSelectBedroom: (val: string) => void;
  selectedRenovations: string[];
  onToggleRenovation: (val: string) => void;
}

export default function FilterSidebar({
  maxPrice,
  onMaxPriceChange,
  selectedKeywords,
  onToggleKeyword,
  selectedBedroom,
  onSelectBedroom,
  selectedRenovations,
  onToggleRenovation
}: FilterSidebarProps) {
  return (
    <div className="card sticky" style={{ padding: 24 }}>
      <div className="filter-title">Price Range (per night)</div>
      <input
        type="range"
        min="1500"
        max="20000"
        step="500"
        value={maxPrice}
        onChange={(e) => onMaxPriceChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--color-primary)' }}
      />
      <div className="between" style={{ fontSize: '.85rem', color: 'var(--color-muted)', marginTop: 6 }}>
        <span>฿1,500</span>
        <span>up to ฿{maxPrice.toLocaleString()}</span>
      </div>
      <div className="divider" />

      <div className="filter-title">Popular Filters</div>
      {facilityKeywords.map((keyword) => (
        <label className="check" key={keyword}>
          <input
            type="checkbox"
            checked={selectedKeywords.includes(keyword)}
            onChange={() => onToggleKeyword(keyword)}
          />
          {keyword}
        </label>
      ))}
      <div className="divider" />

      <div className="filter-title">Rating</div>
      <label className="check">
        <input type="checkbox" defaultChecked /> <span className="stars">★★★★★</span>
      </label>
      <label className="check">
        <input type="checkbox" /> <span className="stars">★★★★</span>☆
      </label>
      <div className="divider" />

      <div className="filter-title">Number of bedrooms</div>
      {bedroomOptions.map((opt) => (
        <label className="check" key={opt.value}>
          <input
            type="radio"
            name="bedrooms"
            checked={selectedBedroom === opt.value}
            onClick={() => onSelectBedroom(opt.value)}
            onChange={() => {}}
          />
          {opt.label}
        </label>
      ))}
      <div className="divider" />

      <div className="filter-title">Opening/renovation time</div>
      {renovationOptions.map((opt) => (
        <label className="check" key={opt.value}>
          <input
            type="checkbox"
            checked={selectedRenovations.includes(opt.value)}
            onChange={() => onToggleRenovation(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
