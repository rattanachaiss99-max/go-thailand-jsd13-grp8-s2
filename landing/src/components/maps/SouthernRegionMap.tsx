'use client';
// ============================================================================
// ARCHITECTURE NOTE [ON-DEMAND VECTOR LOADING]:
// คอมโพเนนต์นี้เก็บ SVG Vector Paths สำหรับภาคใต้ (14 จังหวัด)
// ปัจจุบันระบบหลักได้ปิดการโหลดเวกเตอร์ทั้งหมดในโค้ดไว้ชั่วคราว (Suspended from initial render)
// เพื่อเตรียมพร้อมสำหรับการดึงทีละภาพแบบไดนามิกจาก MongoDB Atlas ผ่าน /api/provinces/vectors/[slug]
// ============================================================================

import React from 'react';
import Box from '@mui/material/Box';
import { Province, getProvinceByIdOrSlug } from '@/data/thailandProvinces';

interface SouthernRegionMapProps {
  selectedProvinceId?: string;
  hoveredProvinceId?: string | null;
  visitedProvinceIds?: string[];
  onSelectProvince: (province: Province) => void;
  onHoverProvince: (province: Province | null) => void;
}

export default function SouthernRegionMap({
  selectedProvinceId,
  hoveredProvinceId,
  visitedProvinceIds = [],
  onSelectProvince,
  onHoverProvince
}: SouthernRegionMapProps) {
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

    if (isSelected) return '#2563eb'; // สีน้ำเงินสดใสประจำภาคใต้เมื่อคลิกเลือก
    if (isHovered) return '#60a5fa';  // น้ำเงินสว่างตอน hover
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

    if (isSelected) return '#1d4ed8';
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
        viewBox="3072 1592 576 1307"
        className="w-full h-auto"
        style={{
          maxHeight: '560px',
          margin: '0 auto',
          display: 'block',
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.06))',
          transition: 'all 0.3s ease'
        }}
      >
        <g id="Southern">
          {/* 1. ระนอง (Ranong) */}
          <path
            id="ranong-province"
            data-name="Ranong"
            d="m3453.88 1697.85.5 6.51-4.21 6.59-11.52 3.48-4.91 7.69-12.52 7.48-3.8 8.39-10.32 8.89-7.21 1.58-1.41 2.2 6.59 4.21 2.3 6.11-3.51 5.49-16.3-1.13-6.41 5.19-5.49-3.51-9.1-2.72-18.22 11.57-24.11 6.25-1.93 12.7-7.41 9.19 4.01 7.53 6.88 12.91.37.68-3.73 13.1-10.8 2.38-4.61 4.79-11.2.57-10.1 1.29-3.51 5.49 2.29 6.11-4.22 6.6-8.79-5.62-1.58-7.21-6.59-4.21-13.01 5.09-3.5 1.38-8.46-6.83-.74-.59 4.61-4.79-2.99-5.01-7.08-3.49 9.25-5.96 12.87-8.27 5.85-12.87 10.76-3.82 1.03 11.35 12.52.86 8.44-7.64-10.56-15.05 16.78-5.45 4.18-1.35 4.85-7.59-1.29-9.13 7.75-.98 1.86-4.75 2.31-9.21 20.41-5.94 4.17-13.95 29.41-14.45 4.54-8.96 13.28-2.21 34.41-27.86s20.35-9.56 21.19-9.02c.85.55 5.93-9.27 5.93-9.27l-.14-7.21 4.61-5.36-2.13-9.66 8.68-9.88 24.8-9.09 4.62 2.44-.11 8.83-7.11 6.28 3.38 6.81-4.03 15.99-5.31 5.9-1.62 9.79-23.41 5.15-4.51 9.51z"
            fill={getProvinceColor('ranong')}
            stroke={getProvinceStroke('ranong')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('ranong')}
            onMouseEnter={() => handleMouseEnter('ranong')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 2. ชุมพร (Chumphon) */}
          <path
            id="chumphon-province"
            data-name="Chumphon"
            d="m3620.2 1676.32-5.76 3.44-6.2-5.15-6.91 1.53-16.6 16.69-16.21 8.63-7.57-4.84-9.37 3.51-14.68 15.56-18.34-1.05 2.74 12.44-2.69 4.21 2.14 9.68s-5.38 8.42-6.24 7.88l-9.26-5.92-1.23-5.53-11.49-6.16-5.93 9.28-4.68 1.75-.08 9.43 5.05 3.23 1.9 11.91-26.96 12.44-5.38 8.43 3.51 9.38-13.13 9.4-15.55 28.06-4.99.36-8.08 12.65-2.68 9.93-19.92-12.73-7.29-3.12-10.5-.51-6.28-7.11-1.69-11.91-7.68-4.91-7.91 2.68-7.69-4.91-8.31.88-5.61 8.79-6.87-.19-6.88-12.91-4.01-7.53 7.41-9.19 1.93-12.7 24.11-6.25 18.22-11.57 9.1 2.72 5.49 3.51 6.41-5.19 16.3 1.13 3.51-5.49-2.3-6.11-6.59-4.21 1.41-2.2 7.21-1.58 10.32-8.89 3.8-8.39 12.52-7.48 4.91-7.69 11.52-3.48 4.21-6.59-.5-6.51-4.08-5.69 4.51-9.51 23.41-5.15 1.62-9.79 5.31-5.9 4.03-15.99-3.38-6.81 7.11-6.28.11-8.83 6.03 3.19 6.54-6.52 4.29 6.31 16.34-1.43 1.16-11.13 14.51-9.71 2.13 9.67 9.45.09 7.06-7.36 11.65.93-4.03 6.32c-.7 1.1 14.24 26.12 14.24 26.12l18.59 7.24 4.49 7.51 10.9 2.32 17.39-4.63-5.05 7.26-7.37 5.96z"
            fill={getProvinceColor('chumphon')}
            stroke={getProvinceStroke('chumphon')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('chumphon')}
            onMouseEnter={() => handleMouseEnter('chumphon')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 3. พังงา (Phang Nga) */}
          <path
            id="phang-nga-province"
            data-name="Phang Nga"
            d="m3203.42 2005.12-17.04 16.96-2.38.31-7.72.98-.91 8.69-6.87 3.71-6.68-4.27-11.83 5.51-2.05-.59-28.08-7.98.99 7.74-5.15 6.21-.94 8.9-13.21 5.8-4.83-5.45-8.05-.4 1.72-11.96-9.11-11.76 9.69-15.17 15.36-51.91 3.82 10.75 3.3-1.45.02-13.04 10.24-16.01 31.58-30.86 1.71-11.97 16.9-15.3 6.73 17.35 5.89 3.76 4.31-6.74-4.96-12.66s13.74-6.65 13.98-8.88c.24-2.22.25-15.27.25-15.27l6.53-6.5 10.58 2.01 2.8-13.64 12.13-7.81 7.08 3.49 2.99 5.01-4.61 4.79.74.59 8.46 6.83 3.5-1.38-.52 6.38-7.42 9.2-12.91 5.67-9.91 10.68-2.32 10.89-7.21 1.59-3.32 14.9-13.41-.83-6.22 14.59 11.87 15.33-2.32 10.89 7.39 7.82-13.83 14.38-14.4 3.17 1.97 9 6.6 4.22 10.5.51 6.59 4.21z"
            fill={getProvinceColor('phang-nga')}
            stroke={getProvinceStroke('phang-nga')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('phang-nga')}
            onMouseEnter={() => handleMouseEnter('phang-nga')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 4. กระบี่ (Krabi) */}
          <path
            id="krabi-province"
            data-name="Krabi"
            d="m3259.76 2205.12-13.23 8.59-1.68-.39-15.32-3.53-1.88-.42-.92 8.7-10.8 2.38-1.23 11.59-9.83 15.39-8.64 1.31-.35-6.75-5.69-5.47-1.66-1.61-4.5-17.1 5.09-9.82-4.46-.47s-12.28 9.95-13.67 10.27c-1.38.29-10.12-6.47-10.41-7.85-.31-1.39 4.4-16.18 5.78-16.49q.17-.04.59-.25l1.96-11.17 3.77-5.91c.54-.84 4.22 2.7 4.22 2.7l-4.31 6.75 1.35 3.58c5.38-3.26 11.62-7.16 11.62-7.16l10.38-8.81-2.3-3.84-11.52 6.89-4.11-12.14-7.06-5.69 11.38-14.1-8.81-10.37-14.41.29-2.14-9.68-6.2-5.14-.45-8.59 15.08-23.61-2.13-9.67 4.87-20.62-9.9 4.36-5.36-4.62 7-10.96 11.36-1.05-2.67-8.83-.07-.04 6.87-3.71.91-8.69 7.72-.98 2.38-.31 17.04-16.96-.42-1.89 6.52-.4 6.51-.49 5.57 8.21 11.21-.58 10.68 9.92-6.23 14.59 3.39 6.8-17.55 27.48 11.75 27.62 18.68 11.93 9.07 19.73 8.35 2.79 1.84.62 4.27 15.11-11.51 3.48-1.31 6.9-8.3.88-4.52 9.49s17.19 9.44 17.58 11.23c.4 1.81-9.24 26.58-9.24 26.58z"
            fill={getProvinceColor('krabi')}
            stroke={getProvinceStroke('krabi')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('krabi')}
            onMouseEnter={() => handleMouseEnter('krabi')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 5. ภูเก็ต (Phuket) */}
          <path
            id="phuket-province"
            data-name="Phuket"
            d="M3104.92 2089.52 c 0.75 -0.85 0.00 -8.50 0.00 -8.50l-4.50 0.85-3.00 1.70-3.01-5.95s -3.75 -0.85 -4.50 -0.85 -0.75 -6.81 -1.50 -7.66 -4.50 -6.80 -4.50 -6.80l-2.25 4.25 2.25 5.95-3.75 11.06 3.75 8.50-3.75 11.05 2.25 8.50v 17.01l 1.50 4.25s 0.75 5.95 1.50 5.95h 3.75c 0.75 0.00 3.75 -9.35 3.75 -9.35l 15.01-10.20s -6.75 -12.76 -6.75 -14.46 3.00 -14.45 3.75 -15.30zm 18.00-10.20v 9.35l 7.50 7.65v 4.25l-2.25 3.40 1.50 7.65 2.25 1.70c 0.75 0.00 2.26 -2.55 2.26 -2.55v-19.55l-2.26-4.25zm 11.26-9.36-3.01 5.11v 2.55h 4.51l 1.50-7.66-1.50-1.70z"
            fill={getProvinceColor('phuket')}
            stroke={getProvinceStroke('phuket')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('phuket')}
            onMouseEnter={() => handleMouseEnter('phuket')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 6. สุราษฎร์ธานี (Surat Thani) */}
          <path
            id="surat-thani-province"
            data-name="Surat Thani"
            d="m3462.39 2023.59-10.1 1.28-2.72 9.1 7.39 7.82-5.61 8.78-9.8-1.62-8.83 11.38-14.4 3.18-17.88-8.33-10.41 4.18-11.73 11.07-13.82 14.38-20.12 7.26-8.11 10.29-12.71-1.92-9.61 7.78-23.99-6.04-17.51 10.47-1.48 18.18-8.35-2.79-9.07-19.73-18.68-11.93-11.75-27.62 17.55-27.48-3.39-6.8 6.23-14.59-10.68-9.92-11.21.58-5.57-8.21-6.51.49-6.52.4-1.57-7.12-6.59-4.21-10.5-.51-6.6-4.22-1.97-9 14.4-3.17 13.83-14.38-7.39-7.82 2.32-10.89-11.87-15.33 6.22-14.59 13.41.83 3.32-14.9 7.21-1.59 2.32-10.89 9.91-10.68 12.91-5.67 7.42-9.2.52-6.38 13.01-5.09 6.59 4.21 1.58 7.21 8.79 5.62 4.22-6.6-2.29-6.11 3.51-5.49 10.1-1.29 11.2-.57 4.61-4.79 10.8-2.38 3.73-13.1-.37-.68 6.87.19 5.61-8.79 8.31-.88 7.69 4.91 7.91-2.68 7.68 4.91 1.69 11.91 6.28 7.11 10.5.51 7.29 3.12 19.92 12.73-2.49 9.31-.65 23.32-8.86 15.71 3.79 23.79s-15.57-1.63-18.02.35c-2.46 1.99-11.51 6.88-11.51 6.88l-1.11 14.72 2.07 6.07 14.39 12.75-3.46 7.3 13.58-.83s5.12 6.85 6.27 8.76 14.73 1.09 14.73 1.09l8.44-7.64 6.44 2.92 2.06 6.07 3.99 1.18 2.99.89 14.96-1.11 16.86 10.77 1.66 3.33-5.04 7.9-6.51.48z"
            fill={getProvinceColor('surat-thani')}
            stroke={getProvinceStroke('surat-thani')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('surat-thani')}
            onMouseEnter={() => handleMouseEnter('surat-thani')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 7. ตรัง (Trang) */}
          <path
            id="trang-province"
            data-name="Trang"
            d="m3263.69 2407.25-2.63 13.79-5.58-8.21s-5.8 1.28-12.97 1.94c-6.66.61-14.5.69-19.94-1.3a27.5 27.5 0 0 1-12.95-10.11l9.06-2-11.56-9.77.12-3.09.61-16.62-5.7 7.05-8.05-.39-.26-27.48s.94-8.89.1-9.42c-.85-.55-12.42-10.31-12.42-10.31s-3.71-20.18-4.02-21.56c-.3-1.39 9.33-20.16 9.33-20.16l-1.43-16.34 5.93-9.28 5-13.42-.1-1.83 8.64-1.31 9.83-15.39 1.23-11.59 10.8-2.38.92-8.7 1.88.42 15.32 3.53 2.87 5.79-3.41 10.19 20.88 13.34s6.4-5.19 8.91-6.68c2.5-1.5 25.21-5.56 25.21-5.56l8.08 6.72 8.4 3.81 1.99 9-6.81 3.39-9.83 15.39-.69 3.85-3.55 19.74-6.32 9.89 5.19 6.41-2.01 8-8.31.89-5.92 11.68 3.48 11.51-4.92 7.69-8.36 34.89 3.79 8.6-.53 10.5z"
            fill={getProvinceColor('trang')}
            stroke={getProvinceStroke('trang')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('trang')}
            onMouseEnter={() => handleMouseEnter('trang')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 8. นครศรีธรรมราช (Nakhon Si Thammarat) */}
          <path
            id="nakhon-si-thammarat-province"
            data-name="Nakhon Si Thammarat"
            d="m3418.68 2326.11-15.23-4.41-18.81.36-16.47-10.53-9.41.18-17.75-20.63-7.7-4.91-13.28-13.13-12.6 2.78-6.98-3.26.69-3.85 9.83-15.39 6.81-3.39-1.99-9-8.4-3.81-8.08-6.72s-22.71 4.06-25.21 5.56c-2.51 1.49-8.91 6.68-8.91 6.68l-20.88-13.34 3.41-10.19-2.87-5.79 1.68.39 13.23-8.59s9.64-24.77 9.24-26.58c-.39-1.79-17.58-11.23-17.58-11.23l4.52-9.49 8.3-.88 1.31-6.9 11.51-3.48-4.27-15.11-1.84-.62 1.48-18.18 17.51-10.47 23.99 6.04 9.61-7.78 12.71 1.92 8.11-10.29 20.12-7.26 13.82-14.38 11.73-11.07 10.41-4.18 17.88 8.33 14.4-3.18 8.83-11.38 9.8 1.62 5.61-8.78-7.39-7.82 2.72-9.1 10.1-1.28 7.72-12.09 6.51-.48 5.04-7.9.94 1.9 7.59 4.84-1.58 19.17-8.3 14.87-1.58 19.16-22.38 33.19.38 4.98-13.87 29.13-11 19.08 5.41 21.27-4.43 29.2 6.64 13.75 6.75 4.32 12.23-13.57 1.35 12.74-11.18 37.96-15.64 37.47-10.91 25.55z"
            fill={getProvinceColor('nakhon-si-thammarat')}
            stroke={getProvinceStroke('nakhon-si-thammarat')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('nakhon-si-thammarat')}
            onMouseEnter={() => handleMouseEnter('nakhon-si-thammarat')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 9. สตูล (Satun) */}
          <path
            id="satun-province"
            data-name="Satun"
            d="m3260.79 2518.34.18 9.4-3.74 5.85c-.79-3.56-1.71-7.81-1.71-7.81l-6.95 1.04-3.57.54.91 4.15-4.31 6.75-4.68 1.75-2.55 11.42-4.76-1.85-12.69 18.01-11.98 11.33 8.09-25.68 5.77-3.45-1.16-1.92-5.05-3.23-5.82-.16-4.6-7.68 1.24-7.52 4.31-6.75-3.8-10.74-4.53-4.07 3.62-13.12-7.89-6.22-5.78-26.25 1.48-9.73-6.51-6.53.86-12.51 11.41-27.13 13.04-2.87a27.5 27.5 0 0 0 12.95 10.11c5.44 1.99 13.28 1.91 19.94 1.3 7.17-.66 12.97-1.94 12.97-1.94l5.58 8.21-1.4 13.31-.42 4.09 3.38 6.8 9.16.45 1.34.07-9.13 14.29-.52 10.5-3.51 5.5 2.48 15.5 12.08 7.72c1.1.7.58 11.2.58 11.2z"
            fill={getProvinceColor('satun')}
            stroke={getProvinceStroke('satun')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('satun')}
            onMouseEnter={() => handleMouseEnter('satun')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 10. พัทลุง (Phatthalung) */}
          <path
            id="phatthalung-province"
            data-name="Phatthalung"
            d="m3361.9 2454.53-8.91 6.68.13-12.3-4.7.1-16.82 9.36-23.29-7.14-15.2-.43-7-6.01-9.79-1.62-4.54 2.52-9.16-.45-3.38-6.8.42-4.09 1.4-13.31 2.63-13.79 9.3-4.89.53-10.5-3.79-8.6 8.36-34.89 4.92-7.69-3.48-11.51 5.92-11.68 8.31-.89 2.01-8-5.19-6.41 6.32-9.89 3.55-19.74 6.98 3.26 12.6-2.78 13.28 13.13 7.7 4.91 17.75 20.63 9.41-.18 14.28 9.13-.52 10.49-4.21 6.6-.13 12.3-11.13 22.28s-11.72 11.08-11.33 12.88-1.52 14.49-.42 15.2l8.79 5.62 12.3.12 1.98 9-9.92 10.69 2.29 6.1z"
            fill={getProvinceColor('phatthalung')}
            stroke={getProvinceStroke('phatthalung')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('phatthalung')}
            onMouseEnter={() => handleMouseEnter('phatthalung')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 11. สงขลา (Songkhla) */}
          <path
            id="songkhla-province"
            data-name="Songkhla"
            d="m3406.13 2663.81-.93.66-10.49 7.52-11.9 1.69-3.81 8.38-12.49-9.52-13 .98-6.01 6.99-.92 8.7-4.72 7.39-9.42 4.13-7.59-4.84-1.52-6.9-6.9 1.52 16.41-40.55-4.05-8.53-4.21-2.69 1.98-7.86.33-1.33-10.21 2.96-11.12-1.16-3.67-3.55-6.97-15.12-10.41-7.85-.14-7.21-16.85-10.76-3.97-4.93-4.04-21.55 5.83.17 5.09-9.82-3.69-3.53 3.16-8.67-6.74-4.31s-4.6 5.37-4.91 3.98l-1.02-4.61 3.74-5.85-.18-9.4 14.31-7.87s.52-10.5-.58-11.2l-12.08-7.72-2.48-15.5 3.51-5.5.52-10.5 9.13-14.29-1.34-.07 4.54-2.52 9.79 1.62 7 6.01 15.2.43 23.29 7.14 16.82-9.36 4.7-.1-.13 12.3 8.91-6.68 8.25-22.59-2.29-6.1 9.92-10.69-1.98-9-12.3-.12-8.79-5.62c-1.1-.71.82-13.4.42-15.2s11.33-12.88 11.33-12.88l11.13-22.28.13-12.3 4.21-6.6.52-10.49 2.19 1.4 18.81-.36 15.23 4.41-4.81 11.23-21.98 67.86-8.74 35.96-3.95 24.78.98 7.74 3.38 2.16 2.43 11.05-.97 21.93.8 26.62 6.8 20.96 8.42 5.38 5.87 16.82s4.81 8.42 8.04 14.37l.32.6.68 1.26.87 1.66c.6 1.12.97 1.91 1.03 2.15.19.83 10.63 7.35 18.84 12.38l-14.87 4.03-5.62 8.78-11.11 5.28 3.87 13.31-4.91 7.69z"
            fill={getProvinceColor('songkhla')}
            stroke={getProvinceStroke('songkhla')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('songkhla')}
            onMouseEnter={() => handleMouseEnter('songkhla')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 12. นราธิวาส (Narathiwat) */}
          <path
            id="narathiwat-province"
            data-name="Narathiwat"
            d="m3536.52 2839.1-4.54 8.98-8.69 9.88s-9.91 4.35-11.58 3.28c-1.7-1.08-18.88-.18-20.8.95-1.92 1.16-16.13 12.25-16.13 12.25l-.09 9.43s-7.38 5.98-9.91 4.36c-2.53-1.61-6.19-5.14-6.73-4.3s-6.78 8.72-7.62 8.19c-.85-.55-7.89-6.22-7.58-4.85.29 1.38-7.31 9.58-7.31 9.58l-5.11-19.88-6.44-2.92-4.14.9-3.52 3.68s-3.92-1.31-3.38-2.16c.53-.83 4.08-4.51 3.23-5.05-.84-.54-.74-9.98-.74-9.98l5.61-10.65-6.2-5.15 3.77-5.9-1.78-3.74-2.28-4.77-14.19-1.95-2.42.7 9.81-15.36 2.45-23.19-7.88-14.31 10.53-16.49 12.21-4.57 8.73-16.09 12.42-12.18 24.79 9.65 14.8-1.38.94-5.71 3.67.92 5.52-13.49 9.5 4.52s.67 15.9 1.77 16.6c.5.32 4.15 2.34 7.97 4.42l-.29 10.77 4.42 13.5 3.75 6.27 3.14 5.24.81 13.59 4.81 18.49 4.21 2.69 1.83 8.29 4.95 12.66z"
            fill={getProvinceColor('narathiwat')}
            stroke={getProvinceStroke('narathiwat')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('narathiwat')}
            onMouseEnter={() => handleMouseEnter('narathiwat')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 13. ปัตตานี (Pattani) */}
          <path
            id="pattani-province"
            data-name="Pattani"
            d="M3515.18 2743.32a353 353 0 0 1-7.97-4.42c-1.1-.7-1.77-16.6-1.77-16.6l-9.5-4.52-5.52 13.49-3.67-.92-4.32-1.09-5.2-6.41 1.62-9.8-12.69-1.92-8.09-6.72-17.4-1.83-2.78-12.6 9.84-15.39-24.12 6.26-17.9-16.37.93-.67-2.08-13.7 4.92-7.69-3.88-13.31 11.11-5.27 5.62-8.79 14.87-4.03c5.37 3.28 9.82 5.93 9.82 5.93l17.18-.89 7.59 4.85 6.88 11.52 6.6-2.9 8.43 5.38 1.76 4.68 14.09 11.38 8.27 11.22-2.13 33.05-.03 9.11-.11 26.4z"
            fill={getProvinceColor('pattani')}
            stroke={getProvinceStroke('pattani')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('pattani')}
            onMouseEnter={() => handleMouseEnter('pattani')}
            onMouseLeave={() => onHoverProvince(null)}
          />

          {/* 14. ยะลา (Yala) */}
          <path
            id="yala-province"
            data-name="Yala"
            d="m3446.22 2727.79-12.42 12.18-8.73 16.09-12.21 4.57-10.53 16.49 7.88 14.31-2.45 23.19-9.81 15.36-7.79 2.27-19.07-11.01-15.97 6.42-14.64-10.53-3.23 5.05c-.54.85-2.75.61-2.75.61l-9.7 15.18-4.22-2.7-2.75.61-3.55 3.67-5.04-3.22-3.31 1.44-1.69-1.07-8.82 2.67 3.7-9.51-1.04-24.39-7.27-3.47-2.21-13.28 3.23-5.06 8.06.4 8.92-12.09 12.34 6.69 14.81-8.35-2.05-6.04 8.62-13.5 2.53 1.62 5.68-7.05-6.89-11.52 1.32-3.9 9.43.08 6.67.7 4.48-12.57-5.67-5.98-4.22-2.7-8.58.44-4.43-13.5-.48.21 4.72-7.39.92-8.7 6.01-6.99 13-.98 12.49 9.53 3.81-8.39 11.9-1.69 10.49-7.51 17.9 16.37 24.12-6.26-9.84 15.39 2.78 12.6 17.4 1.83 8.09 6.72 12.69 1.92-1.62 9.8 5.2 6.41 4.32 1.09-.94 5.71-14.8 1.38z"
            fill={getProvinceColor('yala')}
            stroke={getProvinceStroke('yala')}
            strokeWidth="2.5"
            strokeMiterlimit="10"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => handleInteraction('yala')}
            onMouseEnter={() => handleMouseEnter('yala')}
            onMouseLeave={() => onHoverProvince(null)}
          />

        </g>
      </svg>
    </Box>
  );
}
