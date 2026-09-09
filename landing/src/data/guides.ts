/* ============================================================
   data/guides.ts
   Mock data of tourist guides ported from GoThailand-Meng
   Typed with TypeScript and compatible with Next.js 16 (ES5 build target).
   ============================================================ */

export interface GuideAvatarConfig {
  skin: string;
  hair: string;
  hairStyle: 'short' | 'long' | 'bun';
  shirt: string;
  bg1: string;
  bg2: string;
}

export interface Guide {
  id: number;
  name: string;
  description: string;
  rating: number;
  avatar: GuideAvatarConfig;
  languages: string[];
  specialty: string;
  pricePerDay: number;
  photoUrl: string;
  location: string;
}

// 9 Base guides matching Meng's original design
const baseGuides: Omit<Guide, 'id' | 'photoUrl'>[] = [
  {
    name: 'Aree J.',
    description: 'Let me show you the true heart of Bangkok!',
    rating: 5,
    avatar: { skin: '#f2c19a', hair: '#2b2320', hairStyle: 'long', shirt: '#1c2f7d', bg1: '#d9f2e4', bg2: '#a8dfc0' },
    languages: ['Thai', 'English'],
    specialty: 'Bangkok Temples & Street Food',
    pricePerDay: 1800,
    location: 'Bangkok'
  },
  {
    name: 'Somchai K.',
    description: 'Discover the secrets of Old Chiang Mai with me.',
    rating: 5,
    avatar: { skin: '#e8b184', hair: '#1f1a17', hairStyle: 'short', shirt: '#243b8f', bg1: '#e8e8ee', bg2: '#c3c7d8' },
    languages: ['Thai', 'English', 'Mandarin'],
    specialty: 'Old City & Lanna Culture',
    pricePerDay: 2000,
    location: 'Chiang Mai'
  },
  {
    name: 'Somchai W.',
    description: "Experience Lanna culture through a local's eyes.",
    rating: 5,
    avatar: { skin: '#eec39a', hair: '#241d18', hairStyle: 'short', shirt: '#d9c7a8', bg1: '#dcefd8', bg2: '#a9d3a2' },
    languages: ['Thai', 'English'],
    specialty: 'Handicrafts & Mountain Trekking',
    pricePerDay: 1900,
    location: 'Chiang Mai'
  },
  {
    name: 'Thai D.',
    description: "Exploring Bangkok's modern and ancient wonders together.",
    rating: 5,
    avatar: { skin: '#eab68b', hair: '#211a15', hairStyle: 'short', shirt: '#1c2f7d', bg1: '#f7e6cf', bg2: '#e3c193' },
    languages: ['Thai', 'English', 'Japanese'],
    specialty: 'Chao Phraya River & Historical Sites',
    pricePerDay: 2200,
    location: 'Bangkok'
  },
  {
    name: 'Somchai K.',
    description: 'Unveil Chiang Mai hidden gems and vibrant markets.',
    rating: 5,
    avatar: { skin: '#e5ac7e', hair: '#191411', hairStyle: 'short', shirt: '#cbb391', bg1: '#d8ecd4', bg2: '#a5cfa0' },
    languages: ['Thai', 'English'],
    specialty: 'Night Bazaar & Local Eateries',
    pricePerDay: 1700,
    location: 'Chiang Mai'
  },
  {
    name: 'Kari C.',
    description: 'Journey to Chiang Mai with a focus on Lanna art.',
    rating: 5,
    avatar: { skin: '#f0c49c', hair: '#26201b', hairStyle: 'short', shirt: '#243b8f', bg1: '#d5ecd0', bg2: '#a2cfae' },
    languages: ['Thai', 'English', 'French'],
    specialty: 'Art Galleries & Sacred Temples',
    pricePerDay: 2100,
    location: 'Chiang Mai'
  },
  {
    name: 'Kari D.',
    description: "Navigate Bangkok's bustling streets with a local expert.",
    rating: 5,
    avatar: { skin: '#e2a677', hair: '#17120f', hairStyle: 'short', shirt: '#8a5a33', bg1: '#4c5a68', bg2: '#2f3a45' },
    languages: ['Thai', 'English'],
    specialty: 'Hidden Canals & Chinatown',
    pricePerDay: 1850,
    location: 'Bangkok'
  },
  {
    name: 'Somchai T.',
    description: 'Explore Chiang Mai nature and spiritual sites.',
    rating: 5,
    avatar: { skin: '#f4c79f', hair: '#2b2320', hairStyle: 'long', shirt: '#1c2f7d', bg1: '#d7ecd8', bg2: '#a3cfae' },
    languages: ['Thai', 'English', 'German'],
    specialty: 'Doi Suthep & Eco Tourism',
    pricePerDay: 2300,
    location: 'Chiang Mai'
  },
  {
    name: 'Aliea G.',
    description: "Connecting you with Bangkok's authentic local flavors.",
    rating: 5,
    avatar: { skin: '#f1c096', hair: '#33241c', hairStyle: 'long', shirt: '#9aa2ad', bg1: '#f6e3cd', bg2: '#e0bd92' },
    languages: ['Thai', 'English', 'Spanish'],
    specialty: 'Michelin Street Food & Markets',
    pricePerDay: 2000,
    location: 'Bangkok'
  }
];

// Build 27 guides (3 pages x 9 guides)
export const guides: Guide[] = Array.from({ length: 27 }, function (_, index) {
  const base = baseGuides[index % baseGuides.length];
  const photoIndex = (index % 9) + 1;
  return {
    ...base,
    id: index + 1,
    photoUrl: '/images/Guide0' + photoIndex + '.jpg'
  };
});

export const PAGE_SIZE = 9;

/**
 * getAvailableDays(guideId, year, month)
 * Deterministic pseudo-random availability generator matching Meng's original formula
 */
export function getAvailableDays(guideId: number, year: number, month: number): number[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const available: number[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const seed = guideId * 731 + year * 37 + month * 13 + day * 3;
    const noise = Math.abs(Math.sin(seed)) * 10000;
    const fraction = noise - Math.floor(noise);
    if (fraction > 0.55) {
      available.push(day);
    }
  }
  return available;
}
