'use client';

import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ProvincePostageStamp from '@/components/profile/ProvincePostageStamp';
import { Province, REGION_METAS } from '@/data/thailandProvinces';

export interface FloatingStampProps {
  province: Province;
  isVisited?: boolean;
  size?: 'small' | 'medium' | 'large';
  floatOffset?: number; // Delay in seconds to desync multiple stamps
  floatDistance?: number; // Pixel distance to float up/down
  rotationOffset?: number; // Base tilt angle (deg)
  interactiveTilt?: boolean; // Enable 3D tilt tracking mouse
  badgeLabel?: string;
  onClick?: (province: Province) => void;
  animated?: boolean;
}

export default function FloatingStamp({
  province,
  isVisited = false,
  size = 'small',
  floatOffset = 0,
  floatDistance = 8,
  rotationOffset = 0,
  interactiveTilt = true,
  badgeLabel,
  onClick,
  animated = true
}: FloatingStampProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const regionMeta = REGION_METAS[province.region];

  // Mouse tilt tracking values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for mouse parallax
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: [-floatDistance, floatDistance, -floatDistance],
        rotate: [rotationOffset - 1.5, rotationOffset + 1.5, rotationOffset - 1.5]
      }}
      transition={{
        duration: 4.5 + (floatOffset % 2),
        repeat: Infinity,
        ease: 'easeInOut',
        delay: floatOffset
      }}
      whileHover={{
        scale: 1.06,
        zIndex: 20,
        transition: { duration: 0.25 }
      }}
      style={{
        display: 'inline-block',
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: 900
      }}
    >
      <motion.div
        style={{
          rotateX: interactiveTilt ? rotateX : 0,
          rotateY: interactiveTilt ? rotateY : 0,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Optional decorative region tag badge */}
        {badgeLabel && (
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          >
            <Chip
              label={badgeLabel}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 800,
                bgcolor: regionMeta?.color || '#059669',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                letterSpacing: 0.5
              }}
            />
          </Box>
        )}

        {/* Core Stamp */}
        <ProvincePostageStamp
          province={province}
          isVisited={isVisited}
          size={size}
          onClick={onClick}
          animated={animated}
        />
      </motion.div>
    </motion.div>
  );
}
