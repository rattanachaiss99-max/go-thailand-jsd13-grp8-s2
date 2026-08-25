import { ReactElement } from 'react';

// @mui
import { ButtonProps } from '@mui/material/Button';

//project
import { ListBadgeColors } from '@/enum';

// @types
import { BgImageProps, ImageCommonProps } from './graphics';
import { IconComponentProps } from './icon';

export interface GetInTouchProps {
  title?: string;
  description?: string;
  link: ButtonProps;
}

interface AnswerListProps {
  primary: string;
}

export interface AnswerProps {
  content: string;
  type: string;
  data: AnswerListProps[];
  color?: ListBadgeColors;
}

interface FaqListProps {
  question: string;
  answer: AnswerProps | string;
  category?: string | number;
}

export interface FaqProps {
  heading: string;
  caption?: string;
  faqList: FaqListProps[];
  bgImage?: BgImageProps;
  image?: ImageCommonProps;
  defaultExpanded?: string;
  icon?: ReactElement | IconComponentProps;
  icon2?: ReactElement | IconComponentProps;
}
