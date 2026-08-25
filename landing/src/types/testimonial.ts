import { ReactElement } from 'react';

// @mui
import { LinkProps } from '@mui/material/Link';
import { ButtonProps } from '@mui/material/Button';

// @project
import { AvatarImageProps, BgImageProps, ImageCommonProps } from './graphics';

interface SocialProps {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
}
export interface ProfileProps {
  avatar: AvatarImageProps;
  name: string;
  role: string;
  socialLinks?: SocialProps;
  badge?: string | ReactElement;
}

export interface TestimonialDataProps {
  title?: string;
  image?: ImageCommonProps;
  bgImage?: BgImageProps;
  ratings?: number;
  videoSrc?: string;
  review: string;
  profile: ProfileProps;
}

export interface TestimonialProps {
  heading: string;
  caption?: string;
  primaryBtn?: ButtonProps;
  testimonials: TestimonialDataProps[];
  link?: LinkProps;
}
