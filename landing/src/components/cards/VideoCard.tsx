'use client';

// @mui
import { SxProps, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import GraphicsCard from './GraphicsCard';
import { withAlpha } from '@/utils/colorUtils';

// @types
import { BgImageProps } from '@/types/graphics';
import SvgIcon from '../SvgIcon';

interface Props {
  bgImage?: BgImageProps;
  sx?: SxProps;
  onClick?: () => void;
}

/***************************  CARD - VIDEO  ***************************/

export default function VideoCard({ bgImage, sx, onClick }: Props) {
  const theme = useTheme();
  const blurEffect = { bgcolor: withAlpha(theme.vars.palette.grey[200], 0.4), backdropFilter: 'blur(3px)' };

  return (
    <GraphicsCard
      {...{ bgImage }}
      sx={{ height: 1, minHeight: { xs: 242, sm: 314, md: 330 }, backgroundPositionY: 'top', position: 'relative', ...sx }}
      {...(onClick && { onClick, role: 'button', tabIndex: -1, 'aria-label': 'video card' })}
    >
      <Stack
        direction="row"
        sx={{ gap: 2, position: 'absolute', bottom: 16, left: '50%', minWidth: 'max-content', transform: 'translateX(-50%)' }}
      >
        <Stack direction="row" sx={{ ...blurEffect, alignItems: 'center', gap: 1.5, height: 72, borderRadius: 67, p: 1, pr: 3 }}>
          <Stack sx={{ ...blurEffect, width: 88, height: 56, borderRadius: 67, alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon name="tabler-video" size={40} color="text.primary" stroke={1} />
          </Stack>
          <Typography variant="subtitle1">02:00 Min</Typography>
        </Stack>
        <Stack sx={{ ...blurEffect, alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 67 }}>
          <SvgIcon name="tabler-player-play" size={40} color="text.primary" stroke={1} />
        </Stack>
      </Stack>
    </GraphicsCard>
  );
}
