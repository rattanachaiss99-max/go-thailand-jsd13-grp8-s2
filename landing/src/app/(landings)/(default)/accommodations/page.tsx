'use client';

import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import SearchBar from '@/components/yok/SearchBar';
import FilterSidebar from '@/components/yok/FilterSidebar';
import PropertyCard from '@/components/yok/PropertyCard';
import Chip from '@/components/yok/Chip';
import ContainerWrapper from '@/components/ContainerWrapper';
import { properties, bedroomOptions, renovationOptions } from '@/data/properties';

export default function AccommodationListingPage() {
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedBedroom, setSelectedBedroom] = useState<string | null>(null);
  const [selectedRenovations, setSelectedRenovations] = useState<string[]>([]);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const selectBedroom = (value: string) => {
    setSelectedBedroom((prev) => (prev === value ? null : value));
  };

  const toggleRenovation = (value: string) => {
    setSelectedRenovations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const filteredProperties = useMemo(() => {
    const bedroomTest = bedroomOptions.find((o) => o.value === selectedBedroom)?.test;
    const renovationMaxMonths = renovationOptions
      .filter((o) => selectedRenovations.includes(o.value))
      .map((o) => o.maxMonths);

    return properties.filter((p) => {
      if (p.pricePerNight > maxPrice) return false;
      if (!selectedKeywords.every((k) => p.keywords.includes(k))) return false;
      if (bedroomTest && !bedroomTest(p.bedrooms)) return false;
      if (renovationMaxMonths.length > 0) {
        const withinAnySelectedRange = renovationMaxMonths.some(
          (max) => p.renovatedMonthsAgo <= max
        );
        if (!withinAnySelectedRange) return false;
      }
      return true;
    });
  }, [maxPrice, selectedKeywords, selectedBedroom, selectedRenovations]);

  return (
    <Box className="yok-container" sx={{ pb: 10 }}>
      {/* Hero Strip */}
      <Box sx={{ bgcolor: 'var(--color-primary)', py: { xs: 5, md: 7 }, color: '#fff', mb: { xs: 4, md: 6 } }}>
        <ContainerWrapper>
          <h1 style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 800, marginBottom: 12 }}>
            Curated stays across Thailand
          </h1>
          <p style={{ color: '#b9c7d8', fontSize: '1.1rem', maxWidth: 640 }}>
            Private villas, riverside sanctuaries and beachfront retreats — hand-selected for the discerning traveller.
          </p>
        </ContainerWrapper>
      </Box>

      {/* Search Bar */}
      <ContainerWrapper sx={{ mb: 5 }}>
        <SearchBar />
      </ContainerWrapper>

      {/* Main Listing Content */}
      <ContainerWrapper>
        <div className="listing">
          <aside>
            <FilterSidebar
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              selectedKeywords={selectedKeywords}
              onToggleKeyword={toggleKeyword}
              selectedBedroom={selectedBedroom}
              onSelectBedroom={selectBedroom}
              selectedRenovations={selectedRenovations}
              onToggleRenovation={toggleRenovation}
            />
          </aside>

          <section>
            <div className="chips">
              <Chip label="Free Cancellation" />
              <Chip label="Breakfast Included" defaultOn />
              <Chip label="Private Pool" />
              <Chip label="Beachfront" />
            </div>

            <p className="muted" style={{ marginBottom: 18, fontWeight: 500 }}>
              พบ {filteredProperties.length} ที่พัก ({filteredProperties.length} propert{filteredProperties.length === 1 ? 'y' : 'ies'} found)
            </p>

            {filteredProperties.length === 0 && (
              <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                <p className="muted">ไม่พบที่พักตรงกับเงื่อนไข ลองขยายช่วงราคาหรือตัวกรองอื่น</p>
              </div>
            )}

            {filteredProperties.map((property) => (
              <div key={property.id} style={{ marginBottom: 24 }}>
                <PropertyCard property={property} mode="list" />
              </div>
            ))}
          </section>
        </div>
      </ContainerWrapper>
    </Box>
  );
}
