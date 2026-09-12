import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import ProvinceKnowledge from '@/server/models/ProvinceKnowledge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region')?.toLowerCase().trim();
    const slugsParam = searchParams.get('slugs');

    await connectDB();

    const query: Record<string, any> = {
      'vectorData.d': { $exists: true }
    };

    if (region && region !== 'all') {
      query.region = region;
    }

    if (slugsParam) {
      const slugs = slugsParam
        .split(',')
        .map((s) => s.toLowerCase().trim().replace(/[-_]province$/, ''))
        .filter(Boolean);

      if (slugs.length > 0) {
        query.$or = [
          { slug: { $in: slugs } },
          { provinceId: { $in: slugs.map((s) => s.toUpperCase()) } }
        ];
      }
    }

    const docs = await ProvinceKnowledge.find(
      query,
      {
        provinceId: 1,
        slug: 1,
        nameTh: 1,
        nameEn: 1,
        region: 1,
        vectorData: 1
      }
    ).lean();

    const vectorsMap: Record<string, any> = {};
    for (const doc of docs) {
      if (doc.vectorData) {
        const item = {
          provinceId: doc.provinceId,
          slug: doc.slug,
          nameTh: doc.nameTh,
          nameEn: doc.nameEn,
          region: doc.region,
          vectorData: doc.vectorData
        };
        vectorsMap[doc.slug] = item;
        vectorsMap[doc.provinceId] = item;
      }
    }

    return NextResponse.json(
      {
        success: true,
        count: docs.length,
        region: region || 'all',
        vectors: vectorsMap
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
        }
      }
    );
  } catch (error: any) {
    console.error('Error batch fetching province vectors:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
