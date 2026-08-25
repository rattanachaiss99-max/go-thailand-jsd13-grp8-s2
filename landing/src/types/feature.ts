// @mui
import { ButtonProps } from '@mui/material/Button';
import { StackProps } from '@mui/material/Stack';
import { TypographyProps } from '@mui/material/Typography';

// @project
import { ImageCommonProps } from './graphics';
import { SpriteIconProps } from './icon';

export interface IconCardProps {
  icon: SpriteIconProps;
  title: string;
  content?: string;
  contentCard?: string | boolean;
  iconAvatar?: string | boolean;
  titleProps?: TypographyProps;
  stackProps?: StackProps;
  contentProps?: TypographyProps;
  animationDelay?: number;
  cardPadding?: { xs?: number; sm?: number; md?: number };
}

export interface TestimonialDataProps {
  image?: ImageCommonProps;
  features: IconCardProps[];
  progress?: number;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: SpriteIconProps;
}

export interface ImageCardProps {
  image?: ImageCommonProps;
  title: string;
  content?: string;
  animationDelay?: number;
  actionBtn?: ButtonProps;
}
