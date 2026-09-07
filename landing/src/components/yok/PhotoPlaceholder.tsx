'use client';

import React, { ReactNode, CSSProperties } from 'react';

interface PhotoPlaceholderProps {
  src?: string;
  alt?: string;
  variant?: string;
  caption?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function PhotoPlaceholder({
  src,
  alt = '',
  variant = 'ph-villa',
  caption = '',
  className = '',
  style = {},
  children
}: PhotoPlaceholderProps) {
  return (
    <div className={`ph ${src ? '' : variant} ${className}`} data-cap={caption} style={style}>
      {src && <img className="ph-img" src={src} alt={alt} loading="lazy" />}
      {children}
    </div>
  );
}
