// @types
import { AvatarImageProps } from './graphics';
import { SpriteIconProps } from './icon';

export interface AvatarGroupProps {
  avatar: AvatarImageProps;
}

export interface ListProps {
  primary: string;
  icon?: SpriteIconProps;
}
