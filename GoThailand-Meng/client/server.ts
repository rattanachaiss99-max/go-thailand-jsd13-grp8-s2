import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB-compatible Document Store
interface MongoDocument {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

class MongoCollection<T extends Record<string, any>> {
  private items: Map<string, T & MongoDocument> = new Map();

  constructor(public collectionName: string) {}

  async insertOne(doc: T): Promise<T & MongoDocument> {
    const _id = (doc as any)._id || 'gt_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    const fullDoc: T & MongoDocument = {
      ...doc,
      _id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.set(_id, fullDoc);
    return fullDoc;
  }

  async find(filter?: (item: T & MongoDocument) => boolean): Promise<(T & MongoDocument)[]> {
    const all = Array.from(this.items.values());
    if (!filter) return all;
    return all.filter(filter);
  }

  async findOne(filter: (item: T & MongoDocument) => boolean): Promise<(T & MongoDocument) | null> {
    const all = Array.from(this.items.values());
    return all.find(filter) || null;
  }

  async count(): Promise<number> {
    return this.items.size;
  }
}

// Collections
const GuidesDb = new MongoCollection<any>('guides');
const BookingsDb = new MongoCollection<any>('bookings');

// Seed Guides in MongoDB collection
const initialGuides = [
  {
    id: 'narin',
    name: 'Niran S.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1400&q=80',
    location: 'Bangkok, Thailand',
    rating: 4.9,
    reviewCount: 128,
    pricePerDay: 2500,
    specialties: ['Culture', 'Local Food'],
    languages: ['English', 'Thai'],
    bio: "Sawasdee krub! I specialize in showing you the authentic heart of Bangkok. From hidden street food stalls to serene lesser-known temples, let's explore my city beyond the guidebooks.",
    yearsExp: '5+',
    travelersCount: '500+',
    verified: true,
    services: [
      {
        id: 'city-tour',
        title: 'Bangkok City Tour',
        description: "A comprehensive overview of the city's iconic landmarks and vibrant neighborhoods.",
        image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'food-tour',
        title: 'Local Food Tour',
        description: 'Dive into the flavors of Chinatown and hidden alleys tasting authentic street cuisine.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'mali',
    name: 'Mali V.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    location: 'Chiang Mai',
    rating: 5.0,
    reviewCount: 85,
    pricePerDay: 3000,
    specialties: ['Culinary Arts', 'Cultural Expert'],
    languages: ['English', 'French'],
    bio: 'Passionate Chiang Mai native with a love for Lanna gastronomy, organic hill tribe tea plantations, and artisan craft villages.',
    yearsExp: '6+',
    travelersCount: '420+',
    verified: true,
    services: [
      {
        id: 'chiang-mai-temples',
        title: 'Old City & Doi Suthep',
        description: 'Discover the sacred hillside temples, monk chants, and panoramic views of northern Thailand.',
        image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'organic-farm-cooking',
        title: 'Farm-to-Table Cooking',
        description: 'Pick fresh galangal and lemongrass at our organic garden and master traditional Khao Soi curry.',
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'somchai',
    name: 'Somchai P.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    location: 'Phuket & Krabi',
    rating: 4.8,
    reviewCount: 94,
    pricePerDay: 2800,
    specialties: ['Adventure & Nature', 'Photography'],
    languages: ['English', 'German'],
    bio: 'Island explorer and licensed scuba instructor. I lead unhurried boat journeys to secluded Andaman lagoons away from crowds.',
    yearsExp: '4+',
    travelersCount: '380+',
    verified: true,
    services: [
      {
        id: 'hidden-lagoon',
        title: 'Andaman Secret Lagoons',
        description: 'Sea kayaking through limestone sea caves and emerald hidden tidal pools in Phang Nga Bay.',
        image: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'chanya',
    name: 'Chanya K.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    location: 'Ayutthaya',
    rating: 4.9,
    reviewCount: 110,
    pricePerDay: 2200,
    specialties: ['Culture & History', 'Photography'],
    languages: ['English', 'Mandarin'],
    bio: 'History graduate dedicated to bringing ancient Siamese empires to life with architectural insights and golden hour photo tours.',
    yearsExp: '5+',
    travelersCount: '490+',
    verified: true,
    services: [
      {
        id: 'ayutthaya-cycling',
        title: 'Historic Ruins Cycling Tour',
        description: 'Bicycle through UNESCO World Heritage ruins and sunset river cruise around the ancient island city.',
        image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'kittisak',
    name: 'Kittisak (Kit) T.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    location: 'Chiang Rai',
    rating: 4.9,
    reviewCount: 78,
    pricePerDay: 2700,
    specialties: ['Cultural Expert', 'Adventure & Nature'],
    languages: ['English', 'Thai'],
    bio: 'Born in the mist-veiled hills of Mae Salong. Specializes in tea plantation hikes, White Temple architecture, and authentic Akha village cultural visits.',
    yearsExp: '7+',
    travelersCount: '340+',
    verified: true,
    services: [
      {
        id: 'golden-triangle-expedition',
        title: 'Golden Triangle & Mekong Vista',
        description: 'Scenic journey from the historic river confluence to hilltop mountain shrines with tea tasting.',
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'siriporn',
    name: 'Siriporn (Ploy) W.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    location: 'Koh Samui',
    rating: 5.0,
    reviewCount: 64,
    pricePerDay: 3200,
    specialties: ['Adventure & Nature', 'Photography'],
    languages: ['English', 'Spanish'],
    bio: 'Island naturalist and certified marine guide. I craft private catamaran adventures around Ang Thong Marine Park and secret sunset viewpoints on Samui.',
    yearsExp: '5+',
    travelersCount: '290+',
    verified: true,
    services: [
      {
        id: 'angthong-marine',
        title: 'Ang Thong Emerald Lagoon',
        description: 'Private longtail sailing, snorkeling with reef fish, and panoramic island summit hike.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'arun',
    name: 'Arun B.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    location: 'Sukhothai',
    rating: 4.9,
    reviewCount: 102,
    pricePerDay: 2400,
    specialties: ['Cultural Expert', 'Photography'],
    languages: ['English', 'Japanese'],
    bio: 'Archaeology enthusiast and former museum educator. Delve into the dawn of Thai civilization among lotus ponds and ancient terracotta Buddha statues.',
    yearsExp: '8+',
    travelersCount: '620+',
    verified: true,
    services: [
      {
        id: 'sukhothai-dawn',
        title: 'Sunrise Historical Park by Bike',
        description: 'Glide through ancient gates in the soft morning mist with stories of the first Siamese kingdom.',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'natacha',
    name: 'Natacha (Nat) R.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    location: 'Bangkok Old Town',
    rating: 4.9,
    reviewCount: 115,
    pricePerDay: 2600,
    specialties: ['Food & Culinary', 'Cultural Expert'],
    languages: ['English', 'Korean'],
    bio: "Culinary storyteller and neighborhood native. Join me for an evening of Michelin-guide street cart discoveries and secret canal-side cocktails in Bangkok's Talat Noi.",
    yearsExp: '4+',
    travelersCount: '480+',
    verified: true,
    services: [
      {
        id: 'midnight-food-tuk-tuk',
        title: 'Midnight Tuk-Tuk Food Safari',
        description: 'Experience Pad Thai, crispy pork belly, and night flower markets after dark when the city cools.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'thirawat',
    name: 'Thirawat (Toon) M.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    location: 'Hua Hin',
    rating: 4.8,
    reviewCount: 56,
    pricePerDay: 2500,
    specialties: ['Adventure & Nature', 'Cultural Expert'],
    languages: ['English', 'German'],
    bio: 'Lifelong resident of the Royal Coast. I organize gentle cave explorations into Phraya Nakhon pavilion and private visits to seaside vineyards.',
    yearsExp: '6+',
    travelersCount: '310+',
    verified: true,
    services: [
      {
        id: 'phraya-nakhon-cave',
        title: 'Phraya Nakhon Secret Pavilion',
        description: 'Trek through coastal limestone national parks to witness morning sunlight illuminating the royal golden pavilion.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'apinya',
    name: 'Apinya (Noon) S.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    location: 'Pattaya & Chonburi',
    rating: 4.8,
    reviewCount: 72,
    pricePerDay: 2300,
    specialties: ['Adventure & Nature', 'Local Food'],
    languages: ['English', 'Russian'],
    bio: 'Marine sports lover and local seafood connoisseur. Escape the crowded tourist strips to serene Koh Larn coves and traditional fishermen piers in Naklua.',
    yearsExp: '5+',
    travelersCount: '390+',
    verified: true,
    services: [
      {
        id: 'sanctuary-of-truth',
        title: 'Sanctuary of Truth & Artisan Carvings',
        description: 'Guided tour through the grand hand-carved wooden ocean temple with traditional dance exhibition.',
        image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

for (const guide of initialGuides) {
  GuidesDb.insertOne(guide);
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'GoThailand Guide Booking API',
    database: 'MongoDB Document Engine',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/guides - list guides with filters
app.get('/api/guides', async (req: Request, res: Response) => {
  try {
    const { category, language, maxPrice, search } = req.query;

    const guides = await GuidesDb.find((item) => {
      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.specialties.some((s: string) => s.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (category && typeof category === 'string' && category !== 'all') {
        const hasCategory = item.specialties.some((s: string) =>
          s.toLowerCase().includes(category.toLowerCase())
        );
        if (!hasCategory) return false;
      }
      if (language && typeof language === 'string') {
        const hasLang = item.languages.some((l: string) =>
          l.toLowerCase().includes(language.toLowerCase())
        );
        if (!hasLang) return false;
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        if (item.pricePerDay > Number(maxPrice)) return false;
      }
      return true;
    });

    res.json({ success: true, count: guides.length, data: guides });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve guides' });
  }
});

// GET /api/guides/:id - guide detail
app.get('/api/guides/:id', async (req: Request, res: Response) => {
  try {
    const guide = await GuidesDb.findOne((g) => g.id === req.params.id);
    if (!guide) {
      return res.status(404).json({ success: false, error: 'Guide not found' });
    }
    res.json({ success: true, data: guide });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/bookings - create booking
app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const bookingReference = payload.bookingReference || `GT-GUIDE-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = await BookingsDb.insertOne({
      ...payload,
      bookingReference,
      status: 'confirmed',
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Booking created and confirmed successfully',
      data: newBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

// GET /api/bookings/:reference - fetch booking
app.get('/api/bookings/:reference', async (req: Request, res: Response) => {
  try {
    const booking = await BookingsDb.findOne(
      (b) => b.bookingReference === req.params.reference || b._id === req.params.reference
    );
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/bookings - list all bookings
app.get('/api/bookings', async (req: Request, res: Response) => {
  try {
    const bookings = await BookingsDb.find();
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GoThailand Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
