'use client';

import React from 'react';
import Box from '@mui/material/Box';
import { StampFrameProps } from './types';

export default function ClassicStampFrame({
  isVisited = false,
  paperBg,
  accentColor,
  className,
  children
}: StampFrameProps) {
  const currentPaperBg = paperBg || (isVisited ? '#FEFDF9' : '#F8FAFC');
  const innerBorderColor = isVisited ? '#10B981' : '#94A3B8';
  const innerBgColor = isVisited ? 'rgba(240, 253, 244, 0.4)' : 'rgba(241, 245, 249, 0.4)';

  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: currentPaperBg,
        p: 1.2,
        position: 'relative',
        borderRadius: '4px',
        boxSizing: 'border-box',
        // Perforated stamp edge illusion via repeating serrated gradient
        background: `
          radial-gradient(circle, transparent 4px, ${currentPaperBg} 4.5px) -6px -6px / 14px 14px repeat,
          radial-gradient(circle, transparent 4px, ${currentPaperBg} 4.5px) -6px calc(100% + 6px) / 14px 14px repeat,
          radial-gradient(circle, transparent 4px, ${currentPaperBg} 4.5px) -6px -6px / 14px 14px repeat,
          radial-gradient(circle, transparent 4px, ${currentPaperBg} 4.5px) calc(100% + 6px) -6px / 14px 14px repeat
        `,
        backgroundColor: currentPaperBg,
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
          border: isVisited ? `1.5px solid ${innerBorderColor}` : '1px solid #94A3B8',
          borderRadius: '2px',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          bgcolor: innerBgColor,
          boxSizing: 'border-box'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
