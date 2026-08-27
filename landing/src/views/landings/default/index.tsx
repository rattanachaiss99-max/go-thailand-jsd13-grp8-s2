'use client';

import { useLanguage } from '@/contexts/LanguageContext';

// @data
import { hero } from './data';

// @project
import { Hero1 } from '@/blocks/hero';

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

  return <Hero1 {...translatedHero} />;
}
