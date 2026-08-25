import { ReactNode } from 'react';

// @mui
import { LinkProps } from '@mui/material/Link';

// @project
import { SpriteIconProps } from './icon';

interface SocialProps {
  icon: SpriteIconProps;
  link: LinkProps;
}

export interface BlogDetailsProps {
  date: string;
  heading: string;
  image: { src: string; name: string; role: string };
  socialIcons: SocialProps[];
  mainImage: string;
  title?: string;
  description: string;
  subTitle?: string;
  blogDetails: {
    title: string;
    content: ReactNode;
    heading1?: string;
    dotList?: { title?: string; description: string }[];
    title1?: string;
    heading2?: string;
  }[];
}
