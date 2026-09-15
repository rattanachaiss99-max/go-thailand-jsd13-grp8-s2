import { ReactElement } from 'react';

// @mui
import { ButtonProps } from '@mui/material/Button';

// @project
import { SpriteIconProps } from './icon';
import { MenuFooterProps, MenuItemsProps } from './mega-menu';
import { Themes } from '@/config';
import { MegaMenuType } from '@/enum';

interface NavMegamenuProps {
  type: MegaMenuType;
  toggleBtn: ButtonProps;
  menuItems: MenuItemsProps[];
  footerData?: ReactElement | MenuFooterProps;
  bannerData?: ReactElement;
  popperOffset?: number;
  popperOffsetX?: number;
  popperWidth?: number;
  hoverToggler?: boolean;
}

export interface NavSubItemProps {
  id: string | number;
  title: string;
  link: string;
  icon?: string;
  badge?: string;
  desc?: string;
}

export interface NavItemProps {
  id: string | number;
  title: string;
  link?: string;
  target?: string;
  icon?: SpriteIconProps;
  expanded?: boolean;
  megaMenu?: NavMegamenuProps;
  children?: NavSubItemProps[];
}

export interface NavbarContentProps {
  landingBaseUrl?: string;
  navItems?: NavItemProps[];
  primaryBtn?: ButtonProps;
  secondaryBtn?: ButtonProps;
  customization?: boolean;
  selectedTheme?: Themes;
  animated?: boolean;
}
