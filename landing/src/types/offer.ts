// @mui
import { ButtonProps } from '@mui/material/Button';
import { LinkProps } from '@mui/material/Link';
import { SpriteIconProps } from './icon';

export interface OfferProps {
  heading: string;
  caption: string;
  primaryBtn: ButtonProps;
  secondaryBtn?: ButtonProps;
  handleClick?: () => void;
  icon: SpriteIconProps;
}

export interface Offer3Props {
  offer: {
    label: string;
    secondaryLabel?: string;
    link?: LinkProps;
  };
  handleClick?: () => void;
}
