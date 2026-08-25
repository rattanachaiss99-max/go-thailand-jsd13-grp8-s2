// @mui
import { ButtonProps } from '@mui/material/Button';

// @types
import { ImageCommonProps } from './graphics';
import { ProfileProps } from './testimonial';

export interface TeamProps {
  heading: string;
  caption?: string;
  members: ProfileProps[];
  image?: ImageCommonProps;
  actionBtn?: ButtonProps;
  description?: string;
  isFilter?: boolean;
}
