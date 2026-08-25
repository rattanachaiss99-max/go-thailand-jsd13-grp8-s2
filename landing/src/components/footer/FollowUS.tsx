// @mui
import Avatar from '@mui/material/Avatar';
import Link, { LinkProps } from '@mui/material/Link';
import Stack from '@mui/material/Stack';

// @project
import { NextLink } from '../routes';
import branding from '@/branding.json';
import SvgIcon from '@/components/SvgIcon';
import Typeset from '@/components/Typeset';
import { IconType } from '@/enum';

// @types
import { SpriteIconProps } from '@/types/icon';

interface SocialProps {
  icon: SpriteIconProps;
  link: LinkProps;
}

/***************************  FOLLOW US - DATA  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
const socialIcons: SocialProps[] = [
  {
    icon: 'tabler-filled-linkedin',
    link: { href: `${branding.company.socialLink.linkedin}`, ...linkProps }
  },
  // {
  //   icon: 'tabler-filled-instagram',
  //   link: { href: `${branding.company.socialLink.instagram}` }
  // },
  {
    icon: 'tabler-filled-facebook',
    link: { href: `${branding.company.socialLink.facebook}`, ...linkProps }
  },
  {
    icon: 'tabler-filled-youtube',
    link: { href: `${branding.company.socialLink.youtube}`, ...linkProps }
  },
  {
    icon: 'tabler-filled-brand-github',
    link: { href: `${branding.company.socialLink.github}`, ...linkProps }
  },
  {
    icon: 'tabler-filled-dribble',
    link: { href: `${branding.company.socialLink.dribble}`, ...linkProps }
  }
];

interface Props {
  heading?: string | boolean;
  color?: string;
}

/***************************  FOOTER - FOLLOW US  ***************************/

export default function FollowUS({ heading = true, color }: Props) {
  return (
    <Stack sx={{ alignItems: { xs: 'center', md: 'flex-start' }, gap: 2, textAlign: { xs: 'center', md: 'left' } }}>
      {heading && <Typeset {...{ heading: typeof heading === 'string' ? heading : 'Follow us on', headingProps: { variant: 'h4' } }} />}
      <Stack direction="row" sx={{ gap: { xs: 0.5, sm: 1.5 } }}>
        {socialIcons.map((item, index) => (
          <Link
            component={NextLink}
            key={index}
            {...item.link}
            sx={{ ...item.link?.sx }}
            rel="noopener noreferrer"
            aria-label="follow us on social media"
          >
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: color || 'grey.200',
                width: { xs: 40, sm: 52, lg: 56 },
                height: { xs: 40, sm: 52, lg: 56 },
                borderRadius: 3,
                ':hover': { bgcolor: 'grey.300' }
              }}
            >
              <SvgIcon type={IconType.FILL} {...(typeof item.icon === 'string' ? { name: item.icon } : { ...item.icon })} />
            </Avatar>
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}
