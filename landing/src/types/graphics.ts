import { ReactElement, ReactNode } from 'react';

// @mui
import { SxProps } from '@mui/material/styles';
import { CardMediaProps } from '@mui/material/CardMedia';

// @project
import { DynamicComponentType } from '@/enum';

export interface ImageComponentProps {
  light: string;
  dark: string;
  position?: string;
}

export interface DynamicImageProps {
  component: string;
  type: DynamicComponentType;
  // eslint-disable-next-line
  props?: any;
}

export type ImageCommonProps = string | ReactElement | ImageComponentProps | DynamicImageProps;
export type AvatarImageProps = string | ImageComponentProps;
export type BgImageProps = string | ImageComponentProps;

export interface GraphicsImageProps {
  children?: ReactNode;
  image: ImageCommonProps;
  sx?: SxProps;
  cardMediaProps?: CardMediaProps;
}
