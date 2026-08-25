// next
import Link from 'next/link';

// @mui
import IconButton from '@mui/material/IconButton';
import Stack, { StackProps } from '@mui/material/Stack';

// @project
import branding from '@/branding.json';
import SvgIcon from '@/components/SvgIcon';
import { IconType } from '@/enum';

/***************************  NAVBAR - SOCIAL ICON  ***************************/

export default function SocialIcons({ sx }: StackProps) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: { xs: 1, md: 1.5 }, ...sx }}>
      <IconButton
        rel="noopener noreferrer"
        aria-label="github"
        component={Link}
        href={branding.company.socialLink.github}
        sx={{ bgcolor: 'grey.200' }}
      >
        <SvgIcon name="tabler-filled-brand-github" type={IconType.FILL} />
      </IconButton>
      <IconButton
        rel="noopener noreferrer"
        aria-label="discord"
        component={Link}
        href={branding.company.socialLink.discord}
        sx={{ bgcolor: 'grey.200' }}
      >
        <SvgIcon name="tabler-filled-discord" type={IconType.FILL} />
      </IconButton>
      <IconButton
        rel="noopener noreferrer"
        aria-label="youtube"
        component={Link}
        href={branding.company.socialLink.youtube}
        sx={{ bgcolor: 'grey.200' }}
      >
        <SvgIcon name="tabler-filled-youtube" type={IconType.FILL} />
      </IconButton>
    </Stack>
  );
}
