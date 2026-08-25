// @next
import { Metadata } from 'next';

// @project
import ComingSoon from '@/blocks/ComingSoon';
import { SEO_CONTENT } from '@/metadata';

/***************************  METADATA - COMING SOON  ***************************/

export const metadata: Metadata = { ...SEO_CONTENT.comingSoonPage };

/***************************  COMING SOON - DATA  ***************************/

const data = {
  chip: { chipCaption: '✦ Stay Tuned ✦ ' },
  description: 'From automation of people processes to creating on engaged and driven culture.',
  primaryBtn: { children: 'Notify Me' }
};

/***************************  BLOCK - COMING SOON  ***************************/

export default function BlockComingSoon() {
  return <ComingSoon {...data} />;
}
