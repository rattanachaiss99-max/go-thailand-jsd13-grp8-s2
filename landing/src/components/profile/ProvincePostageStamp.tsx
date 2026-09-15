'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Province, REGION_METAS } from '@/data/thailandProvinces';
import { useProvinceVector, ProvinceVectorData } from '@/services/provinceVectorService';
import StampBackground from './stamps/StampBackground';
import { StampVariant } from './stamps/types';

export interface ProvincePostageStampProps {
  province: Province;
  isVisited?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (province: Province) => void;
  showRegionTag?: boolean;
  className?: string;
  initialVectorData?: ProvinceVectorData | null;
  animated?: boolean;
  interactiveHover?: boolean;
  variant?: StampVariant;
  hideText?: boolean;
}

export default function ProvincePostageStamp({
  province,
  isVisited = false,
  size = 'medium',
  onClick,
  showRegionTag = true,
  className,
  initialVectorData,
  animated = false,
  interactiveHover = false,
  variant = 'stamp_1',
  hideText = false
}: ProvincePostageStampProps) {
  const { vectorData, isLoading } = useProvinceVector(province.slug, initialVectorData);
  const regionMeta = REGION_METAS[province.region];

  // Scale dimensions (when hideText is true, the SVG vector expands to fill the stamp)
  const dims = {
    small: { width: 130, height: 175, svgH: hideText ? 110 : 60, titleSize: '0.8rem', subSize: '0.65rem' },
    medium: { width: 170, height: 230, svgH: hideText ? 150 : 85, titleSize: '0.95rem', subSize: '0.72rem' },
    large: { width: 220, height: 295, svgH: hideText ? 200 : 120, titleSize: '1.15rem', subSize: '0.85rem' }
  }[size];

  // Color schemes adapting to variant & visited state
  const isStamp1 = variant === 'stamp_1';
  const accentColor = isVisited
    ? isStamp1 ? '#0F172A' : '#059669'
    : '#64748B';
  const paperBg = isStamp1
    ? (isVisited ? '#e0cf9c' : '#e6dec8')
    : (isVisited ? '#FEFDF9' : '#F8FAFC');

  const idTextColor = isVisited
    ? (isStamp1 ? '#0284C7' : '#D97706')
    : '#94A3B8';

  const titleTextColor = isVisited
    ? (isStamp1 ? '#0F172A' : '#065F46')
    : '#334155';

  const subTextColor = isVisited
    ? (isStamp1 ? '#0369A1' : '#059669')
    : '#64748B';

  const dividerBorderColor = isStamp1
    ? (isVisited ? 'rgba(255, 255, 255, 0.7)' : 'rgba(148, 163, 184, 0.3)')
    : (isVisited ? 'rgba(16, 185, 129, 0.25)' : 'rgba(148, 163, 184, 0.3)');

  return (
    <Box
      onClick={() => onClick?.(province)}
      className={className}
      sx={{
        width: dims.width,
        height: dims.height,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
        userSelect: 'none',
        filter: isVisited
          ? isStamp1
            ? 'drop-shadow(0 8px 16px rgba(14, 165, 233, 0.22)) drop-shadow(0 2px 5px rgba(0,0,0,0.06))'
            : 'drop-shadow(0 8px 16px rgba(16, 185, 129, 0.18)) drop-shadow(0 2px 5px rgba(0,0,0,0.06))'
          : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))',
        '&:hover': onClick
          ? {
              transform: 'translateY(-6px) rotate(1deg) scale(1.02)',
              filter: isVisited
                ? isStamp1
                  ? 'drop-shadow(0 14px 24px rgba(14, 165, 233, 0.32)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))'
                  : 'drop-shadow(0 14px 24px rgba(16, 185, 129, 0.28)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))'
                : 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.14))'
            }
          : {}
      }}
    >
      {/* 1. กรอบและพื้นหลังแสตมป์ (Stamp Background Frame - Supports stamp_1 & classic) */}
      <StampBackground
        variant={variant}
        isVisited={isVisited}
        paperBg={paperBg}
        accentColor={accentColor}
      >
        {/* Header แสตมป์: ชื่อประเทศ และมูลค่า/รหัส */}
        {!hideText && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: dividerBorderColor,
              pb: 0.5
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: size === 'small' ? '0.55rem' : '0.65rem',
                fontWeight: 800,
                letterSpacing: 1.2,
                color: accentColor,
                textTransform: 'uppercase',
                fontFamily: 'serif'
              }}
            >
              สยาม • THAILAND
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: size === 'small' ? '0.55rem' : '0.65rem',
                fontWeight: 800,
                color: idTextColor
              }}
            >
              {province.id}
            </Typography>
          </Box>
        )}

        {/* ตรงกลาง: รูปทรงเวกเตอร์จังหวัดเดี่ยว (Isolated Province Vector SVG) */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: hideText ? 1 : 0.5,
            px: hideText ? 0.5 : 0,
            width: '100%',
            height: '100%',
            position: 'relative',
            opacity: isVisited ? 1 : 0.45,
            filter: isVisited ? 'none' : 'grayscale(1)'
          }}
        >
          {vectorData ? (
            <svg
              viewBox={vectorData.viewBox}
              style={{
                width: '100%',
                height: dims.svgH,
                maxHeight: hideText ? '92%' : dims.svgH,
                transition: 'all 0.3s ease'
              }}
            >
                {animated ? (
                  <motion.path
                    key={`animated-path-${province.slug}-${isVisited}`}
                    d={vectorData.d}
                    fill={isVisited ? regionMeta?.color || '#10B981' : '#94A3B8'}
                    stroke={isVisited ? '#047857' : '#64748B'}
                    strokeWidth="3.5"
                    strokeMiterlimit="10"
                    initial={{ pathLength: 0, fillOpacity: 0 }}
                    animate={{ pathLength: 1, fillOpacity: 1 }}
                    transition={{
                      pathLength: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
                      fillOpacity: { duration: 0.5, delay: 0.8 }
                    }}
                    style={{
                      filter: isVisited ? `drop-shadow(0 4px 6px ${regionMeta?.color || '#10B981'}40)` : 'none'
                    }}
                  />
                ) : (
                  <path
                    d={vectorData.d}
                    fill={isVisited ? regionMeta?.color || '#10B981' : '#94A3B8'}
                    stroke={isVisited ? '#047857' : '#64748B'}
                    strokeWidth="3.5"
                    strokeMiterlimit="10"
                    style={{
                      filter: isVisited ? `drop-shadow(0 4px 6px ${regionMeta?.color || '#10B981'}40)` : 'none'
                    }}
                  />
                )}
              </svg>
            ) : isLoading ? (
              // กำลังโหลดเวกเตอร์จาก MongoDB Atlas แบบ On-Demand
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: dims.svgH
                }}
              >
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width="70%"
                  height={dims.svgH * 0.8}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isVisited ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.15)'
                  }}
                />
              </Box>
            ) : (
              // Fallback สัญลักษณ์สำหรับกรณีไม่มีเส้นเวกเตอร์
              <Box
                sx={{
                  textAlign: 'center',
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    width: dims.svgH * 0.75,
                    height: dims.svgH * 0.75,
                    borderRadius: '50%',
                    bgcolor: isVisited ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1.5px dashed ${isVisited ? '#10B981' : '#CBD5E1'}`
                  }}
                >
                  <Typography variant="h4" sx={{ fontSize: size === 'small' ? '1.5rem' : '2rem' }}>
                    {province.region === 'south' ? '🏝️' : province.region === 'isan' ? '🌾' : province.region === 'central' ? '🏛️' : '🗺️'}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Footer แสตมป์: ชื่อจังหวัดไทย-อังกฤษ */}
          {!hideText && (
            <Box
              sx={{
                textAlign: 'center',
                borderTop: '1px solid',
                borderColor: dividerBorderColor,
                pt: 0.5
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  fontSize: dims.titleSize,
                  color: titleTextColor,
                  lineHeight: 1.2
                }}
              >
                {province.nameTh}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: dims.subSize,
                  color: subTextColor,
                  fontWeight: 600,
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}
              >
                {province.nameEn}
              </Typography>

              {showRegionTag && regionMeta && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.55rem',
                    color: isVisited ? (isStamp1 ? '#0284C7' : '#10B981') : '#94A3B8',
                    display: 'block',
                    mt: 0.2
                  }}
                >
                  {regionMeta.labelTh}
                </Typography>
              )}
            </Box>
          )}
        </StampBackground>

      {/* 2. ตราประทับไปรษณีย์ (Rubber Cancellation Postmark Seal) */}
      <AnimatePresence>
        {isVisited && (
          <motion.div
            key={`postmark-seal-${province.id}`}
            initial={animated ? { scale: 2.5, opacity: 0, rotate: 25 } : { scale: 1, opacity: 0.95, rotate: -14 }}
            animate={{ scale: 1, opacity: 0.95, rotate: -14 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 18,
              delay: animated ? 0.35 : 0
            }}
            style={{
              position: 'absolute',
              bottom: size === 'small' ? -8 : -10,
              right: size === 'small' ? -8 : -10,
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
            <Box
              sx={{
                width: size === 'small' ? 68 : size === 'medium' ? 84 : 105,
                height: size === 'small' ? 68 : size === 'medium' ? 84 : 105,
                borderRadius: '50%',
                border: '2px dashed #DC2626',
                p: 0.3,
                bgcolor: 'rgba(254, 242, 242, 0.92)',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '1.5px solid #DC2626',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  px: 0.5
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: size === 'small' ? '0.45rem' : '0.55rem',
                    fontWeight: 900,
                    color: '#DC2626',
                    letterSpacing: 0.5,
                    lineHeight: 1
                  }}
                >
                  VISITED
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: size === 'small' ? '0.5rem' : '0.65rem',
                    fontWeight: 900,
                    color: '#B91C1C',
                    lineHeight: 1,
                    my: 0.2
                  }}
                >
                  ✓ CHECKED
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: size === 'small' ? '0.4rem' : '0.48rem',
                    fontWeight: 700,
                    color: '#DC2626',
                    lineHeight: 1
                  }}
                >
                  GO THAILAND
                </Typography>
              </Box>
            </Box>

            {/* Micro ink particles burst when animated */}
            {animated && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.9 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                style={{
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '50%',
                  border: '2px dotted rgba(220, 38, 38, 0.7)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
