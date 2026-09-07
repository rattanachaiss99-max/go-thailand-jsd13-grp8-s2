'use client';

import React from 'react';
import Link from 'next/link';
import PhotoPlaceholder from './PhotoPlaceholder';
import Button from './Button';
import { useBooking } from '@/contexts/BookingContext';

export interface Property {
  id: string;
  name: string;
  type: string;
  region: string;
  location: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  bedrooms: number;
  renovatedMonthsAgo: number;
  images: string[];
  tags: string[];
  keywords: string[];
  description: string;
  descriptionExtra?: string;
  amenities?: { icon: string; label: string }[];
}

interface PropertyCardProps {
  property: Property;
  mode?: 'list' | 'mini';
}

export default function PropertyCard({ property, mode = 'list' }: PropertyCardProps) {
  const { selectProperty, booking, nights } = useBooking();
  const handlePick = () => selectProperty(property.id);

  if (mode === 'mini') {
    return (
      <article className="card hotel-mini">
        <PhotoPlaceholder src={property.images[0]} alt={property.name} caption={property.location} />
        <div className="hotel-mini-body">
          <div className="between">
            <h3 style={{ fontSize: '1.05rem' }}>{property.name}</h3>
            <span className="badge-rate">
              {property.rating} <i>★</i>
            </span>
          </div>
          <div className="loc" style={{ margin: '6px 0' }}>
            📍 {property.location}
          </div>
          <div className="between">
            <div className="muted" style={{ fontSize: '.85rem' }}>From</div>
            <div className="price" style={{ fontSize: '1.15rem' }}>
              ฿{property.pricePerNight.toLocaleString()}
              <small>/night</small>
            </div>
          </div>
          <Link
            href={`/accommodations/${property.id}`}
            onClick={handlePick}
            className="btn btn-ghost btn-full"
            style={{ marginTop: 12 }}
          >
            View Details
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="card hotel">
      <PhotoPlaceholder src={property.images[0]} alt={property.name} caption={property.location}>
        <span className="pill-img">{property.type}</span>
      </PhotoPlaceholder>
      <div className="hotel-body">
        <div className="between">
          <h3>{property.name}</h3>
          <span className="badge-rate">
            {property.rating} <i>★</i>
          </span>
        </div>
        <div className="loc">
          📍 {property.location}{' '}
          <Link href={`/accommodations/${property.id}#map`} onClick={handlePick}>
            Show on map
          </Link>
        </div>
        <p className="muted" style={{ fontSize: '.95rem' }}>
          {property.description}
        </p>
        <div className="row" style={{ margin: '14px 0', flexWrap: 'wrap', gap: 8 }}>
          {property.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="hotel-foot">
          <div>
            <div className="muted" style={{ fontSize: '.85rem' }}>
              {nights} nights, {booking.guests.adults} adults
            </div>
            <div className="price">
              ฿{property.pricePerNight.toLocaleString()} <small>/ night</small>
            </div>
          </div>
          <Button to={`/accommodations/${property.id}`} variant="gold" onClick={handlePick}>
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
}
