// @mui
import { LinkProps } from '@mui/material/Link';

// @types
import { ImageCommonProps } from './graphics';
import { SpriteIconProps } from './icon';

interface ProcessListProps {
  primary: string;
}

export interface ProcessCardProps {
  title: string;
  description: string;
  list?: ProcessListProps[];
  icon: SpriteIconProps;
  image?: ImageCommonProps;
  animationDelay?: number;
  moreLink?: LinkProps;
}

export interface ProcessCardProps2 {
  title: string;
  description: string;
  list?: ProcessListProps[];
  number: string;
  image: ImageCommonProps;
  bgPosition: { xs?: string; sm?: string; md?: string };
  index?: number;
}

export interface ProcessCardProps3 {
  title: string;
  description: string;
  list?: ProcessListProps[];
  number: string;
}
