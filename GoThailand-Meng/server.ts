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
    name: 'Narin',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1400&q=80',
    location: 'Bangkok, Thailand',
    rating: 4.9,
    reviewCount: 128,
    pricePerDay: 2500,
    specialties: ['Culture', 'Local Food'],
    languages: ['English', 'Thai'],
    bio: 'Sawasdee krub! I specialize in showing you the authentic heart of Bangkok. From hidden street food stalls to serene lesser-known temples, let\'s explore my city beyond the guidebooks.',
    yearsExp: '5+',
    travelersCount: '500+',
    verified: true,
    services: [
      {
        id: 'city-tour',
        title: 'Bangkok City Tour',
        description: 'A comprehensive overview of the city\'s iconic landmarks and vibrant neighborhoods.',
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
