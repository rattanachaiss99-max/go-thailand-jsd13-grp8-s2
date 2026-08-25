import { ReactElement } from 'react';

// @mui
import { ButtonProps } from '@mui/material/Button';
import { LinkProps } from '@mui/material/Link';
import { SpriteIconProps } from './icon';

export interface FeatureProps {
  id: string | number;
  label: string;
  badge?: string;
}

interface PriceProps {
  monthly: number;
  yearly: number;
}

export interface PlanProps {
  title: string;
  icon?: SpriteIconProps;
  animationDelay?: number;
  description: string;
  active: boolean;
  price: number;
  features: FeatureProps[];
  about?: string;
  exploreLink: ButtonProps;
}

export interface Pricing2PlanProps {
  title: string;
  description: string;
  active: boolean;
  price: PriceProps;
  features: (string | number)[];
  about: string;
  exploreLink: ButtonProps;
}

interface CaptionProps {
  primary: string;
  icon?: SpriteIconProps;
}

export interface Pricing3PlanProps {
  title: string;
  description?: string;
  captionContent?: CaptionProps;
  active: boolean;
  price?: PriceProps;
  plan?: string;
  link?: LinkProps;
  features: FeatureProps[];
  animationDelay?: number;
  exploreLink: ButtonProps;
}

export interface Pricing4PlanProps {
  title: string;
  icon?: SpriteIconProps;
  active?: string;
  description: string;
  defaultUnit?: string;
  price?: number;
  features: (string | number)[];
  exploreLink: ButtonProps;
}

export interface Pricing5PlanProps {
  title: string;
  description?: string;
  active?: string | boolean;
  quantityTitle?: ReactElement;
  price: number;
  offerPrice?: number;
  exploreLink: ButtonProps;
  count?: number;
  link?: LinkProps;
  content?: string;
  contentLink?: LinkProps;
  animationDelay?: number;
  featuresID: (string | number)[];
  featureTitle: string;
}
