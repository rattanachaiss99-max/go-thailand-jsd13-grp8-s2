'use client';

// @mui
import { useColorScheme } from '@mui/material/styles';

// @types
import { ImageCommonProps, ImageComponentProps } from '@/types/graphics';

/***************************  IMAGE - TYPE IDENTIFY ***************************/

function isImageComponentProps(value: ImageCommonProps): value is ImageComponentProps {
  return (value as ImageComponentProps).light !== undefined && (value as ImageComponentProps).dark !== undefined;
}

/***************************  COMMON - IMAGE PATH  ***************************/

export default function GetImagePath(image: string | ImageComponentProps) {
  const { colorScheme } = useColorScheme();

  return isImageComponentProps(image) ? image[colorScheme || 'light'] : image;
}
