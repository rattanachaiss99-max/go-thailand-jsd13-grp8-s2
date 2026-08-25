// @types
import { ImageCommonProps } from './graphics';
import { SpriteIconProps } from './icon';

export interface MarqueesDataProps {
  id: string;
  // Marquee Props - https://www.npmjs.com/package/react-fast-marquee#props
  // eslint-disable-next-line
  marqueeProps: any;
  data: TagProps[];
}

export interface TagProps {
  label: string;
  image?: ImageCommonProps;
  icon?: SpriteIconProps;
}
