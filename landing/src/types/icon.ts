// @project
import { IconType } from '@/enum';

export interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
  stroke?: number;
}

export interface IconComponentProps {
  component: string;
  type: 'stroke' | 'fill' | 'twoTone';
  props?: IconProps;
}

export interface SVGIconProps {
  name: string;
  size?: number;
  type?: IconType;
  twoToneColor?: string;
  color?: string;
  stroke?: number;
}

export type SpriteIconProps = string | SVGIconProps;
