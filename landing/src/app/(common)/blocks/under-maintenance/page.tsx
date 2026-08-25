// @next
import { Metadata } from 'next';

// @project
import branding from '@/branding.json';
import { UnderMaintenancePage } from '@/blocks/maintenance';
import { SEO_CONTENT } from '@/metadata';

/***************************  METADATA - UNDER MAINTENANCE  ***************************/

export const metadata: Metadata = { ...SEO_CONTENT.underMaintenance };

/***************************  UNDER MAINTENANCE - DATA  ***************************/

const data = {
  heading: `${branding.brandName} is getting some tune up and some love. We'll be back soon. Thanks for your patience!`
};

/***************************  BLOCK - UNDER MAINTENANCE  ***************************/

export default function BlockUnderMaintenancePage() {
  return <UnderMaintenancePage {...data} />;
}
