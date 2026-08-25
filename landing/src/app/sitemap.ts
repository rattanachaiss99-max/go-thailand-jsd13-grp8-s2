// @next
import type { MetadataRoute } from 'next';

// @project
import { PAGE_PATH } from '@/path';

const baseUrl = process.env.NEXT_PUBLIC_METADATA_BASE || 'http://localhost:3000';

const routes = [
  { url: ``, priority: 1 },
  { url: PAGE_PATH.aboutPage, priority: 0.8 },
  { url: PAGE_PATH.careerPage, priority: 0.7 },
  { url: PAGE_PATH.privacyPolicyPage, priority: 0.7 },
  { url: PAGE_PATH.faqPage, priority: 0.9 },
  { url: PAGE_PATH.pricingPage, priority: 0.9 },
  { url: PAGE_PATH.contactPage, priority: 0.5 }
];

/***************************  SITEMAP  ***************************/

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    priority: route.priority
  }));
}
