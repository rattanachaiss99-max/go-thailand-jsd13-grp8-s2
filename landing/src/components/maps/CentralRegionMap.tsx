'use client';
// ============================================================================
// ARCHITECTURE NOTE [ON-DEMAND VECTOR LOADING]:
// คอมโพเนนต์นี้เก็บ SVG Vector Paths สำหรับภาคกลาง (22 จังหวัด)
// ปัจจุบันระบบหลักได้ปิดการโหลดเวกเตอร์ทั้งหมดในโค้ดไว้ชั่วคราว (Suspended from initial render)
// เพื่อเตรียมพร้อมสำหรับการดึงทีละภาพแบบไดนามิกจาก MongoDB Atlas ผ่าน /api/provinces/vectors/[slug]
// ============================================================================

import React from 'react';
import Box from '@mui/material/Box';
import { Province, getProvinceByIdOrSlug } from '@/data/thailandProvinces';

interface CentralRegionMapProps {
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

export default function CentralRegionMap({
  selectedProvinceId,
  hoveredProvinceId,
  visitedProvinceIds = [],
  onSelectProvince,
  onHoverProvince
}: CentralRegionMapProps) {
  // ฟังก์ชันคำนวณสีของแต่ละจังหวัดตาม State (Selected / Hovered / Visited / Default)
  const getProvinceColor = (slug: string) => {
    const isSelected =
      selectedProvinceId === slug ||
      selectedProvinceId === `${slug}-province` ||
      getProvinceByIdOrSlug(selectedProvinceId || '')?.slug === slug;

    const isHovered =
      hoveredProvinceId === slug ||
      hoveredProvinceId === `${slug}-province` ||
      (hoveredProvinceId && getProvinceByIdOrSlug(hoveredProvinceId)?.slug === slug);

    const isVisited = visitedProvinceIds.some(
      (id) => id === slug || id === `${slug}-province` || getProvinceByIdOrSlug(id)?.slug === slug
    );

    if (isSelected) return '#16a34a'; // เขียวมรกตสดใสประจำภาคกลางเมื่อคลิกเลือก
    if (isHovered) return '#4ade80';  // เขียวสว่างตอน hover
    if (isVisited) return '#10b981';  // สีเขียวมรกตสดใส = พิชิต/เคยไปมาแล้วจากการจองสำเร็จ 🏆
    return '#f8fafc';                // ครีม/เทาอ่อนสะอาดยามปกติ
  };

  const getProvinceStroke = (slug: string) => {
    const isSelected =
      selectedProvinceId === slug ||
      selectedProvinceId === `${slug}-province` ||
      getProvinceByIdOrSlug(selectedProvinceId || '')?.slug === slug;

    const isVisited = visitedProvinceIds.some(
      (id) => id === slug || id === `${slug}-province` || getProvinceByIdOrSlug(id)?.slug === slug
    );

    if (isSelected) return '#15803d';
    if (isVisited) return '#059669';
    return '#cbd5e1';
  };

  const handleInteraction = (slug: string) => {
    const prov = getProvinceByIdOrSlug(slug);
    if (prov) onSelectProvince(prov);
  };

  const handleMouseEnter = (slug: string) => {
    const prov = getProvinceByIdOrSlug(slug);
    if (prov) onHoverProvince(prov);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="401.03 1039 629.97 1074"
        className="w-full h-auto"
        style={{
          maxHeight: '560px',
          margin: '0 auto',
          display: 'block',
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.06))',
          transition: 'all 0.3s ease'
        }}
      >
        <g id="Central">
          {/* 1. สุโขทัย (Sukhothai) */}
          <path
            id="sukhothai-province"
            data-name="Sukhothai"
            d="M653.44 1248.58v15.65s-6.52 6.52-9.13 5.21-13.04-1.3-13.04-1.3l-1.3 5.21-11.74 2.61v9.13l-10.38 5.19-5.27 2.63-2.5 15.04-.1.61s-3.91-2.61-5.22-2.61-15.65 9.13-15.65 9.13l-6.52-13.04-7.82 5.22-19.56-9.13-10.43-13.04v-9.13l-5.21-1.3-2.61 6.52-2.61 2.61-7.82-20.87-.68-.21.68-1.09-4.54-9.99-1.98-4.35h-5.22l-10.43-13.04 2.61-9.13-7.82-3.91h-7.83l-2.61-11.74.97-28.08 1.64.7 14.34 13.04 13.04-13.04 1.31-7.82s3.91-13.04 2.61-14.35c-1.31-1.3-6.52-5.21-6.52-5.21l-1.31-11.74-5.21-7.82 5.21-13.04-1.3-6.52 5.21-10.43v-7.82c0-1.31 3.92-14.35 3.92-14.35l-1.39-8.25v-.01l15.73-17.81 14.34-3.91 15.65 5.21 9.13 16.95 20.86-19.56 19.56 1.31 5.88 4.2-1.97 4.92 11.73 13.04 1.31 15.65-7.83 9.13v19.56l16.95 10.43v10.43l-3.91 3.91.88 8.74.43 4.3 1.3 9.13-7.82 5.21-3.91 7.83 5.21 7.82v9.78l-6.52 3.26v7.82l5.22 6.52 2.6 5.22 7.83 6.52v6.51c0 1.31 19.56 11.74 19.56 11.74z"
            fill={getProvinceColor('sukhothai')}
            stroke={getProvinceStroke('sukhothai')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('sukhothai')}
            onMouseEnter={() => handleMouseEnter('sukhothai')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 2. พิษณุโลก (Phitsanulok) */}
          <path
            id="phitsanulok-province"
            data-name="Phitsanulok"
            d="m873.8 1187.3-2.51 7.51-.1.31-5.22 6.52 1.31 10.43-5.22 5.22-1.3 36.51-3.92 3.91v13.04l-11.73 6.52v6.52l-15.65 7.82v7.82l9.13 16.95-15.65 5.22-6.52 10.43v10.43l2.61 5.22-12.93 16.96-7.93 10.42-9.13 1.3-2.61 5.22-2.6 9.12-8.75 6.25-.38.27-7.82-9.12-1.31-7.83-10.43-11.73 2.61-24.78-3.91-5.21-5.22 2.61-6.52-1.31-3.91 9.13s-13.04 7.82-14.34 7.82-3.91-9.12-3.91-9.12l-6.52-2.61-9.13 6.52-33.9 3.91-1.31-2.61 10.43-13.04v-7.82l-3.91-5.22-3.91 6.52-5.21 5.22-6.52-7.82-6.52-1.31s-10.43 10.43-10.43 11.74c0 .84-7.83.58-13.24.3-2.84-.15-5.02-.3-5.02-.3l-14.34-6.52-3.16-8.15-7.17-18.54 2.5-15.04 5.27-2.63 10.38-5.19v-9.13l11.74-2.61 1.3-5.21s10.43 0 13.04 1.3c2.61 1.31 9.13-5.21 9.13-5.21v-15.65s-19.56-10.43-19.56-11.74v-6.51l-7.83-6.52-2.6-5.22-5.22-6.52v-7.82l6.52-3.26v.65h13.04l24.77-2.61 18.26-5.21 9.13-11.74 5.21-24.77 7.82-2.61h5.22l11.74-9.13h9.12l7.83-1.3 6.52 3.91 19.55-3.91 5.22-15.65 32.6-18.25 3.91-10.43 14.34-10.44v-7.82l7.82-2.61 3.92 2.61h11.73l5.02-10.04 4.37.87v9l-8.88 28.61-5.72 2.85-9.13-5.21-7.82 6.52 2.6 9.13-9.12 9.12 2.6 6.52 9.13-2.61 5.22 2.61v24.78h16.95s2.61 6.52 6.52 9.12c3.91 2.61 14.34 3.92 14.34 3.92z"
            fill={getProvinceColor('phitsanulok')}
            stroke={getProvinceStroke('phitsanulok')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('phitsanulok')}
            onMouseEnter={() => handleMouseEnter('phitsanulok')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 3. เพชรบูรณ์ (Phetchabun) */}
          <path
            id="phetchabun-province"
            data-name="Phetchabun"
            d="m1024.54 1296.85-.8 10.41-1.2 1.79-5.88 8.82-7.26 2.42-7.82-5.21-13.04 2.61-5.22-5.22-14.34 5.22-5.22 13.04-3.91 6.51 2.61 9.13-7.82 3.91 1.3 11.74-22.17 29.99-6.52 19.56 1.31 20.86-6.52 35.2 14.34 13.04-2.61 6.52v9.13l-7.82 6.52-.61 1.84-3.3 9.9 3.91 13.03-.43 3.04-.87 6.09 3.91 7.82-11.74 26.08-5.21 19.56v28.69l-7.83 5.21-9.12-1.3-7.83-5.22-26.07 11.74h-14.35l-2.6-11.74-9.13-7.82v-20.86l-15.65-6.52-7.99-10.66-3.74-4.99 6.52-23.47-2.78-12.03-5.05-21.87 3.91-9.13-11.73-2.61v-9.12l.78-.79 5.74-5.73-3.91-9.13-20.87-7.82-7.82-6.52v-23.47l15.65-18.26-15.65-15.64 2.99-4.19 8.75-6.25 2.6-9.12 2.61-5.22 9.13-1.3 7.93-10.42 12.93-16.96-2.61-5.22v-10.43l6.52-10.43 15.65-5.22-9.13-16.95v-7.82l15.65-7.82v-6.52l11.73-6.52v-13.04l7.83 9.12 9.13-3.91 2.6-26.08 19.56-11.73 6.52 2.61 2.61-9.13 5.21 1.3 16.95-15.64 11.74-2.61 10.43 6.52 3.91 7.82v7.83l11.74 6.52v9.12l9.13 7.83 10.43-3.92 1.3-9.12 6.52-1.31 3.91 9.13 1.31 14.34 3.91 1.31v3.91l-1.31 9.13s1.31 5.21 1.31 6.52 5.21 6.52 5.21 6.52l-2.61 9.12s5.22 6.52 6.52 6.52c1.23 0 10.61-2.32 13.84-2.58z"
            fill={getProvinceColor('phetchabun')}
            stroke={getProvinceStroke('phetchabun')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('phetchabun')}
            onMouseEnter={() => handleMouseEnter('phetchabun')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 4. กำแพงเพชร (Kamphaeng Phet) */}
          <path
            id="kamphaeng-phet-province"
            data-name="Kamphaeng Phet"
            d="m635.56 1423.3 2.23 5.22-2.15 3.69-16.1 27.6h-9.13l-14.34 7.82-11.74 26.08h-18.25l-11.74 6.52-35.2-7.82-10.44 5.21h-37.81l-14.34-10.43-18.26 10.43-9.49-2.37.37-5.45s-3.92-7.82-3.92-9.13c0-1.3 9.13-22.16 9.13-22.16l-7.82-15.65-7.83-2.61 7.83-15.64-7.83-13.04 2.61-22.17s-9.12-3.91-9.12-5.21c0-1.31 1.3-9.13 1.3-9.13l-6.52-7.83v-5.21l3.91-2.61 6.52 5.22h16.95l18.26-15.65h10.43v-22.17l13.04-24.77-2.61-9.13 5.21-7.82h14.35l1.3-13.04h15.65l5.84-9.34.68.21 7.82 20.87 2.61-2.61 2.61-6.52 5.21 1.3v9.13l10.43 13.04 19.56 9.13 7.82-5.22 6.52 13.04s14.35-9.13 15.65-9.13 5.22 2.61 5.22 2.61l.1-.61 7.17 18.54 3.16 8.15 14.34 6.52s2.18.15 5.02.3l8.02 14.04-14.34 23.47 9.12 18.25-2.6 13.04z"
            fill={getProvinceColor('kamphaeng-phet')}
            stroke={getProvinceStroke('kamphaeng-phet')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('kamphaeng-phet')}
            onMouseEnter={() => handleMouseEnter('kamphaeng-phet')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 5. พิจิตร (Phichit) */}
          <path
            id="phichit-province"
            data-name="Phichit"
            d="m804.69 1481.98-5.74 5.73-7.3-13.56-10.43 1.31-6.52-3.91h-6.52l-16.95 15.64H708.2l-3.91-7.82-5.22-2.61-5.21 7.83-16.95 6.51-9.13-3.91-14.34-29.99-7.83-19.55-9.97-5.44 2.15-3.69-2.23-5.22-5.59-13.04 2.6-13.04-9.12-18.25 14.34-23.47-8.02-14.04c5.41.28 13.24.54 13.24-.3 0-1.31 10.43-11.74 10.43-11.74l6.52 1.31 6.52 7.82 5.21-5.22 3.91-6.52 3.91 5.22v7.82l-10.43 13.04 1.31 2.61 33.9-3.91 9.13-6.52 6.52 2.61s2.6 9.12 3.91 9.12c1.3 0 14.34-7.82 14.34-7.82l3.91-9.13 6.52 1.31 5.22-2.61 3.91 5.21-2.61 24.78 10.43 11.73 1.31 7.83 7.82 9.12.38-.27-2.99 4.19 15.65 15.64-15.65 18.26v23.47l7.82 6.52 20.87 7.82z"
            fill={getProvinceColor('phichit')}
            stroke={getProvinceStroke('phichit')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('phichit')}
            onMouseEnter={() => handleMouseEnter('phichit')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 6. นครสวรรค์ (Nakhon Sawan) */}
          <path
            id="nakhon-sawan-province"
            data-name="Nakhon Sawan"
            d="m807.3 1566.73 3.74 4.99-8.96 4.14-5.21 6.52 2.6 11.73-7.82 5.22h-13.04l-10.43 13.04 1.3 15.64-9.12 7.83 1.3 10.43-15.65 11.73s-.84 2.81-1.87 5.95c-1.19 3.62-2.64 7.69-3.34 8.4-1.31 1.3-10.43 6.52-10.43 6.52l-5.22 5.96-3.91 4.47-13.04-7.83-1.23-6.14-.07-.38-16.95-16.95.1-.65 1.2-7.17-7.82-10.43 2.6-18.26-6.52-2.6-7.82 2.6-15.65-13.03s-.66-.13-1.69-.36c-3.57-.75-11.63-2.54-12.65-3.56-1.3-1.3 0-9.12 0-9.12l-10.43-5.22-14.34-2.61-.69-7.65-.62-6.69v-19.56l-6.52-7.82-9.12 5.21-2.61 9.13-22.17-14.34-15.64 3.91-33.91 23.47h-15.64l-19.56-15.65-3.91-11.73-24.78-9.13-6.52-11.73-15.64-3.49v-1.73l-11.74-10.43.08-1.1.86-13.01 9.49 2.37 18.26-10.43 14.34 10.43h37.81l10.44-5.21 35.2 7.82 11.74-6.52h18.25l11.74-26.08 14.34-7.82h9.13l16.1-27.6 9.97 5.44 7.83 19.55 14.34 29.99 9.13 3.91 16.95-6.51 5.21-7.83 5.22 2.61 3.91 7.82h43.03l16.95-15.64h6.52l6.52 3.91 10.43-1.31 7.3 13.56-.78.79v9.12l11.73 2.61-3.91 9.13 5.05 21.87 2.78 12.03z"
            fill={getProvinceColor('nakhon-sawan')}
            stroke={getProvinceStroke('nakhon-sawan')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('nakhon-sawan')}
            onMouseEnter={() => handleMouseEnter('nakhon-sawan')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 7. ลพบุรี (Lop Buri) */}
          <path
            id="lopburi-province"
            data-name="Lop Buri"
            d="M940.29 1691.91h-9.12l-1.31 9.12-5.21 6.52-11.74 2.61-2.61 11.73-19.55-1.3-7.83 5.22-10.43-2.61-5.21 5.21 2.6 9.13-5.21 16.95-10.43-5.21-16.95 10.43-9.13-5.22h-7.82l-6.52-7.82h-11.74c-1.3 0-6.52-2.61-6.52-2.61l-14.34 7.82-3.91 13.04-6.16 7.28-8.19 9.67-2.94-.39-15.21-2.03-1.4-.18-9.13-9.13v-27.38l-7.88-13.8-2.55-4.46 5.21-11.73-2.61-7.83 5.22-11.73-6.52-8.38 5.22-5.96s9.12-5.22 10.43-6.52c.7-.71 2.15-4.78 3.34-8.4 1.03-3.14 1.87-5.95 1.87-5.95l15.65-11.73-1.3-10.43 9.12-7.83-1.3-15.64 10.43-13.04h13.04l7.82-5.22-2.6-11.73 5.21-6.52 8.96-4.14 7.99 10.66 15.65 6.52v20.86l9.13 7.82 2.6 11.74h14.35l26.07-11.74 7.83 5.22 9.12 1.3 7.83-5.21v-28.69l5.21-19.56 11.74-26.08-3.91-7.82.87-6.09 9.56.88 2.61 14.34-9.13 26.08 5.21 15.64v26.08l4.45 1.28-1.84 15.67 1.31 28.69.57 7.16z"
            fill={getProvinceColor('lop-buri')}
            stroke={getProvinceStroke('lop-buri')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('lop-buri')}
            onMouseEnter={() => handleMouseEnter('lop-buri')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 8. นครนายก (Nakhon Nayok) */}
          <path
            id="nakhon-nayok-province"
            data-name="Nakhon Nayok"
            d="M959.85 1852.28v15.65l-10.43 2.61-14.34-1.3-1.31 6.51 5.22 2.61v5.22l-15.65 2.61-9.12 13.03 6.52 16.96-24.78 2.6-5.21 9.13-10.44 2.61-2.86 6.45-32.34-1.24-.64.17-.36.11-13.34 3.64v-58.68l9.12-7.82v-10.43l1.56.19 8.88 1.11 13.03-11.74-1.3-15.64 19.56 10.43 6.52 5.21 7.82-5.21-2.61-7.82 1.31-6.52 5.21-1.31 2.61-10.43 10.43-5.21 20.17 16.61 2 1.64 10.43 7.82z"
            fill={getProvinceColor('nakhon-nayok')}
            stroke={getProvinceStroke('nakhon-nayok')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('nakhon-nayok')}
            onMouseEnter={() => handleMouseEnter('nakhon-nayok')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 9. อุทัยธานี (Uthai Thani) */}
          <path
            id="uthai-thani-province"
            data-name="Uthai Thani"
            d="m648.22 1616.28 3.91 10.43-11.73 11.74-6.52-3.92-20.86-1.3-9.13 2.61-6.52-6.52-14.34-2.61-11.74 9.13-2.61 15.64 14.35 16.95v15.65l-13.04 15.65v10.43l-15.65-3.91-7.82 9.13-27.38-10.44h-14.35l-3.91-15.64h-13.04l-3.91-5.22-7.82 5.22-5.39 14.37-7.65 1.27-11.74-7.82-1.43.24-6.39 1.06-6.52-6.51-13.04 2.6-13.04-5.21-1.3-20.87 2.61-24.77 6.51-9.13-1.3-11.73 6.52-10.43-2.61-16.95 5.22-7.83-5.22-9.12-1.3-7.83 11.73-6.52v-18.25l7.83-7.82v-16.53l15.64 3.49 6.52 11.73 24.78 9.13 3.91 11.73 19.56 15.65h15.64l33.91-23.47 15.64-3.91 22.17 14.34 2.61-9.13 9.12-5.21 6.52 7.82v19.56l.62 6.69.69 7.65 14.34 2.61 10.43 5.22s-1.3 7.82 0 9.12c1.02 1.02 9.08 2.81 12.65 3.56z"
            fill={getProvinceColor('uthai-thani')}
            stroke={getProvinceStroke('uthai-thani')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('uthai-thani')}
            onMouseEnter={() => handleMouseEnter('uthai-thani')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 10. ชัยนาท (Chai Nat) */}
          <path
            id="chai-nat-province"
            data-name="Chai Nat"
            d="m706.97 1675.33-9.2 6.14-2.61 7.83h-9.13l-5.21 5.21 6.52 3.91v14.35h-14.35l-5.37 3.75-7.66 5.37-.59-.41-8.54-6.1-13.04-3.92-3.91 10.43-22.17 2.61-27.38-6.52-14.34-8.43v-9.82l13.04-15.65v-15.65l-14.35-16.95 2.61-15.64 11.74-9.13 14.34 2.61 6.52 6.52 9.13-2.61 20.86 1.3 6.52 3.92 11.73-11.74-3.91-10.43 6.13-8.18c1.03.23 1.69.36 1.69.36l15.65 13.03 7.82-2.6 6.52 2.6-2.6 18.26 7.82 10.43-1.2 7.17-.1.65 16.95 16.95z"
            fill={getProvinceColor('chai-nat')}
            stroke={getProvinceStroke('chai-nat')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('chai-nat')}
            onMouseEnter={() => handleMouseEnter('chai-nat')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 11. สุพรรณบุรี (Suphan Buri) */}
          <path
            id="suphanburi-province"
            data-name="Suphan Buri"
            d="M691.25 1839.25v16.95l-6.52 6.52v9.12l-3.13 10.43-.78 2.61-5.27 3.3-15.59 9.74-24.78-2.61-24.77 6.52-16.65 15.54-6.57-4.92-5.47-4.1-5.21-18.25s11.73-11.74 13.04-11.74 1.3-63.89 1.3-63.89l-7.82-9.13 1.3-14.34 6.52-5.21-9.13-14.35-15.64-7.82-9.13-22.17-19.56 9.13-2.61 13.04-13.04 6.52-14.34-5.22-6.52-11.73h-11.73l-16.96-15.65 6.52-10.43-1.3-18.25-6.52-5.22-.17.03 5.39-14.37 7.82-5.22 3.91 5.22h13.04l3.91 15.64h14.35l27.38 10.44 7.82-9.13 15.65 3.91v-.61l14.34 8.43 27.38 6.52 22.17-2.61 3.91-10.43 13.04 3.92 8.54 6.1.59.41 7.66-5.37 10.59 10.59-.83 3.33-1.78 7.1 1.31 9.13-.51 1.52-3.41 10.21 5.22 18.26-3.91 10.43v7.82l-2.61 9.13 2.7 3.47 6.43 8.27.53 5.35.77 7.68z"
            fill={getProvinceColor('suphan-buri')}
            stroke={getProvinceStroke('suphan-buri')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('suphan-buri')}
            onMouseEnter={() => handleMouseEnter('suphan-buri')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 12. สิงห์บุรี (Sing Buri) */}
          <path
            id="singburi-province"
            data-name="Sing Buri"
            d="M734.28 1742.76v26.26l-14.34-4.1-18.26-14.34-7.82 2.61-17.46-5 .51-1.52-1.31-9.13 1.78-7.1.83-3.33-10.59-10.59 5.37-3.75h14.35v-14.35l-6.52-3.91 5.21-5.21h9.13l2.61-7.83 9.2-6.14 1.23 6.14 13.04 7.83 3.91-4.47 6.52 8.38-5.22 11.73 2.61 7.83-5.21 11.73 2.55 4.46z"
            fill={getProvinceColor('sing-buri')}
            stroke={getProvinceStroke('sing-buri')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('sing-buri')}
            onMouseEnter={() => handleMouseEnter('sing-buri')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 13. สระบุรี (Saraburi) */}
          <path
            id="saraburi-province"
            data-name="Saraburi"
            d="m949.42 1734.93-23.47 14.35-13.04 14.34-19.56-5.22-2.6 6.52 5.21 13.04 1.31 16.95-5.22 6.52-1.3 7.83 11.73 11.73-2.61 10.43-5.21 1.31-1.31 6.52 2.61 7.82-7.82 5.21-6.52-5.21-19.56-10.43 1.3 15.64-13.03 11.74-8.88-1.11-1.56-.19v6.95l-13.04 2.17-6.51-2.6-10.44 5.21v-16.95l-9.12-6.52 1.99-8.98.61-2.75-6.51-3.92 2.6-16.95-5.21-6.52 7.82-6.52v-5.21h-14.34l-6.52-2.61-3.91 5.22-14.35-1.31-9.12-9.12 6.18-10.83 2.94.39 8.19-9.67 6.16-7.28 3.91-13.04 14.34-7.82s5.22 2.61 6.52 2.61h11.74l6.52 7.82h7.82l9.13 5.22 16.95-10.43 10.43 5.21 5.21-16.95-2.6-9.13 5.21-5.21 10.43 2.61 7.83-5.22 19.55 1.3 2.61-11.73 11.74-2.61 5.21-6.52 1.31-9.12h9.12z"
            fill={getProvinceColor('sara-buri')}
            stroke={getProvinceStroke('sara-buri')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('sara-buri')}
            onMouseEnter={() => handleMouseEnter('sara-buri')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 14. อ่างทอง (Ang Thong) */}
          <path
            id="ang-thong-province"
            data-name="Ang Thong"
            d="M739.49 1783.18s-3.91 11.73-3.91 13.04 3.91 10.43 3.91 10.43v15.64l-5.21 7.83s-10.43 0-11.74-1.31c-1.3-1.3 1.31-10.43 1.31-10.43l-7.83-3.91-6.52 1.31-9.12 3.91-11.74-2.61-7.29 4.05-.53-5.35-6.43-8.27-2.7-3.47 2.61-9.13v-7.82l3.91-10.43-5.22-18.26 3.41-10.21 17.46 5 7.82-2.61 18.26 14.34 14.34 4.1v1.12l9.13 9.13 1.4.18z"
            fill={getProvinceColor('ang-thong')}
            stroke={getProvinceStroke('ang-thong')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('ang-thong')}
            onMouseEnter={() => handleMouseEnter('ang-thong')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 15. พระนครศรีอยุธยา (Phra Nakhon Si Ayutthaya) */}
          <path
            id="ayutthaya-province"
            data-name="Phra Nakhon Si Ayutthaya"
            d="M809.9 1857.5v16.95l-41.72 23.47-6.52 1.3-7.82 5.22-10.6-2.12-2.44-.49s-5.22 5.22-6.52 5.22c-1.25 0-26.31-1.19-28.53-1.31h-.16l-2.61-3.91-4.31-1.43-3.51-1.18-2.61 2.61h-2.6v-11.73l-14.4-1.92 5.27-3.3.78-2.61 3.13-10.43v-9.12l6.52-6.52v-16.95l-9.13-10.44-.77-7.68 7.29-4.05 11.74 2.61 9.12-3.91 6.52-1.31 7.83 3.91s-2.61 9.13-1.31 10.43c1.31 1.31 11.74 1.31 11.74 1.31l5.21-7.83v-15.64s-3.91-9.13-3.91-10.43c0-1.31 3.91-13.04 3.91-13.04l5.32-3.73 15.21 2.03-6.18 10.83 9.12 9.12 14.35 1.31 3.91-5.22 6.52 2.61h14.34v5.21l-7.82 6.52 5.21 6.52-2.6 16.95 6.51 3.92-.61 2.75-1.99 8.98z"
            fill={getProvinceColor('ayutthaya')}
            stroke={getProvinceStroke('ayutthaya')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('ayutthaya')}
            onMouseEnter={() => handleMouseEnter('ayutthaya')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 16. ปทุมธานี (Pathum Thani) */}
          <path
            id="pathum-thani-province"
            data-name="Pathum Thani"
            d="M839.89 1869.67v3.48l-9.12 7.82v58.68l-.73 4.42h-.02c-3.57.9-18.97 4.7-20.12 4.7-1.3 0-6.52-2.6-6.52-2.6l-5.21 5.21h-26.08l-10.43-9.13H740.8l-10.43-6.52h-15.65l-6.52-5.21-5.22-9.13 2.77-15.65c2.22.12 27.28 1.31 28.53 1.31 1.3 0 6.52-5.22 6.52-5.22l2.44.49 10.6 2.12 7.82-5.22 6.52-1.3 41.72-23.47 10.44-5.21 6.51 2.6z"
            fill={getProvinceColor('pathum-thani')}
            stroke={getProvinceStroke('pathum-thani')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('pathum-thani')}
            onMouseEnter={() => handleMouseEnter('pathum-thani')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 17. นนทบุรี (Nonthaburi) */}
          <path
            id="nonthaburi-province"
            data-name="Nonthaburi"
            d="m754.19 1942.25-9.48 27.39-5.22 7.82s-6.52-2.61-7.82-2.61c-.44 0-3.95 0-8.42-.05l-1.1-.01c-3.58-.06-7.65-.13-11.22-.28l-1.88-.08q-.22-.02-.45-.02l-1.08-.07q-1.04-.05-1.95-.13-.43-.02-.83-.06-.84-.08-1.49-.17c-.85-.13-1.41-.28-1.57-.43-1.3-1.31-14.34-26.08-14.34-26.08l6.52-11.74-6.52-3.91 2.61-29.99h2.6l2.61-2.61 3.51 1.18 4.31 1.43 2.61 3.91h.16l-2.77 15.65 5.22 9.13 6.52 5.21h15.65l10.43 6.52z"
            fill={getProvinceColor('nonthaburi')}
            stroke={getProvinceStroke('nonthaburi')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('nonthaburi')}
            onMouseEnter={() => handleMouseEnter('nonthaburi')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 18. สมุทรปราการ (Samut Prakan) */}
          <path
            id="samut-prakan-province"
            data-name="Samut Prakan"
            d="m837.29 2016.58-15.65 18.25-1.92 10.54-.84-.67h-17.01l-3-1h-16l-15-7.01h-7.01l-4.99 5.01-11 .99-2.01 2.01h-13.48l.99-9.87-2.61-10.43 3.91-3.91 5.22 5.21h6.52l2.6-7.82-1.3-7.82 5.21-5.22 2.61-5.22h5.22l2.61 7.83 7.82 3.91 15.65-1.3 3.91-15.65 30.31 4.73-.32.48 5.88 5.1z"
            fill={getProvinceColor('samut-prakan')}
            stroke={getProvinceStroke('samut-prakan')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('samut-prakan')}
            onMouseEnter={() => handleMouseEnter('samut-prakan')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 19. กรุงเทพมหานคร (Bangkok) */}
          <path
            id="bangkok-province"
            data-name="Bangkok"
            d="m835.98 1972.24-17.93 26.9-30.31-4.73-3.91 15.65-15.65 1.3-7.82-3.91-2.61-7.83h-5.22l-2.61 5.22-5.21 5.22 1.3 7.82-2.6 7.82h-6.52l-5.22-5.21-3.91 3.91 2.61 10.43-.99 9.87h-.51l-2.38.95-2.63 1.05h-4.92l1-11.87-5.22-6.52-2.61-9.13-7.82-7.82-.31-3.47-1-10.87-1.03-1.55-1.57-2.36 2.87-19.13q.65.09 1.49.17.4.04.83.06.91.08 1.95.13l1.08.07q.23 0 .45.02l1.88.08c3.57.15 7.64.22 11.22.28l1.1.01c4.47.05 7.98.05 8.42.05 1.3 0 7.82 2.61 7.82 2.61l5.22-7.82 9.48-27.39h7.47l10.43 9.13h26.08l5.21-5.21s5.22 2.6 6.52 2.6c1.15 0 16.55-3.8 20.12-4.7l-3.17 19.05z"
            fill={getProvinceColor('bangkok')}
            stroke={getProvinceStroke('bangkok')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('bangkok')}
            onMouseEnter={() => handleMouseEnter('bangkok')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 20. สมุทรสาคร (Samut Sakhon) */}
          <path
            id="samut-sakhon-province"
            data-name="Samut Sakhon"
            d="m719.94 2034.83-1 11.87h-19.08l-4.01-2h-6l-1.99 6-8.01 1-8 2-8 3-8.55 2.33-2.45.68-4.63 4.61v-4.72l-9.69-14-2.04-2.95.05-.8 1.25-21.36 6.52-10.43h11.73v-5.22l3.28-.65 16.28-3.26v5.21h6.52l10.43-2.6-3.91-5.22 13.31-2.85 1.03 1.55 1 10.87.31 3.47 7.82 7.82 2.61 9.13z"
            fill={getProvinceColor('samut-sakhon')}
            stroke={getProvinceStroke('samut-sakhon')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('samut-sakhon')}
            onMouseEnter={() => handleMouseEnter('samut-sakhon')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 21. นครปฐม (Nakhon Pathom) */}
          <path
            id="nakhon-pathom-province"
            data-name="Nakhon Pathom"
            d="m701.95 1995.47-13.31 2.85 3.91 5.22-10.43 2.6h-6.52v-5.21l-16.28 3.26-3.28.65v5.22H645.5l-2.49-9.13-9.13-1.31 1.3-11.73h-7.82s-1.31 3.91-3.91 3.91-9.13-3.91-9.13-3.91l6.52-11.74v-9.12l-11.74-2.61-1.3-14.34 6.52-5.22-3.91-2.61-6.94.63.42-.63-6.93-9.53-3.5-4.81 3.91-7.82-3.61-2.72 16.65-15.54 24.77-6.52 24.78 2.61 15.59-9.74 14.4 1.92v11.73l-2.61 29.99 6.52 3.91-6.52 11.74s13.04 24.77 14.34 26.08c.16.15.72.3 1.57.43l-2.87 19.13z"
            fill={getProvinceColor('nakhon-pathom')}
            stroke={getProvinceStroke('nakhon-pathom')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('nakhon-pathom')}
            onMouseEnter={() => handleMouseEnter('nakhon-pathom')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 22. สมุทรสงคราม (Samut Songkhram) */}
          <path
            id="samut-songkhram-province"
            data-name="Samut Songkhram"
            d="M648.22 2059.6v4.72l-2.37 2.38-5.01 1-4.99 8.01-3.16.39-4.85.61v9l-8 4 .09.76-9.52 1.73-5.22 11.74s-6.52 1.3-6.52 0v-20.87l.15-.44 4.91-14.72 2.77-8.31-1.31-16.95 6.52-2.6 10.43 9.12 5.22-5.21 9.18-2.11-.05.8 2.04 2.95z"
            fill={getProvinceColor('samut-songkhram')}
            stroke={getProvinceStroke('samut-songkhram')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('samut-songkhram')}
            onMouseEnter={() => handleMouseEnter('samut-songkhram')}
            onMouseLeave={() => onHoverProvince(null)}
          />

        </g>
      </svg>
    </Box>
  );
}
