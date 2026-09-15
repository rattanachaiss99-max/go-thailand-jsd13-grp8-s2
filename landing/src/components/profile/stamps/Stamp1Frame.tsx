'use client';

import React, { useId } from 'react';
import Box from '@mui/material/Box';
import { StampFrameProps } from './types';

export default function Stamp1Frame({
  isVisited = false,
  paperBg,
  className,
  children
}: StampFrameProps) {
  const rawId = useId();
  const gradientId = `stamp-1-grad-${rawId.replace(/[:]/g, '')}`;

  // Default parchment paper color from SVG (#e0cf9c)
  const defaultPaperColor = isVisited ? '#e0cf9c' : '#e6dec8';
  const paperColor = paperBg || defaultPaperColor;

  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Vector SVG Stamp Frame & Perforations */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="70 81 48 63"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none'
        }}
      >
        <defs>
          <linearGradient
            id={gradientId}
            x2="1"
            gradientTransform="matrix(0 53.062 -72.358 0 130 86.3)"
            gradientUnits="userSpaceOnUse"
          >
            {isVisited ? (
              <>
                <stop offset="0" stopColor="#8bbaf3" />
                <stop offset="0.3" stopColor="#91d7ff" />
                <stop offset="0.6" stopColor="#aef" />
                <stop offset="1" stopColor="#bdffff" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#94a3b8" />
                <stop offset="0.3" stopColor="#cbd5e1" />
                <stop offset="0.6" stopColor="#e2e8f0" />
                <stop offset="1" stopColor="#f1f5f9" />
              </>
            )}
          </linearGradient>
        </defs>
        <g id="stamp_1">
          {/* ขอบรอยหยักแสตมป์รอบนอก (Perforated Teeth Border) */}
          <path
            id="Background"
            d="M116.7 141.8q.3-.2.7-.2v-1q-1.5 0-1.6-1.5.1-1.3 1.6-1.5v-1q-1.5-.1-1.6-1.5.1-1.5 1.6-1.6v-1q-1.5 0-1.6-1.5.1-1.4 1.6-1.6v-1q-1.5 0-1.6-1.5.1-1.3 1.6-1.5v-1q-1.5-.2-1.6-1.5.1-1.5 1.6-1.6v-1q-1.5 0-1.6-1.5c0-.8.7-1.6 1.6-1.6v-1q-1.5 0-1.6-1.5.1-1.4 1.6-1.6v-.9q-1.5-.1-1.6-1.5.1-1.5 1.6-1.6v-1q-1.5 0-1.6-1.5.1-1.5 1.6-1.6v-1q-1.5 0-1.6-1.5c0-.8.7-1.6 1.6-1.6v-.9q-1.5-.2-1.6-1.5.1-1.5 1.6-1.6v-1q-1.5-.1-1.6-1.5.1-1.5 1.6-1.6v-1q-1.5 0-1.6-1.5.1-1.4 1.6-1.6v-.9q-1.5-.1-1.6-1.5.1-1.5 1.6-1.6v-1q-1 0-1.4-.9-.2-.3-.2-.7h-1c0 .9-.8 1.6-1.6 1.6h-.1q-1.5-.1-1.6-1.6h-1q-.2 1.5-1.6 1.6h-.1q-1.4-.1-1.5-1.6h-1.1q-.1 1.5-1.6 1.6-1.5-.1-1.6-1.6h-1q-.2 1.5-1.6 1.6h-.1q-1.5-.1-1.6-1.6h-1q-.2 1.5-1.6 1.6H96q-1.4-.1-1.5-1.6h-1.1q-.1 1.5-1.6 1.6-1.5-.1-1.6-1.6h-1q-.2 1.5-1.6 1.6h-.1q-1.5-.1-1.6-1.6h-1c0 .9-.8 1.6-1.6 1.6h-.1q-1.4-.1-1.5-1.6h-1.1q-.1 1.5-1.6 1.6-1.5-.1-1.6-1.6h-1c0 .9-.8 1.6-1.6 1.6h-.1q-1.5-.1-1.6-1.6h-1q-.1 1-1 1.5l-.7.1v1q1.5 0 1.6 1.5-.1 1.4-1.6 1.6v.9q1.5.2 1.6 1.5-.1 1.5-1.6 1.6v1q1.5 0 1.6 1.5-.1 1.4-1.6 1.6v1q1.5 0 1.6 1.5-.1 1.4-1.6 1.6v.9q1.5.2 1.6 1.5-.1 1.5-1.6 1.6v1q1.5.2 1.6 1.5-.1 1.5-1.6 1.6v1q1.5 0 1.6 1.5c0 .8-.7 1.6-1.6 1.6v.9q1.5.1 1.6 1.5-.1 1.5-1.6 1.6v1q1.5.1 1.6 1.5-.1 1.5-1.6 1.6v1q1.5 0 1.6 1.5c0 .8-.7 1.6-1.6 1.6v.9q1.5.2 1.6 1.5-.1 1.5-1.6 1.6v1q1.5.1 1.6 1.5-.1 1.5-1.6 1.6v1q1.5 0 1.6 1.5-.1 1.4-1.6 1.6v1q1.5.1 1.6 1.4-.1 1.5-1.6 1.6v1q1 0 1.5 1l.1.6h1.1q.1-1.5 1.6-1.6 1.5.1 1.6 1.6h1c0-.9.8-1.6 1.6-1.6h.1q1.5.1 1.6 1.6h1q.1-1.5 1.6-1.6h.1q1.3.1 1.5 1.6H86q.1-1.5 1.6-1.6 1.5.1 1.6 1.6h1q.2-1.5 1.6-1.6h.1q1.5.1 1.6 1.6h1q.1-1.5 1.6-1.6h.1q1.3.1 1.5 1.6h1.1q.1-1.5 1.6-1.6 1.5.1 1.6 1.6h1q.2-1.5 1.6-1.6h.1q1.5.1 1.6 1.6h1q.1-1.5 1.6-1.6h.1q1.3.1 1.5 1.6h1.1q.1-1.5 1.6-1.6 1.6.1 1.6 1.6h1.1q0-1 1-1.5"
            fill={paperColor}
          />
          {/* พื้นที่สีเกรเดียนต์ด้านใน (Gradient Center Plate) */}
          <path
            id="gradient"
            d="M113.3 139H74.6V86.4h38.7z"
            fill={`url(#${gradientId})`}
          />
          {/* เส้นขอบสีขาวด้านใน (White Border Line) */}
          <g id="border-line">
            <path
              id="line"
              d="M113.8 139.6H74V85.8h39.7zm-38.7-1h37.7V86.8H75z"
              fill={isVisited ? '#FFFFFF' : 'rgba(255,255,255,0.8)'}
            />
          </g>
        </g>
      </svg>

      {/* 2. ช่องวางเนื้อหาด้านใน (Inner Content Container - Aligned to SVG inner frame) */}
      <Box
        sx={{
          position: 'absolute',
          top: '8.6%',
          left: '9.6%',
          width: '80.8%',
          height: '83.5%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { xs: 0.6, sm: 0.8 },
          boxSizing: 'border-box',
          zIndex: 1
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
