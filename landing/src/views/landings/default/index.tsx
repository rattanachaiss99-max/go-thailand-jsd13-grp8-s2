'use client';

import { useLanguage } from '@/contexts/LanguageContext';

// @data
import { hero } from './data';

// @project
import { Hero1 } from '@/blocks/hero';
import FeaturedAccommodations from './FeaturedAccommodations';
// import ExploreDestinations from './ExploreDestinations'; // ซ่อนแผนที่หน้า Home ชั่วคราว (แสดงเฉพาะในหน้า Profile)
import StampShowcaseSection from './StampShowcaseSection';
import TripBundleBar from '@/components/ecommerce/TripBundleBar';

/***************************  PAGE - MAIN  ***************************/

export default function Main() {
  const { t } = useLanguage();

  const translatedHero = {
    ...hero,
    headLine: t('hero.headLine'),
    captionLine: t('hero.captionLine'),
    primaryBtn: {
      ...hero.primaryBtn,
      children: t('hero.primaryBtn')
    },
    secondaryBtn: {
      ...hero.secondaryBtn,
      children: t('hero.secondaryBtn')
    }
  };

  return (
    <>
      <Hero1 {...translatedHero} />
      {/* ซ่อน component แผนที่หน้า Home ชั่วคราว (แสดงเฉพาะในหน้า Profile) */}
      {/* <ExploreDestinations /> */}
      <StampShowcaseSection />
      <FeaturedAccommodations />
      <TripBundleBar />
    </>
  );
}

