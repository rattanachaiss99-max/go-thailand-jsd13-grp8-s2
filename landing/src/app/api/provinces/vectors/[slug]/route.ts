import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import ProvinceKnowledge from '@/server/models/ProvinceKnowledge';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    await connectDB();

    const cleanSlug = slug.toLowerCase().trim().replace(/[-_]province$/, '');
    const doc = await ProvinceKnowledge.findOne(
      {
        $or: [
          { slug: cleanSlug },
          { slug: cleanSlug.replace(/-/g, '') },
          { provinceId: cleanSlug.toUpperCase() }
        ]
      },
      { vectorData: 1, nameTh: 1, nameEn: 1, slug: 1, provinceId: 1, region: 1 }
    );

    if (!doc || !doc.vectorData) {
      return NextResponse.json(
        { success: false, error: 'Vector data not found for province' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      province: {
        provinceId: doc.provinceId,
        slug: doc.slug,
        nameTh: doc.nameTh,
        nameEn: doc.nameEn,
        region: doc.region
      },
      vectorData: doc.vectorData
    });
  } catch (error: any) {
    console.error('Error fetching province vector:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
