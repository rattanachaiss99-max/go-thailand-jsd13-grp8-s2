import { ReactElement } from 'react';

// @mui
import { ButtonProps } from '@mui/material/Button';
import { ChipProps } from '@mui/material/Chip';
import { LinkProps } from '@mui/material/Link';

export interface SmallHeroProps {
  chip?: {
    label: ChipProps['label'];
    link?: LinkProps;
  };
  headLine: string | ReactElement;
  captionLine?: string;
  exploreBtn?: ButtonProps;
}

export interface SmallHeroProps2 {
  chip?: {
    label: ChipProps['label'];
    link?: LinkProps;
  };
  heading: string;
  caption?: string;
  exploreBtn?: ButtonProps;
}
