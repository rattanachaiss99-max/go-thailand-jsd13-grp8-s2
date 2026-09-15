import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import ProvinceKnowledge from '@/server/models/ProvinceKnowledge';
import { getProvinceMapConfig, PROVINCE_GEO_CENTERS } from '@/data/provinceMapData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceParam = searchParams.get('province') || 'chiang-rai';
    const normSlug = provinceParam.toLowerCase().trim().replace(/[-_]province$/, '');

    // 1. Get base configured features
    const baseConfig = getProvinceMapConfig(normSlug);

    // 2. Try enriching with MongoDB Atlas knowledge if available
    try {
      await connectDB();
      const doc = await ProvinceKnowledge.findOne({
        $or: [{ slug: normSlug }, { provinceId: normSlug.toUpperCase() }]
      })
        .select('nameTh nameEn highlights unseenGems signatureFood summary travelTips')
        .lean();

      if (doc) {
        baseConfig.nameTh = doc.nameTh || baseConfig.nameTh;
        baseConfig.nameEn = doc.nameEn || baseConfig.nameEn;

        // If doc has highlights and the base config has few points, enrich them
        if (doc.highlights && doc.highlights.length > 0 && baseConfig.points.length <= 1) {
          const centerGeo = PROVINCE_GEO_CENTERS[normSlug] || { lat: 13.7563, lng: 100.5018, zoom: 10 };
          const newPoints = doc.highlights.map((hl: string, index: number) => {
            // Offset coordinates slightly around the province center for visual distribution
            const angle = (index / doc.highlights.length) * 2 * Math.PI;
            const radius = 0.08 + (index % 3) * 0.04;
            const lat = centerGeo.lat + Math.sin(angle) * radius;
            const lng = centerGeo.lng + Math.cos(angle) * radius;

            return {
              id: `${normSlug}-poi-${index + 1}`,
              name: hl,
              nameEn: `${hl} (${doc.nameEn})`,
              category: (index % 2 === 0 ? 'nature' : 'culture') as any,
              coordinates: [Number(lat.toFixed(4)), Number(lng.toFixed(4))] as [number, number],
              rating: 4.8,
              description: `ไฮไลต์ท่องเที่ยวสำคัญแห่ง ${doc.nameTh}: ${hl}`,
              district: `อำเภอใน${doc.nameTh}`,
              tags: ['ไฮไลต์แนะนำ', doc.nameTh],
              icon: '📍'
            };
          });

          baseConfig.points = newPoints;
        }
      }
    } catch (dbErr) {
      console.warn('[API province-features] MongoDB enrich error, using static vectors:', dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        province: normSlug,
        config: baseConfig
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching province features:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch features' },
      { status: 500 }
    );
  }
}
