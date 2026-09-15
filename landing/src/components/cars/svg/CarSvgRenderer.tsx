'use client';

import React from 'react';
import Sedan4DoorSvg from './Sedan4DoorSvg';

export interface CarSvgRendererProps {
  type: string;
  isUnlocked?: boolean;
  color?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * CarSvgRenderer
 * Dynamic SVG renderer supporting 12 car styles matching the Go Thailand Garage collection
 */
export default function CarSvgRenderer({
  type,
  isUnlocked = true,
  color,
  width = '100%',
  height = '100%',
  className
}: CarSvgRendererProps) {
  // If it's a 4-door sedan, coupe, executive, or taxi:
  if (['sedan-4door', 'green-sedan', 'white-sedan', 'orange-coupe', 'bkk-taxi'].includes(type)) {
    let customColor = color;
    if (type === 'green-sedan') customColor = customColor || '#48BB78';
    if (type === 'white-sedan') customColor = customColor || '#E2E8F0';
    if (type === 'orange-coupe') customColor = customColor || '#F97316';
    if (type === 'bkk-taxi') customColor = customColor || '#FBBF24';

    return (
      <div style={{ position: 'relative', width, height }}>
        <Sedan4DoorSvg
          isUnlocked={isUnlocked}
          bodyColor={customColor}
          width="100%"
          height="100%"
          className={className}
        />
        {/* Taxi sign on top if bkk-taxi */}
        {type === 'bkk-taxi' && isUnlocked && (
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '46%',
              transform: 'translateX(-50%)',
              background: '#DC2626',
              color: '#FFF',
              fontSize: '8px',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '2px',
              border: '1px solid #991B1B',
              letterSpacing: '0.5px'
            }}
          >
            TAXI
          </div>
        )}
      </div>
    );
  }

  // SUV / 4WD Off-roader
  if (type === 'white-suv' || type === 'suv-4wd') {
    const bodyC = isUnlocked ? (color || '#F8FAFC') : '#94A3B8';
    const trimC = isUnlocked ? '#334155' : '#64748B';
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 100"
        width={width}
        height={height}
        className={className}
        style={{
          display: 'block',
          filter: isUnlocked ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))' : 'grayscale(1) opacity(0.4)',
          transition: 'filter 0.3s ease'
        }}
      >
        {/* Spare Tire on back */}
        <rect x="8" y="32" width="14" height="34" rx="4" fill="#1E293B" />
        {/* SUV Body Boxy Tough Silhouette */}
        <path
          d="M20,68 L20,38 L45,35 L105,35 L160,37 L190,48 L220,60 L224,74 L20,74 Z"
          fill={bodyC}
          stroke={trimC}
          strokeWidth="2.5"
        />
        {/* Black Protective Cladding / Wheel arches */}
        <path d="M18,74 L60,74 A16,16 0 0,1 92,74 L148,74 A16,16 0 0,1 180,74 L224,74 L224,77 L18,77 Z" fill="#1E293B" />
        {/* Windows */}
        <path
          d="M30,42 L70,42 L70,58 L28,58 Z M76,42 L115,42 L115,58 L76,58 Z M121,42 L155,42 L178,56 L121,58 Z"
          fill={isUnlocked ? '#7DD3FC' : '#CBD5E1'}
          stroke="#0284C7"
          strokeWidth="1.2"
        />
        {/* Roof Rails */}
        <rect x="50" y="31" width="105" height="3" fill="#64748B" rx="1.5" />
        {/* Wheels */}
        <g fill="#0F172A">
          <circle cx="76" cy="74" r="16" />
          <circle cx="76" cy="74" r="9" fill={isUnlocked ? '#E2E8F0' : '#64748B'} />
          <circle cx="76" cy="74" r="4" fill="#0F172A" />
          <circle cx="164" cy="74" r="16" />
          <circle cx="164" cy="74" r="9" fill={isUnlocked ? '#E2E8F0' : '#64748B'} />
          <circle cx="164" cy="74" r="4" fill="#0F172A" />
        </g>
      </svg>
    );
  }

  // Red Pickup Truck
  if (type === 'red-pickup' || type === 'pickup-truck') {
    const bodyC = isUnlocked ? (color || '#DC2626') : '#94A3B8';
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 100"
        width={width}
        height={height}
        className={className}
        style={{
          display: 'block',
          filter: isUnlocked ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))' : 'grayscale(1) opacity(0.4)',
          transition: 'filter 0.3s ease'
        }}
      >
        {/* Pickup Bed and Cab */}
        <path
          d="M15,54 L90,54 L90,38 L145,38 L175,54 L225,58 L225,74 L15,74 Z"
          fill={bodyC}
          stroke="#7F1D1D"
          strokeWidth="2"
        />
        {/* Bed interior line */}
        <line x1="20" y1="55" x2="88" y2="55" stroke="#450A0A" strokeWidth="2.5" />
        {/* Cab Window */}
        <path d="M96,44 L138,44 L165,54 L96,54 Z" fill={isUnlocked ? '#BAE6FD' : '#CBD5E1'} stroke="#0284C7" strokeWidth="1.2" />
        {/* High clearance suspension and Wheels */}
        <circle cx="68" cy="74" r="17" fill="#0F172A" />
        <circle cx="68" cy="74" r="9" fill={isUnlocked ? '#94A3B8' : '#64748B'} />
        <circle cx="180" cy="74" r="17" fill="#0F172A" />
        <circle cx="180" cy="74" r="9" fill={isUnlocked ? '#94A3B8' : '#64748B'} />
      </svg>
    );
  }

  // Lime Hatchback / Eco
  if (type === 'lime-hatchback' || type === 'eco-hatchback') {
    const bodyC = isUnlocked ? (color || '#84CC16') : '#94A3B8';
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 100"
        width={width}
        height={height}
        className={className}
        style={{
          display: 'block',
          filter: isUnlocked ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))' : 'grayscale(1) opacity(0.4)',
          transition: 'filter 0.3s ease'
        }}
      >
        {/* Compact Hatchback rounded aerodynamic curve */}
        <path
          d="M28,68 L28,52 Q35,40 60,38 L120,38 L175,54 L210,64 L214,74 L28,74 Z"
          fill={bodyC}
          stroke="#4D7C0F"
          strokeWidth="2"
        />
        {/* Windows */}
        <path
          d="M48,44 L90,44 L90,56 L42,56 Z M96,44 L138,44 L164,54 L96,56 Z"
          fill={isUnlocked ? '#BAE6FD' : '#CBD5E1'}
          stroke="#0284C7"
          strokeWidth="1.2"
        />
        {/* Wheels */}
        <circle cx="65" cy="74" r="14" fill="#0F172A" />
        <circle cx="65" cy="74" r="7" fill={isUnlocked ? '#E2E8F0' : '#64748B'} />
        <circle cx="168" cy="74" r="14" fill="#0F172A" />
        <circle cx="168" cy="74" r="7" fill={isUnlocked ? '#E2E8F0' : '#64748B'} />
      </svg>
    );
  }

  // Red Sport / Supercar
  if (type === 'red-sport' || type === 'supercar') {
    const bodyC = isUnlocked ? (color || '#EF4444') : '#94A3B8';
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 100"
        width={width}
        height={height}
        className={className}
        style={{
          display: 'block',
          filter: isUnlocked ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))' : 'grayscale(1) opacity(0.4)',
          transition: 'filter 0.3s ease'
        }}
      >
        {/* Low slung sleek aero profile */}
        <path
          d="M18,70 L24,56 L65,48 L110,42 L160,48 L220,64 L225,74 L18,74 Z"
          fill={bodyC}
          stroke="#991B1B"
          strokeWidth="2"
        />
        {/* Cockpit Canopy Window */}
        <path d="M72,50 L115,44 L152,48 L152,56 L65,56 Z" fill={isUnlocked ? '#0284C7' : '#64748B'} />
        {/* Sport Rims */}
        <circle cx="60" cy="72" r="15" fill="#0F172A" />
        <circle cx="60" cy="72" r="8" fill={isUnlocked ? '#DC2626' : '#64748B'} stroke="#F8FAFC" strokeWidth="1.5" />
        <circle cx="178" cy="72" r="15" fill="#0F172A" />
        <circle cx="178" cy="72" r="8" fill={isUnlocked ? '#DC2626' : '#64748B'} stroke="#F8FAFC" strokeWidth="1.5" />
      </svg>
    );
  }

  // Default fallback to Sedan4DoorSvg
  return (
    <Sedan4DoorSvg
      isUnlocked={isUnlocked}
      bodyColor={color}
      width={width}
      height={height}
      className={className}
    />
  );
}
