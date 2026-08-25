'use client';

import { useState, useRef, useEffect, ComponentType, ReactNode, createElement, useMemo } from 'react';

// @mui
import Box from '@mui/material/Box';

// @project
import Loader from '@/components/Loader';

interface SectionConfig {
  // eslint-disable-next-line
  importFunc: () => Promise<{ default: ComponentType<any> }>;
  // eslint-disable-next-line
  props?: Record<string, any>;
}

interface LazySectionProps {
  sections: SectionConfig | SectionConfig[];
  fallback?: ReactNode;
  offset?: string;
  placeholderHeight?: number;
}

export default function LazySection({ sections, fallback = <Loader />, offset = '0px', placeholderHeight = 400 }: LazySectionProps) {
  const sectionList = useMemo(() => (Array.isArray(sections) ? sections : [sections]), [sections]);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedComponents, setLoadedComponents] = useState<(ComponentType | null)[]>(Array(sectionList.length).fill(null));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          Promise.all(sectionList.map((section) => section.importFunc().then((module) => module.default))).then((components) =>
            setLoadedComponents(components)
          );
        }
      },
      { rootMargin: offset, threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [sectionList, offset, isVisible]);

  return (
    <Box ref={ref} sx={{ minHeight: placeholderHeight }}>
      {isVisible && loadedComponents.every((component) => component)
        ? sectionList.map((section, index) => createElement(loadedComponents[index]!, { key: index, ...section.props }))
        : isVisible && fallback}
    </Box>
  );
}
