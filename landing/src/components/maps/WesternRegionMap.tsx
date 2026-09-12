'use client';
// ============================================================================
// ARCHITECTURE NOTE [ON-DEMAND VECTOR LOADING]:
// คอมโพเนนต์นี้เก็บ SVG Vector Paths สำหรับภาคตะวันตก (5 จังหวัด)
// ปัจจุบันระบบหลักได้ปิดการโหลดเวกเตอร์ทั้งหมดในโค้ดไว้ชั่วคราว (Suspended from initial render)
// เพื่อเตรียมพร้อมสำหรับการดึงทีละภาพแบบไดนามิกจาก MongoDB Atlas ผ่าน /api/provinces/vectors/[slug]
// ============================================================================

import React from 'react';
import Box from '@mui/material/Box';
import { Province, getProvinceByIdOrSlug } from '@/data/thailandProvinces';

interface WesternRegionMapProps {
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

export default function WesternRegionMap({
  selectedProvinceId,
  hoveredProvinceId,
  visitedProvinceIds = [],
  onSelectProvince,
  onHoverProvince
}: WesternRegionMapProps) {
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

    if (isSelected) return '#9333ea'; // สีม่วงสดใสประจำภาคตะวันตกเมื่อคลิกเลือก
    if (isHovered) return '#c084fc';  // ม่วงสว่างตอน hover
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

    if (isSelected) return '#7e22ce';
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
        viewBox="829 472 544 1591"
        className="w-full h-auto"
        style={{
          maxHeight: '560px',
          margin: '0 auto',
          display: 'block',
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.06))',
          transition: 'all 0.3s ease'
        }}
      >
        <g id="Western">
          {/* 1. ตาก (Tak) */}
          <path
            id="tak-province"
            data-name="Tak"
            d="m1223.37 703.37-.68 1.09-5.84 9.34h-15.65l-1.3 13.04h-14.35l-5.21 7.82 2.61 9.13-13.04 24.77v22.17h-10.43l-18.26 15.65h-16.95l-6.52-5.22-3.91 2.61v5.21l6.52 7.83s-1.3 7.82-1.3 9.13c0 1.3 9.12 5.21 9.12 5.21l-2.61 22.17 7.83 13.04-7.83 15.64 7.83 2.61 7.82 15.65s-9.13 20.86-9.13 22.16 3.92 9.13 3.92 9.13l-.37 5.45-.86 13.01-.08 1.1 11.74 10.43v18.26l-7.83 7.82v18.25l-11.73 6.52 1.3 7.83 5.22 9.12-5.22 7.83 2.61 16.95-6.52 10.43 1.3 11.73-6.51 9.13-2.61 24.77-11.74-22.16-13.04-3.91-2.6-10.43-26.08-27.39v-10.43c0-.22-.3-.54-.8-.95-2.44-1.97-9.63-5.57-9.63-5.57l1.3-6.52-15.65-22.16h-9.12l-5.22-6.52-6.57-1.32-1.68-9.47.75-2.2 13.25-38.8h-4.99l-2.01-10 6-13-10.99-14.01 5.99-8 7.01 8.99 1.99-5.99 8.01-1.01v-10l8-6 20 2.01 4.01 6 8.99-7 1.01-22.01 13-7 1-11 5-3.01-6-6 1.99-8.99-8.99-9.01-13 1-9.01 17-9-1-7 19.01-7-1-3-18.01-4.01-2 3-10-6-1.99 6-11.01-17.99-22.01 1.99-8.99-8-11.01h-9l1-11-10-6-1-9 8.01-10-1.01-11 7.99-9.01v-8l-10.99-8-1-9-13-13h-17l-9.01-10.01-1-12-40.01-39.01v-17h-6l-9-9 .99-6-13-14h-5.99l-11.01-9.01-.99-7-32.01-32 1-7-4.92-6.99 5.26-3.02 9.13 2.61 14.34-2.61 6.52-6.51v-9.13h13.04l9.13 18.25s5.21 20.86 5.21 22.17c0 .87 7.63 7.03 12.65 10.99l-.91.74s10.43 19.56 11.73 20.87c1.31 1.3 14.35 2.6 15.65 1.3s9.13-6.52 9.13-6.52h10.43l3.91 11.74 2.61 20.86-6.52 2.61v5.21l6.52 6.52-1.3 13.04 9.12 5.22 2.61 7.82 9.13 1.3 9.13-6.52 20.86-2.6 2.61-11.74-5.22-9.13 3.91-11.73-7.82-13.04 3.91-16.95-1.3-20.86-9.13-35.21 3.91-6.52 5.22 2.61s6.52 5.21 7.82 5.21 5.21-3.91 5.21-3.91l6.52 6.52 2.61-6.52 6.52-5.21 5.22 7.82 1.09.09-1.09 3.82 13.04 16.95-1.31 6.52h-7.82l-3.91 3.91v15.65l3.91 18.26-3.91 16.95s11.73-3.92 13.04-5.22 19.55-10.43 19.55-10.43l10.44 5.22 7.9-9.5 3.83 13.41h9.13l22.16 23.47h9.13l5.22 6.52h9.12l9.13-14.35h9.13v7.83l5.21 20.86 7.49 3.21-.97 28.08 2.61 11.74h7.83l7.82 3.91-2.61 9.13 10.43 13.04h5.22l1.98 4.35z"
            fill={getProvinceColor('tak')}
            stroke={getProvinceStroke('tak')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('tak')}
            onMouseEnter={() => handleMouseEnter('tak')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 2. กาญจนบุรี (Kanchanaburi) */}
          <path
            id="kanchanaburi-province"
            data-name="Kanchanaburi"
            d="m1310.73 1384-.42.63-17.84 26.76-14.34 1.3-14.34-6.52s-13.04 15.65-14.34 16.95-22.17 1.3-22.17 1.3l-9.13-6.52-15.65 9.13h-15.64l-11.74 3.91-10.43-1.3-13.04 8.15v-5.35l-11-9.01.99-14h-3.99v-13.99h-6.01s-2-8.01-12-10.02c-1-2.99-5-18.99-5-18.99l-8-3v-13l-20-5.01v-7l-34.02-21.01-1.99-5.99-25.01-14.01v-11l-5 1-17-39.01-9.01 2.01v-12.01s-3.99-9-26-25c-9-8-20-32.01-20-32.01l1.99-7-4.99-5v-5l3-4-3-9-5.01-2.01v-4.99l5.01-10-12.01-15.01 7-18.01-2.99-10.99h14s6-7 9-10v-7s15 .99 22.01 10.99c3.52-2.35 4.62-2.96 4.95-3.09l-6.95-13.92 4.99-7.99h7.01l13-4 12.01 10 5.99-6v-31l-6.32-35.55 6.57 1.32 5.22 6.52h9.12l15.65 22.16-1.3 6.52s7.19 3.6 9.63 5.57c.5.41.8.73.8.95v10.43l26.08 27.39 2.6 10.43 13.04 3.91 11.74 22.16 1.3 20.87 13.04 5.21 13.04-2.6 6.52 6.51 6.39-1.06 1.43-.24 11.74 7.82 7.65-1.27.17-.03 6.52 5.22 1.3 18.25-6.52 10.43 16.96 15.65h11.73l6.52 11.73 14.34 5.22 13.04-6.52 2.61-13.04 19.56-9.13 9.13 22.17 15.64 7.82 9.13 14.35-6.52 5.21-1.3 14.34 7.82 9.13s0 63.89-1.3 63.89c-1.31 0-13.04 11.74-13.04 11.74l5.21 18.25 5.47 4.1 6.57 4.92 3.61 2.72-3.91 7.82 3.5 4.81z"
            fill={getProvinceColor('kanchanaburi')}
            stroke={getProvinceStroke('kanchanaburi')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('kanchanaburi')}
            onMouseEnter={() => handleMouseEnter('kanchanaburi')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 3. ราชบุรี (Ratchaburi) */}
          <path
            id="ratchaburi-province"
            data-name="Ratchaburi"
            d="M1352.34 1451.81h-1.19l-6.52 10.43-1.25 21.36-9.18 2.11-5.22 5.21-10.43-9.12-6.52 2.6 1.31 16.95-2.77 8.31-4.91 14.72-24.92-2.16-18.26 14.34-1.3 16.95-15.65 1.3-11.73-2.6s-7.82 6.52-9.13 6.52h-11.73l-15.65-11.74-6.52-1.3-2.61 6.52-3.91 13.04h-9.13l-10.43-11.74-3.08-1.03.04-.01-4-8.01.99-4 3.01-1.01v-3.99l-5-2v-5l3-6.01.06-2.24.94-29.76-5.01-4 2.01-13-6-6.01 3-.99v-4l-3-1.01v-23.65l13.04-8.15 10.43 1.3 11.74-3.91h15.64l15.65-9.13 9.13 6.52s20.86 0 22.17-1.3c1.3-1.3 14.34-16.95 14.34-16.95l14.34 6.52 14.34-1.3 17.84-26.76 6.94-.63 3.91 2.61-6.52 5.22 1.3 14.34 11.74 2.61v9.12l-6.52 11.74s6.52 3.91 9.13 3.91c2.6 0 3.91-3.91 3.91-3.91h7.82l-1.3 11.73 9.13 1.31z"
            fill={getProvinceColor('ratchaburi')}
            stroke={getProvinceStroke('ratchaburi')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('ratchaburi')}
            onMouseEnter={() => handleMouseEnter('ratchaburi')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 4. เพชรบุรี (Phetchaburi) */}
          <path
            id="phetchaburi-province"
            data-name="Phetchaburi"
            d="m1357.68 1591.47-11.99 16.01-1.01 13-5.5 12.54-12.5 28.47 1.39 14.6.67 5.5-14.1 1.01-5.22 3.91-10.43-2.61-18.25 2.61-9.13 2.61-10.43-9.13h-6.52l-2.61 13.04-10.43 2.6-13.04 1.31-5.21-5.22-11.71 2.13v-.37l-4-7h-8l-3.34-3.6-9.67-10.39h-7.99l-1.01-10.01-11-.99-2-23.02-10-4.99 2-14.01-7.01-4 8.01-6v-8.99l-21-19.01 7-4.01v-17l-4.01-2 6-5.99 6.01-1.01 5 4.01 4.96-2.99 3.08 1.03 10.43 11.74h9.13l3.91-13.04 2.61-6.52 6.52 1.3 15.65 11.74h11.73c1.31 0 9.13-6.52 9.13-6.52l11.73 2.6 15.65-1.3 1.3-16.95 18.26-14.34 24.92 2.16-.15.44v20.87c0 1.3 6.52 0 6.52 0l5.22-11.74 9.52-1.73.91 8.24 14 19.01 8.01 3s-2.01 17-1.01 17.99c1.01 1.01 9 11.01 9 11.01z"
            fill={getProvinceColor('phetchaburi')}
            stroke={getProvinceStroke('phetchaburi')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('phetchaburi')}
            onMouseEnter={() => handleMouseEnter('phetchaburi')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 5. ประจวบคีรีขันธ์ (Prachuap Khiri Khan) */}
          <path
            id="prachuap-khiri-khan-province"
            data-name="Prachuap Khiri Khan"
            d="m1342.69 1779.5-13 10-4.01 14.01-23.01 21-6 19.01 5.01 13-7 5-1.01 13.01s-14 16-16 17c-2 .99-36.01 78.01-36.01 78.01l2.01 13s-2.01 11.01-2.01 12-16 13.01-16 13.01v8l4.01 4-.66 16.17-12.16 13.27-10.43 3.91-7.83-3.91-19.56 3.91s-26.07-13.04-26.07-14.34v-7.5l4.69-2.5.99-8.01 11.01-5.99v-8.01l7-7v-9l14-14-1-11.01 18.01-12.01-2-16 11.01-4 4.99-13v-16l9-6h3.01l.99 3.99 8-1.99 8.01-18.01 9-4v-10l1.99-9-8.99-7-1.01-8.01h-4v-24.99l-10.99-5.01-1.01-11.99 8.01-14.01-1.01-3-20 3.99 1.01-7 3.99-7-5-6v-9l3-3-12.01-15 2.01-13-9.01-13 7-10-1.99-7.01v-5.64l11.71-2.13 5.21 5.22 13.04-1.31 10.43-2.6 2.61-13.04h6.52l10.43 9.13 9.13-2.61 18.25-2.61 10.43 2.61 5.22-3.91 14.1-1.01 6.95 56.9v30.01z"
            fill={getProvinceColor('prachuap-khiri-khan')}
            stroke={getProvinceStroke('prachuap-khiri-khan')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('prachuap-khiri-khan')}
            onMouseEnter={() => handleMouseEnter('prachuap-khiri-khan')}
            onMouseLeave={() => onHoverProvince(null)}
          />

        </g>
      </svg>
    </Box>
  );
}
