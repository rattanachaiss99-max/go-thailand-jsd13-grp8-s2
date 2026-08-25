// @mui
import { ButtonProps } from '@mui/material/Button';
import { LinkProps } from '@mui/material/Link';

// @project
import { ImageCommonProps } from './graphics';
import { SpriteIconProps } from './icon';
import { Themes } from '@/config';

export interface MenuItemsProps {
  icon?: SpriteIconProps;
  title?: string;
  content?: string;
  selected?: boolean;
  theme?: Themes;
  image?: ImageCommonProps;
  link?: LinkProps;
  status?: string;
  itemsList?: MenuItemsProps[]; // Group menu
}

export interface MenuFooterProps {
  title: string;
  link: ButtonProps;
  list: MenuItemsProps[];
}
