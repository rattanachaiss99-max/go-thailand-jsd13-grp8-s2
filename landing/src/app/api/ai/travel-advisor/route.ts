import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import ProvinceKnowledge from '@/server/models/ProvinceKnowledge';
import User from '@/server/models/User';
import '@/server/models/Customer';
import { verifyToken } from '@/server/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface MatchedProvince {
  slug: string;
  provinceId: string;
  nameTh: string;
  nameEn: string;
  region: string;
  summary: string;
  highlights: string[];
  unseenGems: string[];
  signatureFood: string[];
  bestMonths: string[];
  vibes: string[];
}

export async function POST(request: NextRequest) {
  try {
    // 1. ตรวจสอบ Authentication Token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          code: 'UNAUTHORIZED',
          error: 'กรุณาเข้าสู่ระบบก่อนใช้งาน AI Travel Copilot'
        },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    let payload: any;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_TOKEN',
          error: 'โทเคนของคุณหมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่อีกครั้ง'
        },
        { status: 401 }
      );
    }

    await connectDB();

    // 2. ค้นหา User จาก Database และตรวจสอบสิทธิ์ canAccessAi & aiCredits
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          code: 'USER_NOT_FOUND',
          error: 'ไม่พบบัญชีผู้ใช้ หรือบัญชีถูกระงับการใช้งาน'
        },
        { status: 403 }
      );
    }

    if (!user.canAccessAi) {
      return NextResponse.json(
        {
          success: false,
          code: 'FORBIDDEN_AI_ACCESS',
          error: 'บัญชีของคุณยังไม่ได้รับสิทธิ์ใช้งาน AI Travel Copilot กรุณาติดต่อผู้ดูแลระบบเพื่อเปิดสิทธิ์จากฐานข้อมูล'
        },
        { status: 403 }
      );
    }

    const currentCredits = typeof user.aiCredits === 'number' ? user.aiCredits : 0;
    if (currentCredits <= 0) {
      return NextResponse.json(
        {
          success: false,
          code: 'INSUFFICIENT_CREDITS',
          error: 'โควต้าเครดิต AI ของคุณหมดแล้ว กรุณาติดต่อผู้ดูแลระบบเพื่อเติมเครดิต'
        },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { query, activeRegion } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกคำถามหรือความต้องการท่องเที่ยว' },
        { status: 400 }
      );
    }

    const userQuery = query.trim();
    const cleanQuery = userQuery.toLowerCase();

    // 1. ค้นหาจังหวัดที่ตรงกับความต้องการใน MongoDB
    const regionFilter: any = {};
    if (activeRegion && activeRegion !== 'all') {
      regionFilter.region = activeRegion;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    let candidateProvinces: any[] = [];

    // 1.1 ลองค้นหาด้วย AI Semantic Vector Search (Cosine Similarity 768 dims)
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
        const embedRes = await embedModel.embedContent({
          content: { role: 'user', parts: [{ text: userQuery }] },
          outputDimensionality: 768
        } as any);
        const queryVector = embedRes.embedding.values;

        const provinceDocs = await ProvinceKnowledge.find(
          { ...regionFilter, embedding: { $exists: true } },
          {
            provinceId: 1,
            slug: 1,
            nameTh: 1,
            nameEn: 1,
            region: 1,
            summary: 1,
            highlights: 1,
            unseenGems: 1,
            signatureFood: 1,
            bestMonths: 1,
            vibes: 1,
            embedding: 1
          }
        );

        if (provinceDocs.length > 0) {
          const scored = provinceDocs.map((doc: any) => {
            const vec = doc.embedding as number[];
            let dot = 0, normA = 0, normB = 0;
            for (let i = 0; i < queryVector.length; i++) {
              dot += queryVector[i] * vec[i];
              normA += queryVector[i] * queryVector[i];
              normB += vec[i] * vec[i];
            }
            const norm = Math.sqrt(normA) * Math.sqrt(normB);
            const score = norm === 0 ? 0 : dot / norm;
            return { doc, score };
          });

          scored.sort((a, b) => b.score - a.score);
          candidateProvinces = scored.slice(0, 4).map((s) => s.doc);
        }
      } catch (vectorSearchErr) {
        console.warn('[AI Travel Advisor] Vector search fallback to keyword:', vectorSearchErr);
      }
    }

    // 1.2 Fallback: หาก Vector Search ไม่พบ หรือไม่ได้ตั้งค่า API Key ให้ค้นหาด้วย Keywords & Regex
    if (!candidateProvinces || candidateProvinces.length === 0) {
      const keywords = cleanQuery
        .split(/\s+/)
        .filter((k) => k.length > 1)
        .map((k) => k.replace(/[^a-zA-Z0-9ก-๙]/g, ''));

      const searchConditions: any[] = [];
      searchConditions.push({ nameTh: { $regex: cleanQuery, $options: 'i' } });
      searchConditions.push({ nameEn: { $regex: cleanQuery, $options: 'i' } });
      searchConditions.push({ slug: { $regex: cleanQuery, $options: 'i' } });

      if (keywords.length > 0) {
        keywords.forEach((k) => {
          searchConditions.push({ highlights: { $regex: k, $options: 'i' } });
          searchConditions.push({ unseenGems: { $regex: k, $options: 'i' } });
          searchConditions.push({ signatureFood: { $regex: k, $options: 'i' } });
          searchConditions.push({ vibes: { $regex: k, $options: 'i' } });
          searchConditions.push({ summary: { $regex: k, $options: 'i' } });
        });
      }

      candidateProvinces = await ProvinceKnowledge.find(
        {
          ...regionFilter,
          $or: searchConditions.length > 0 ? searchConditions : [{}]
        },
        {
          provinceId: 1,
          slug: 1,
          nameTh: 1,
          nameEn: 1,
          region: 1,
          summary: 1,
          highlights: 1,
          unseenGems: 1,
          signatureFood: 1,
          bestMonths: 1,
          vibes: 1
        }
      ).limit(5);

      if (!candidateProvinces || candidateProvinces.length === 0) {
        candidateProvinces = await ProvinceKnowledge.find(
          { ...regionFilter },
          {
            provinceId: 1,
            slug: 1,
            nameTh: 1,
            nameEn: 1,
            region: 1,
            summary: 1,
            highlights: 1,
            unseenGems: 1,
            signatureFood: 1,
            bestMonths: 1,
            vibes: 1
          }
        )
          .sort({ provinceId: 1 })
          .limit(3);
      }
    }

    const matchedProvinces: MatchedProvince[] = candidateProvinces.map((p) => ({
      slug: p.slug,
      provinceId: p.provinceId,
      nameTh: p.nameTh,
      nameEn: p.nameEn,
      region: p.region,
      summary: p.summary,
      highlights: p.highlights || [],
      unseenGems: p.unseenGems || [],
      signatureFood: p.signatureFood || [],
      bestMonths: p.bestMonths || [],
      vibes: p.vibes || []
    }));

    // 2. สังเคราะห์คำตอบด้วย Gemini
    let reply = '';
    let source: 'gemini' | 'rag-knowledge-base' = 'rag-knowledge-base';

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const contextText = matchedProvinces
          .map(
            (p, idx) =>
              `จังหวัดที่ ${idx + 1}: ${p.nameTh} (${p.nameEn}) [รหัส: ${p.provinceId}, ภาค: ${p.region}]
- สรุปเสน่ห์: ${p.summary}
- สถานที่ท่องเที่ยวสำคัญ: ${p.highlights.join(', ')}
- Unseen จุดเช็กอินลับ: ${p.unseenGems.join(', ')}
- เมนูอาหารท้องถิ่นห้ามพลาด: ${p.signatureFood.join(', ')}
- ช่วงเวลาที่เหมาะเที่ยว: ${p.bestMonths.join(', ')}
- สไตล์/Vibes: ${p.vibes.join(', ')}`
          )
          .join('\n\n');

        const prompt = `คุณคือ "Go Thailand AI Travel Copilot" ผู้เชี่ยวชาญการท่องเที่ยวประเทศไทยประจำแพลตฟอร์ม Go Thailand
โจทย์คำถามของผู้ใช้งาน: "${userQuery}"

ข้อมูลบริบทจากฐานข้อมูล 77 จังหวัดของเรา (Knowledge Base):
${contextText}

คำแนะนำในการตอบ:
1. ตอบด้วยภาษาไทยที่สุภาพ เป็นกันเอง มีชีวิตชีวา และสร้างแรงบันดาลใจในการเดินทาง (ใส่ Emoji ให้สวยงามน่าอ่าน)
2. สรุปคำแนะนำทริปให้ตรงกับความต้องการของผู้ใช้ โดยดึงจุดเด่น, แหล่งท่องเที่ยว Unseen และเมนูอาหารท้องถิ่นของจังหวัดที่เลือกมาเล่าให้เห็นภาพ
3. ระบุชื่อจังหวัดที่เป็นไฮไลต์แนะนำหลักให้ชัดเจน (เช่น **จังหวัดภูเก็ต**, **จังหวัดเชียงใหม่**) เพื่อให้ระบบแผนที่สามารถไฮไลต์ได้
4. ให้คำแนะนำช่วงเวลาท่องเที่ยวที่ดีที่สุด (Best season) และทิปส์การเดินทางสั้นๆ ที่เป็นประโยชน์`;

        const result = await model.generateContent(prompt);
        reply = result.response.text();
        source = 'gemini';
      } catch (geminiError: any) {
        console.warn('Gemini API error, falling back to RAG knowledge synthesis:', geminiError.message);
      }
    }

    // Fallback: หากยังไม่มี API Key หรือเชื่อมต่อไม่สำเร็จ ให้สร้างคำตอบด้วย Knowledge Synthesis จาก MongoDB RAG
    if (!reply) {
      const topProvince = matchedProvinces[0];
      if (topProvince) {
        reply = `✨ **Go Thailand AI Travel Copilot แนะนำ:**\n\n` +
          `จากความต้องการของคุณ **"${userQuery}"** ขอแนะนำ **จังหวัด${topProvince.nameTh} (${topProvince.nameEn})** ครับ!\n\n` +
          `🌿 **มนต์เสน่ห์ประจำจังหวัด:**\n${topProvince.summary}\n\n` +
          `📍 **สถานที่ท่องเที่ยวสำคัญ:**\n${topProvince.highlights.map((h) => `• ${h}`).join('\n')}\n\n` +
          `💎 **จุดเช็กอิน Unseen ลับเฉพาะ:**\n${topProvince.unseenGems.map((u) => `• ${u}`).join('\n')}\n\n` +
          `🍲 **อาหารท้องถิ่นห้ามพลาด:**\n${topProvince.signatureFood.join(', ')}\n\n` +
          `🗓️ **ช่วงเวลาที่แนะนำ:** เดือน ${topProvince.bestMonths.join(', ')}\n\n` +
          `*(💡 คุณสามารถคลิกที่ปุ่มจังหวัดด้านล่างเพื่อซูมแผนที่เวกเตอร์และส่องดวงแสตมป์ท่องเที่ยวได้ทันทีครับ)*`;
      } else {
        reply = `ขออภัยครับ ไม่พบข้อมูลที่ตรงกับคำค้นหาโดยตรง ลองระบุความชอบ เช่น "ทะเลสวย", "ทะเลหมอก", หรือชื่อภาคดูนะครับ`;
      }
    }

    // 3. หักเครดิตการใช้งานใน Database 1 เครดิต
    const remainingCredits = Math.max(0, currentCredits - 1);
    user.aiCredits = remainingCredits;
    await user.save();

    return NextResponse.json({
      success: true,
      query: userQuery,
      reply,
      matchedProvinces,
      source,
      creditsRemaining: remainingCredits
    });
  } catch (error: any) {
    console.error('Error in AI travel advisor:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
