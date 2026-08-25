// @mui
import { ButtonProps } from '@mui/material/Button';

// @project
import { BgImageProps } from './graphics';
import { SpriteIconProps } from './icon';

interface ContactProps {
  address: string;
  email: string;
  phone: string;
  time?: string;
}

export interface ContactUsFormProps {
  firstName: string;
  lastName: string;
  email: string;
  dialcode: string;
  phone: string;
  message: string;
}

export interface ContactCardProps {
  icon: SpriteIconProps;
  title: string;
  content: string;
  animationDelay?: number;
  link?: ButtonProps;
}

export interface ContactCard2Props {
  icon: SpriteIconProps;
  title: string;
  content: string;
  link?: string;
}

export interface ContactUsProps {
  heading: string;
  caption?: string;
  contactDetails: ContactProps;
  bgImage?: BgImageProps;
}

export interface ContactUsProps2 {
  heading?: string;
  caption?: string;
  list?: ContactCardProps[];
  showForm?: boolean;
}
