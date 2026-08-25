import { BgImageProps } from './graphics';

export interface GalleryImageList {
  index?: number;
  title?: string;
  src: BgImageProps;
}

export interface GalleryProps {
  heading: string;
  caption?: string;
  images: GalleryImageList[];
}
