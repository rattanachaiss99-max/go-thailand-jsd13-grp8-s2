// @mui
import { ButtonProps } from '@mui/material/Button';

// @types
import { BgImageProps } from './graphics';

export interface BlockProps {
  counter: number;
  caption: string;
  defaultUnit?: string;
  progress?: number;
  animationDelay?: number;
}

export interface MetricsProps {
  heading?: string;
  caption?: string;
  bgImage?: BgImageProps;
  blockDetail: BlockProps[];
  exploreBtn?: ButtonProps;
}
