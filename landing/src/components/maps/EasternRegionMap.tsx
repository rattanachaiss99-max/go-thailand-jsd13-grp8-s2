'use client';
// ============================================================================
// ARCHITECTURE NOTE [ON-DEMAND VECTOR LOADING]:
// คอมโพเนนต์นี้เก็บ SVG Vector Paths สำหรับภาคตะวันออก (7 จังหวัด)
// ปัจจุบันระบบหลักได้ปิดการโหลดเวกเตอร์ทั้งหมดในโค้ดไว้ชั่วคราว (Suspended from initial render)
// เพื่อเตรียมพร้อมสำหรับการดึงทีละภาพแบบไดนามิกจาก MongoDB Atlas ผ่าน /api/provinces/vectors/[slug]
// ============================================================================

import React from 'react';
import Box from '@mui/material/Box';
import { Province, getProvinceByIdOrSlug } from '@/data/thailandProvinces';

interface EasternRegionMapProps {
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

export default function EasternRegionMap({
  selectedProvinceId,
  hoveredProvinceId,
  visitedProvinceIds = [],
  onSelectProvince,
  onHoverProvince
}: EasternRegionMapProps) {
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

    if (isSelected) return '#ea580c'; // สีส้มสดใสประจำภาคตะวันออกเมื่อคลิกเลือก
    if (isHovered) return '#fb923c';  // ส้มสว่างตอน hover
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

    if (isSelected) return '#c2410c';
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
    <Box sx={{ width: '100%', position: 'relative' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="2955 893 528 703"
        className="w-full h-auto"
        style={{
          maxHeight: '560px',
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.06))',
          transition: 'all 0.3s ease'
        }}
      >
        <g id="Eastern">
          {/* 1. ตราด (Trat) */}
          <path
            id="trat-province"
            data-name="Trat"
            d="M3414.23 1402.54s11.99-8 13-9.01c1-.99 1-5.97 1-6 0 0-14-13-15.01-13s1.01-7 1.01-7l-12.01-7-4.99-13s-4.46-3.27-8.52-6.4l-.62-.5q-.32-.23-.63-.48c-1.63-1.28-3.1-2.48-4.08-3.34l-.34-.31c-.52-.48-.82-.84-.82-.98 0-.99-10 1-10 1l-8.01-7-.99-13 .64-.96h-9.51s-18.25 13.04-16.95 14.34 2.61 16.95 2.61 16.95l-5.21 3.91-11.74 6.52-1.3 10.43 2.6 10.44v11.73l9.13 6.52-3.91 5.22-.07.33 4.7 6.59-9 11-11 2 .71 3.38 3.29 15.63h20l5.01 7h17l10.99 13-.99 7 14.01 8-5.01-9v-24.01l8.01-5.99 12.99 11.99-5.99 4.01 27.93 28.6 3.91 23.47 27.38 36.51-26.08-49.55c-.08-.15-1.3-10.24-1.3-10.43l-1.84-13.6-14-22.01zm-79.43 66.88v10.43l5.21 7.82 1.3 18.26s11.74 7.82 14.35 7.82 9.13-2.61 9.13-2.61l-5.22-7.82 3.91-1.3 7.82 7.82v-6.52l-13.03-22.17-9.13-9.12z"
            fill={getProvinceColor('trat')}
            stroke={getProvinceStroke('trat')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('trat')}
            onMouseEnter={() => handleMouseEnter('trat')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 2. จันทบุรี (Chanthaburi) */}
          <path
            id="chanthaburi-province"
            data-name="Chanthaburi"
            d="m3371.21 1304.51-7.35 11.05h-9.51s-18.25 13.04-16.95 14.34 2.61 16.95 2.61 16.95l-5.21 3.91-11.74 6.52-1.3 10.43 2.6 10.44v11.73l9.13 6.52-3.91 5.22-.07.33-.3-.41s-5 8.99-6.01 8.99c-.99 0-7.99-4.99-7.99-4.99l3-6-8.01-11-4 4v4.99l9.01 16.02h-7l-41.01-39.02-10-8.99-15.01-1.01-10-13-9.7-10.59-1.3-1.42-15.72-10.23 2.85-8.52 6.52-23.47-7.83-22.16h-9.12l-5.22-7.83 5.22-13.04-11.74-3.91-2.61-22.16 2.3-4.14.77-1.39 3.45-6.21 2.81-.29 10.23-1.01 9.13-9.13 9.13 3.91 9.12-3.91v-10.43l19.56-10.43 5.31 9.1 3.82 6.55 14.34-2.61 7.83-14.35 11.73 2.61 5.22 13.04 11.73 1.31 9.13-9.13 11.13 1.01 3.93 9.8-.99 13 10 16.01 3.19 2.03 7.8 4.97s6.01 14 7 15c1.01 1 9.01 4 9.01 4l-10 6 6 17-2.01 12.01z"
            fill={getProvinceColor('chanthaburi')}
            stroke={getProvinceStroke('chanthaburi')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('chanthaburi')}
            onMouseEnter={() => handleMouseEnter('chanthaburi')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 3. สระแก้ว (Sa Kaeo) */}
          <path
            id="sa-kaeo-province"
            data-name="Sa Kaeo"
            d="m3455.24 1027.46-10 3.01s-20.01 19-20.01 20.01c0 .99-1 13-1 13l-10 13v8l-28.01 9-10 15.01 13 11-8.01 3-4.99 4.99-10 3-22.01-.99-10-5.01-7.99 11.01 7 6-3.01 51.01.07.2-11.13-1.01-9.13 9.13-11.73-1.31-5.22-13.04-11.73-2.61-7.83 14.35-14.34 2.61-3.82-6.55-5.31-9.1v-15.65l-6.52-5.21-3.91-11.74h-9.13l-3.16-10.53-.75-2.51 5.92-9.87 9.73-16.21 1.3-32.59-7.82-15.65-2.61-16.95 10.43-5.22-6.52-18.25h31.3v-15.65l7.95-9.4 6.39 4.19 15.41-9 .24-.13 20.86 9.13 32.1-8.32 4.41 4.4h18.25l13.04-7.82 11.74 1.31 7.82 6.51h13.04l7.82-6.51h15.65l16.45-2.74-.23.7 3 8.01s-8.01 7.99-9.01 10c-.99 1.99 2.01 17.99 2.01 17.99z"
            fill={getProvinceColor('sa-kaeo')}
            stroke={getProvinceStroke('sa-kaeo')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('sa-kaeo')}
            onMouseEnter={() => handleMouseEnter('sa-kaeo')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 4. ระยอง (Rayong) */}
          <path
            id="rayong-province"
            data-name="Rayong"
            d="m3214.84 1297.3-6.52 23.47-2.85 8.52-7.28-4.76-10 1.99-12.01 12.01h-17.01l-1.99 5h-11.01l-1.99-3h-12.01l-3 10-8.01-1.01-8.99-7.99-13.99-4.67-7.02-2.33-31-1-6-3-9 1.99-1 3-14.54 1.94-2.54-10.17 10.43-14.34-2.61-9.13 10.43-6.52 9.13-24.77-3.91-13.04 1.3-7.82 10.43 3.91 9.13-7.82 2.61-7.83 18.25 3.91 14.34-3.91 11.74 13.04 32.6-7.82 10.43-16.95 11.73-6.52 12.73 2.38-2.3 4.14 2.61 22.16 11.74 3.91-5.22 13.04 5.22 7.83h9.12z"
            fill={getProvinceColor('rayong')}
            stroke={getProvinceStroke('rayong')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('rayong')}
            onMouseEnter={() => handleMouseEnter('rayong')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 5. ชลบุรี (Chon Buri) */}
          <path
            id="chonburi-province"
            data-name="Chon Buri"
            d="m3192.87 1216.17-2.81.29-3.45 6.21-.77 1.39-12.73-2.38-11.73 6.52-10.43 16.95-32.6 7.82-11.74-13.04-14.34 3.91-18.25-3.91-2.61 7.83-9.13 7.82-10.43-3.91-1.3 7.82 3.91 13.04-9.13 24.77-10.43 6.52 2.61 9.13-10.43 14.34 2.54 10.17-.47.07-3 13-3-2-6-1 1.01-10-16.01-2.01 1-22 9-5 2-17.01-11-11 1.99-13 12.01-7.99-1-10-7-9.01v-9l11-19.01-6-16-1-8.01 4-5.99 11.01-6 .65-14.31.12-2.67 8.58-12.16 10.43-5.22-2.61-10.43 18.25-6.52 22.17 3.91 26.08 23.47 37.81 11.74 6.52 19.55 24.78 13.04z"
            fill={getProvinceColor('chon-buri')}
            stroke={getProvinceStroke('chon-buri')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('chon-buri')}
            onMouseEnter={() => handleMouseEnter('chon-buri')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 6. ฉะเชิงเทรา (Chachoengsao) */}
          <path
            id="chachoengsao-province"
            data-name="Chachoengsao"
            d="M3250.04 1169.52v15.65l-19.56 10.43v10.43l-9.12 3.91-9.13-3.91-9.13 9.13-10.23 1.01-11.93-19.27-24.78-13.04-6.52-19.55-37.81-11.74-26.08-23.47-22.17-3.91-18.25 6.52 2.61 10.43-10.43 5.22-8.58 12.16.22-5.03-2-6-4.76 3.96-1.23 1.05-10.01-1.01-8.16-6.33 1.92-10.54 15.65-18.25-13.68-11.86-5.88-5.1.32-.48 17.93-26.9-9.13-9.12 3.17-19.05h.02l.73-4.42 13.34-3.64.36-.11.64-.17 32.34 1.24 1.56.07 6.52 7.82-2.61 6.52 1.31 10.43 11.73-6.52 7.82 5.22 24.78-1.31 5.21 5.22 20.87 6.52s9.12 9.13 10.43 9.13h9.13l10.43 10.43s13.04-2.61 14.34-2.61 15.65-5.22 15.65-5.22l10.43 7.83 2.61 7.82h7.82v6.52l-2.61 3.91 2.61 6.52 7.82 2.61 5.92 10.99-5.92 9.87.75 2.51 3.16 10.53h9.13l3.91 11.74z"
            fill={getProvinceColor('chachoengsao')}
            stroke={getProvinceStroke('chachoengsao')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('chachoengsao')}
            onMouseEnter={() => handleMouseEnter('chachoengsao')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 7. ปราจีนบุรี (Prachin Buri) */}
          <path
            id="prachinburi-province"
            data-name="Prachin Buri"
            d="m3276.25 999.74-7.95 9.4v15.65H3237l6.52 18.25-10.43 5.22 2.61 16.95 7.82 15.65-1.3 32.59-9.73 16.21-5.92-10.99-7.82-2.61-2.61-6.52 2.61-3.91v-6.52h-7.82l-2.61-7.82-10.43-7.83s-14.35 5.22-15.65 5.22-14.34 2.61-14.34 2.61l-10.43-10.43h-9.13c-1.31 0-10.43-9.13-10.43-9.13l-20.87-6.52-5.21-5.22-24.78 1.31-7.82-5.22-11.73 6.52-1.31-10.43 2.61-6.52-6.52-7.82-1.56-.07 2.86-6.45 10.44-2.61 5.21-9.13 24.78-2.6-6.52-16.96 9.12-13.03 15.65-2.61v-5.22l-5.22-2.61 1.31-6.51 14.34 1.3 10.43-2.61v-15.65l-14.34-10.43 2.61-11.73 1.46-.63 7.66-3.28 9.13 5.21 16.95-1.3 24.78 26.08 9.12-9.13h11.74l10.43 9.13H3237l3.91 19.55z"
            fill={getProvinceColor('prachin-buri')}
            stroke={getProvinceStroke('prachin-buri')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('prachin-buri')}
            onMouseEnter={() => handleMouseEnter('prachin-buri')}
            onMouseLeave={() => onHoverProvince(null)}
          />
        </g>
      </svg>
    </Box>
  );
}
