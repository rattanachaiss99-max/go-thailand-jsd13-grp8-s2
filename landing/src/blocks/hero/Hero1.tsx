'use client';

import { isValidElement, ReactElement, useRef } from 'react';

// @next
import NextLink from 'next/link';

// @mui
import Button, { ButtonProps } from '@mui/material/Button';
import Chip, { ChipProps } from '@mui/material/Chip';
import Link, { LinkProps } from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion, useScroll, useTransform } from 'framer-motion';

// @project
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import GraphicsImage from '@/components/GraphicsImage';
import { SECTION_COMMON_PY } from '@/utils/constant';

// @types
import { ImageCommonProps } from '@/types/graphics';

interface Props {
  chip?: {
    label: ChipProps['label'];
    link?: LinkProps;
  };
  headLine?: string | ReactElement;
  captionLine?: string;
  image: ImageCommonProps;
  primaryBtn?: ButtonProps;
  secondaryBtn?: ButtonProps;
}

/***************************  HERO - 1  ***************************/

/**
 *
 * Demos:
 * - [Hero1](https://www.saasable.io/blocks/hero/hero1)
 *
 * API:
 * - [Hero1 API](https://phoenixcoded.gitbook.io/saasable/ui-kit/development/components/hero/hero1#props-details)
 */

export default function Hero1({ chip, headLine, captionLine, image, primaryBtn, secondaryBtn }: Props) {
  const imageRadius = { xs: 12, sm: 16, md: 20 };
  const cardPadding = { xs: 3, sm: 5, md: 8 };

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.4, 0.6], [0.9, 0.92, 0.94, 0.96, 1]);

  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <Box ref={containerRef}>
        <Stack sx={{ alignItems: 'center', gap: { xs: 1.5, md: 3 } }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease: [0.215, 0.61, 0.355, 1]
            }}
          >
            {chip && (
              <Chip
                label={
                  typeof chip.label === 'string' ? (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {chip.label}
                      {chip.link && (
                        <Link
                          component={NextLink}
                          variant="caption"
                          color="primary.main"
                          {...chip.link}
                          underline="hover"
                          sx={{ '&:hover': { color: 'primary.dark' } }}
                        />
                      )}
                    </Typography>
                  ) : (
                    chip.label
                  )
                }
                sx={{ bgcolor: 'grey.100' }}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.215, 0.61, 0.355, 1]
            }}
          >
            {isValidElement(headLine) ? (
              headLine
            ) : (
              <Typography variant="h1" align="center" sx={{ width: { xs: 343, sm: 700, md: 850 } }}>
                {headLine}
              </Typography>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.215, 0.61, 0.355, 1]
            }}
          >
            {captionLine && (
              <Typography variant="h6" align="center" sx={{ color: 'text.secondary', width: { xs: 350, sm: 350, md: 500 } }}>
                {captionLine}
              </Typography>
            )}
          </motion.div>
        </Stack>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.4,
            ease: [0.215, 0.61, 0.355, 1]
          }}
        >
          {(primaryBtn || secondaryBtn) && (
            <Stack direction="row" sx={{ justifyContent: 'center', gap: { xs: 1, sm: 2, md: 2.5 }, mt: { xs: 2, sm: 4 } }}>
              <ButtonAnimationWrapper>
                {primaryBtn && (
                  <Button
                    color="primary"
                    size="large"
                    variant="contained"
                    {...primaryBtn}
                    rel="noopener noreferrer"
                    aria-label="Open New Tab"
                  />
                )}
              </ButtonAnimationWrapper>
              <ButtonAnimationWrapper>
                {secondaryBtn && (
                  <Button
                    color="primary"
                    size="large"
                    variant="outlined"
                    {...secondaryBtn}
                    rel="noopener noreferrer"
                    aria-label="Open New Tab"
                  />
                )}
              </ButtonAnimationWrapper>
            </Stack>
          )}
        </motion.div>
        <Box sx={{ position: 'sticky', top: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5
            }}
            style={{ scale }}
          >
            <GraphicsCard sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
              <Box sx={{ px: cardPadding, pt: cardPadding, height: { xs: 220, sm: 400, md: 543 } }}>
                <GraphicsImage
                  {...{ image }}
                  sx={{
                    border: '5px solid',
                    borderColor: 'grey.200',
                    borderBottom: 'none',
                    height: '100%',
                    backgroundPosition: 'top',
                    borderTopLeftRadius: imageRadius,
                    borderTopRightRadius: imageRadius
                  }}
                />
              </Box>
            </GraphicsCard>
          </motion.div>
        </Box>
      </Box>
    </ContainerWrapper>
  );
}
