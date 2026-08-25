'use client';

import { useEffect, useRef } from 'react';

// @mui
import Typography from '@mui/material/Typography';

// @third-party
import { useInView, useMotionValue, useSpring } from 'framer-motion';

/***************************  COMMON - COUNTER ANIMATION  ***************************/

export default function Counter({ value, direction = 'up' }: { value: number; direction?: 'up' | 'down' }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const isInView = useInView(ref, { once: true, margin: '-1px' });

  const springValue = useSpring(motionValue, {
    damping: 5,
    stiffness: 5,
    duration: 0.001
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === 'down' ? 0 : value);
    }
  }, [motionValue, isInView, direction, value]);

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat('en-US').format(Number(latest.toFixed(0)));
        }
      }),
    [springValue]
  );

  return <Typography variant="body1" typography="h1" ref={ref}></Typography>;
}
