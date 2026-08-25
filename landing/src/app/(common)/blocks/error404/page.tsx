// @next
import { Metadata } from 'next';

// @project
import { Error404Page } from '@/blocks/maintenance';
import { SEO_CONTENT } from '@/metadata';

/***************************  METADATA - ERROR 404  ***************************/

export const metadata: Metadata = { ...SEO_CONTENT.error404Page };

/***************************  ERROR 404 - DATA  ***************************/

const data = {
  primaryBtn: { children: 'Back to Home Page', href: '/', sx: { textTransform: 'none' } },
  heading: `Looks like you've taken a wrong turn. Lets get you back on track!`
};

/***************************  BLOCK - ERROR 404  ***************************/

export default function BlockError404Page() {
  return <Error404Page {...data} />;
}
