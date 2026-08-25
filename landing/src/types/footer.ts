// @mui
import { GridProps } from '@mui/material/Grid';
import { LinkProps } from '@mui/material/Link';

interface ItemProps {
  label: string;
  link: LinkProps;
}

export interface FooterMenuProps {
  id: string | number;
  grid: GridProps;
  title: string;
  menu?: ItemProps[];
  megaMenu?: [];
  expanded?: boolean;
}
