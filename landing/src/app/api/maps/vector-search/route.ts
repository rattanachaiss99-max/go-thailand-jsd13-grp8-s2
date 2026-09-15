import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import ProvinceChunk from '@/server/models/ProvinceChunk';
import { getProvinceMapConfig, MapPointFeature, MapLineFeature, MapAreaFeature } from '@/data/provinceMapData';
import { GoogleGenerativeAI } from '@google/generative-ai';

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const norm = Math.sqrt(normA) * Math.sqrt(normB);
  return norm === 0 ? 0 : dot / norm;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, province } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim();
    const normProvince = (province || 'chiang-rai').toLowerCase().trim().replace(/[-_]province$/, '');
    const config = getProvinceMapConfig(normProvince);

    let matchedPoints: MapPointFeature[] = [];
    let matchedLines: MapLineFeature[] = [];
    let matchedAreas: MapAreaFeature[] = [];
    let searchSource: 'vector' | 'keyword' = 'keyword';

    // 1. Try Semantic Vector Search if Gemini API Key exists
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
      try {
        await connectDB();
        const genAI = new GoogleGenerativeAI(apiKey);
        const embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
        const embedRes = await embedModel.embedContent({
          content: { role: 'user', parts: [{ text: cleanQuery }] },
          outputDimensionality: 768
        } as any);

        const queryVector = embedRes.embedding.values;

        // Query ProvinceChunks with vector embeddings for this province
        const chunks = await ProvinceChunk.find({
          embedding: { $exists: true }
        })
          .select('title content category amphoeTh metadata embedding')
          .lean();

        if (chunks.length > 0) {
          const scoredChunks = chunks
            .map((chunk: any) => ({
              chunk,
              score: cosineSimilarity(queryVector, chunk.embedding)
            }))
            .sort((a, b) => b.score - a.score);

          // Top scoring concepts
          const topKeywords = scoredChunks.slice(0, 5).map((s) => s.chunk.title.toLowerCase());

          // Match local features against top vector concepts
          matchedPoints = config.points.filter((p) => {
            const pText = `${p.name} ${p.description} ${(p.tags || []).join(' ')}`.toLowerCase();
            return topKeywords.some((kw) => pText.includes(kw) || kw.includes(p.name.toLowerCase()));
          });

          matchedLines = config.lines.filter((l) => {
            const lText = `${l.name} ${l.hwy || ''} ${l.description || ''}`.toLowerCase();
            return topKeywords.some((kw) => lText.includes(kw) || kw.includes(l.name.toLowerCase()));
          });

          matchedAreas = config.areas.filter((a) => {
            const aText = `${a.name} ${a.description || ''}`.toLowerCase();
            return topKeywords.some((kw) => aText.includes(kw) || kw.includes(a.name.toLowerCase()));
          });

          if (matchedPoints.length > 0 || matchedLines.length > 0 || matchedAreas.length > 0) {
            searchSource = 'vector';
          }
        }
      } catch (vectorErr) {
        console.warn('[Vector Search API] Embedding error, falling back to keyword search:', vectorErr);
      }
    }

    // 2. Fallback / Augment with Keyword & Fuzzy Search
    if (matchedPoints.length === 0 && matchedLines.length === 0 && matchedAreas.length === 0) {
      const qLower = cleanQuery.toLowerCase();
      const keywords = qLower
        .split(/\s+/)
        .filter((k) => k.length > 0);

      matchedPoints = config.points.filter((p) => {
        const text = `${p.name} ${p.nameEn || ''} ${p.district || ''} ${p.description} ${(p.tags || []).join(' ')}`.toLowerCase();
        return keywords.some((k) => text.includes(k));
      });

      matchedLines = config.lines.filter((l) => {
        const text = `${l.name} ${l.hwy || ''} ${l.description || ''}`.toLowerCase();
        return keywords.some((k) => text.includes(k));
      });

      matchedAreas = config.areas.filter((a) => {
        const text = `${a.name} ${a.description || ''}`.toLowerCase();
        return keywords.some((k) => text.includes(k));
      });

      searchSource = 'keyword';
    }

    return NextResponse.json({
      success: true,
      query: cleanQuery,
      province: normProvince,
      source: searchSource,
      points: matchedPoints,
      lines: matchedLines,
      areas: matchedAreas,
      totalMatches: matchedPoints.length + matchedLines.length + matchedAreas.length
    });
  } catch (error: any) {
    console.error('Vector Search API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Vector search failed' },
      { status: 500 }
    );
  }
}
