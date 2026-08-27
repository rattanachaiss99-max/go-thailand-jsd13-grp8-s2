/* ============================================================
   moc-data/guides.js
   Mock data of the tourist guides shown on the Tourist Guide
   page (pages/TouristGuide.jsx).

   The page shows 9 cards per page and has 3 pages, so we create
   27 guides by repeating the 9 base guides below (each copy gets
   its own id). This keeps the mock file small but the pagination
   still really works.
   ============================================================ */

// ----- The 9 base guides (same as the design picture) ---------
// "avatar" describes how the GuideAvatar component draws the
// portrait cartoon: skin tone, hair color / style, shirt color
// and the two gradient colors of the background.
const baseGuides = [
  {
    id: 1,
    name: "Aree J.",
    description: "Let me show you the true heart of Bangkok!",
    rating: 5,
    avatar: { skin: "#f2c19a", hair: "#2b2320", hairStyle: "long", shirt: "#1c2f7d", bg1: "#d9f2e4", bg2: "#a8dfc0" },
  },
  {
    id: 2,
    name: "Somchai K.",
    description: "Discover the secrets of Old Chiang Mai with me.",
    rating: 5,
    avatar: { skin: "#e8b184", hair: "#1f1a17", hairStyle: "short", shirt: "#243b8f", bg1: "#e8e8ee", bg2: "#c3c7d8" },
  },
  {
    id: 3,
    name: "Somchai W.",
    description: "Experience Lanna culture through a local's eyes.",
    rating: 5,
    avatar: { skin: "#eec39a", hair: "#241d18", hairStyle: "short", shirt: "#d9c7a8", bg1: "#dcefd8", bg2: "#a9d3a2" },
  },
  {
    id: 4,
    name: "Thai D.",
    description: "Exploring Bangkok's modern and ancient wonders together.",
    rating: 5,
    avatar: { skin: "#eab68b", hair: "#211a15", hairStyle: "short", shirt: "#1c2f7d", bg1: "#f7e6cf", bg2: "#e3c193" },
  },
  {
    id: 5,
    name: "Somchai K.",
    description: "Unveil Chiang Mai's hidden gems and vibrant markets.",
    rating: 5,
    avatar: { skin: "#e5ac7e", hair: "#191411", hairStyle: "short", shirt: "#cbb391", bg1: "#d8ecd4", bg2: "#a5cfa0" },
  },
  {
    id: 6,
    name: "Kari C.",
    description: "Journey to Chiang Mai with a focus on Lanna art.",
    rating: 5,
    avatar: { skin: "#f0c49c", hair: "#26201b", hairStyle: "short", shirt: "#243b8f", bg1: "#d5ecd0", bg2: "#a2cfae" },
  },
  {
    id: 7,
    name: "Kari D.",
    description: "Navigate Bangkok's bustling streets with a local expert.",
    rating: 5,
    avatar: { skin: "#e2a677", hair: "#17120f", hairStyle: "short", shirt: "#8a5a33", bg1: "#4c5a68", bg2: "#2f3a45" },
  },
  {
    id: 8,
    name: "Somchai T.",
    description: "Explore Chiang Mai's nature and spiritual sites.",
    rating: 5,
    avatar: { skin: "#f4c79f", hair: "#2b2320", hairStyle: "long", shirt: "#1c2f7d", bg1: "#d7ecd8", bg2: "#a3cfae" },
  },
  {
    id: 9,
    name: "Aliea G.",
    description: "Connecting you with Bangkok's authentic local flavors.",
    rating: 5,
    avatar: { skin: "#f1c096", hair: "#33241c", hairStyle: "long", shirt: "#9aa2ad", bg1: "#f6e3cd", bg2: "#e0bd92" },
  },
];

// Build the full list: 3 pages x 9 guides = 27 guides.
// The base guides are simply repeated in the same order.
export const guides = Array.from({ length: 27 }, (_, index) => ({
  ...baseGuides[index % baseGuides.length], // copy one of the 9 base guides
  id: index + 1,                            // ...but give it a unique id
}));

// Number of guide cards displayed on one page (used by the pagination)
export const PAGE_SIZE = 9;

/* ------------------------------------------------------------
   getAvailableDays(guideId, year, month)
   Returns the list of day-numbers (e.g. [2, 3, 8, 9...]) that a
   guide is available in the given month.

   We use a tiny deterministic "hash" function: the same guide in
   the same month ALWAYS returns the same days, but different
   guides / months return different days. This way the calendar
   arrows (previous / next month) keep working without storing a
   full calendar for every guide.
   ------------------------------------------------------------ */
export function getAvailableDays(guideId, year, month) {
  // Number of days in the given month (day 0 of next month = last day of this month)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const available = [];
  for (let day = 1; day <= daysInMonth; day++) {
    // Mix guide id, year, month and day into one seed number
    const seed = guideId * 731 + year * 37 + month * 13 + day * 3;
    // sin-based hash -> always the same pseudo-random number for the same seed
    const noise = Math.abs(Math.sin(seed)) * 10000;
    const fraction = noise - Math.floor(noise); // value between 0 and 1
    if (fraction > 0.55) available.push(day);   // ~45% of the days are "available"
  }
  return available;
}
