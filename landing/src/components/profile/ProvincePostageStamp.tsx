'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Province, REGION_METAS } from '@/data/thailandProvinces';
import { getProvinceSvgData } from '@/data/northernProvincesSvg';

export interface ProvincePostageStampProps {
  province: Province;
  isVisited?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (province: Province) => void;
  showRegionTag?: boolean;
  className?: string;
}

export default function ProvincePostageStamp({
  province,
  isVisited = false,
  size = 'medium',
  onClick,
  showRegionTag = true,
  className
}: ProvincePostageStampProps) {
  const svgData = getProvinceSvgData(province.slug);
  const regionMeta = REGION_METAS[province.region];

  // Scale dimensions
  const dims = {
    small: { width: 130, height: 175, svgH: 60, titleSize: '0.8rem', subSize: '0.65rem' },
    medium: { width: 170, height: 230, svgH: 85, titleSize: '0.95rem', subSize: '0.72rem' },
    large: { width: 220, height: 295, svgH: 120, titleSize: '1.15rem', subSize: '0.85rem' }
  }[size];

  // Colors
  const accentColor = isVisited ? '#059669' : '#64748b';
  const paperBg = isVisited ? '#FEFDF9' : '#F8FAFC';

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
          ? 'drop-shadow(0 8px 16px rgba(16, 185, 129, 0.18)) drop-shadow(0 2px 5px rgba(0,0,0,0.06))'
          : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))',
        '&:hover': onClick
          ? {
              transform: 'translateY(-6px) rotate(1deg) scale(1.02)',
              filter: isVisited
                ? 'drop-shadow(0 14px 24px rgba(16, 185, 129, 0.28)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))'
                : 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.14))'
            }
          : {}
      }}
    >
      {/* 1. ขอบรอยหยักแสตมป์จริง (Perforated Stamp Border) */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: paperBg,
          p: 1.2,
          position: 'relative',
          borderRadius: '4px',
          boxSizing: 'border-box',
          // Perforated stamp edge illusion via repeating serrated gradient
          background: `
            radial-gradient(circle, transparent 4px, ${paperBg} 4.5px) -6px -6px / 14px 14px repeat,
            radial-gradient(circle, transparent 4px, ${paperBg} 4.5px) -6px calc(100% + 6px) / 14px 14px repeat,
            radial-gradient(circle, transparent 4px, ${paperBg} 4.5px) -6px -6px / 14px 14px repeat,
            radial-gradient(circle, transparent 4px, ${paperBg} 4.5px) calc(100% + 6px) -6px / 14px 14px repeat
          `,
          backgroundColor: paperBg,
          border: isVisited ? '2px solid #E2E8F0' : '2px dashed #CBD5E1',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* เส้นกรอบวินเทจด้านใน (Vintage Inner Border) */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            border: isVisited ? '1.5px solid #10B981' : '1px solid #94A3B8',
            borderRadius: '2px',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            bgcolor: isVisited ? 'rgba(240, 253, 244, 0.4)' : 'rgba(241, 245, 249, 0.4)'
          }}
        >
          {/* Header แสตมป์: ชื่อประเทศ และมูลค่า/รหัส */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: isVisited ? 'rgba(16, 185, 129, 0.25)' : 'rgba(148, 163, 184, 0.3)',
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
                color: isVisited ? '#D97706' : '#94A3B8'
              }}
            >
              {province.id}
            </Typography>
          </Box>

          {/* ตรงกลาง: รูปทรงเวกเตอร์จังหวัดเดี่ยว (Isolated Province Vector SVG) */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              position: 'relative',
              opacity: isVisited ? 1 : 0.45,
              filter: isVisited ? 'none' : 'grayscale(1)'
            }}
          >
            {svgData ? (
              <svg
                viewBox={svgData.viewBox}
                style={{
                  width: '100%',
                  height: dims.svgH,
                  maxHeight: dims.svgH,
                  transition: 'all 0.3s ease'
                }}
              >
                <path
                  d={svgData.d}
                  fill={isVisited ? '#10B981' : '#94A3B8'}
                  stroke={isVisited ? '#047857' : '#64748B'}
                  strokeWidth="3.5"
                  strokeMiterlimit="10"
                  style={{
                    filter: isVisited ? 'drop-shadow(0 4px 6px rgba(16,185,129,0.3))' : 'none'
                  }}
                />
              </svg>
            ) : (
              // Fallback สัญลักษณ์สำหรับจังหวัดที่ยังไม่มีเส้นเวกเตอร์เฉพาะ
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
                    {province.region === 'south'
                      ? '🏝️'
                      : province.region === 'isan'
                      ? '🌾'
                      : province.region === 'central'
                      ? '🏛️'
                      : '🗺️'}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* หากยังไม่เคยไป แสดงลายน้ำ LOCKED */}
            {!isVisited && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-25deg)',
                  border: '1.5px solid #94A3B8',
                  borderRadius: 1,
                  px: 1,
                  py: 0.2,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  pointerEvents: 'none'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    color: '#64748B',
                    letterSpacing: 0.5
                  }}
                >
                  🔒 ยังไม่ได้ไป
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer แสตมป์: ชื่อจังหวัดไทย-อังกฤษ */}
          <Box
            sx={{
              textAlign: 'center',
              borderTop: '1px solid',
              borderColor: isVisited ? 'rgba(16, 185, 129, 0.25)' : 'rgba(148, 163, 184, 0.3)',
              pt: 0.5
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                fontSize: dims.titleSize,
                color: isVisited ? '#065F46' : '#334155',
                lineHeight: 1.2
              }}
            >
              {province.nameTh}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: dims.subSize,
                color: isVisited ? '#059669' : '#64748B',
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
                  color: isVisited ? '#10B981' : '#94A3B8',
                  display: 'block',
                  mt: 0.2
                }}
              >
                {regionMeta.labelTh}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* 2. ตราประทับไปรษณีย์ (Rubber Cancellation Postmark Seal) */}
      {isVisited && (
        <Box
          sx={{
            position: 'absolute',
            bottom: size === 'small' ? -8 : -10,
            right: size === 'small' ? -8 : -10,
            width: size === 'small' ? 68 : size === 'medium' ? 84 : 105,
            height: size === 'small' ? 68 : size === 'medium' ? 84 : 105,
            borderRadius: '50%',
            border: '2px dashed #DC2626',
            p: 0.3,
            transform: 'rotate(-14deg)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(254, 242, 242, 0.85)',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
            opacity: 0.95
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
      )}
    </Box>
  );
}
