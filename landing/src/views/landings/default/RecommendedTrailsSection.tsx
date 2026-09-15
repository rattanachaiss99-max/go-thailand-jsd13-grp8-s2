'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ChiangRaiRoadMap from '@/components/maps/ChiangRaiRoadMap';

// ============================================================================
// SVG ICONS
// ============================================================================

function CompassIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function CalendarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SparklesIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// ============================================================================
// CHIANG RAI GUEST TRAILS DATA
// ============================================================================

export interface GuestTrail {
  id: string;
  title: string;
  badge: string;
  duration: string;
  description: string;
  themeColor: string;
  highlights: string[];
  signatureFood: string[];
  schedule: Array<{
    time: string;
    title: string;
    detail: string;
  }>;
  recommendedProduct: {
    name: string;
    price: number;
    tag: string;
    serviceType: string;
  };
}

export const CHIANG_RAI_GUEST_TRAILS: GuestTrail[] = [
  {
    id: 'trail-slowlife-coffee',
    title: 'สายสโลว์ไลฟ์ จิบกาแฟเหนือเมฆ & นอนชมทะเลหมอก',
    badge: 'กาแฟ & ขุนเขา',
    duration: '2 วัน 1 คืน',
    themeColor: '#0284c7',
    description: 'ทริปพักผ่อนสูดอากาศบริสุทธิ์บนดอยสูง ดื่มด่ำ Specialty Coffee ดอยช้าง และโฮมสเตย์ผาฮี้ริมชายแดนไทย-พม่า',
    highlights: ['Slow Bar กาแฟดอยช้าง', 'หมู่บ้านชาวอาข่าผาฮี้', 'พระตำหนักดอยตุง', 'ไร่ชาฉุยฟง'],
    signatureFood: ['กาแฟ Single Origin ดอยช้าง', 'ข้าวแรมฟืนยำ', 'ขันโตกชาวดอย'],
    schedule: [
      { time: 'วันแรก (ช่วงเช้า)', title: 'ขึ้นดอยช้าง & Slow Bar เหนือเมฆ', detail: 'เช็กอินคาเฟ่ดอยช้าง สัมผัสอากาศหนาว จิบกาแฟดริป Specialty พร้อมชมวิวหุบเขาพาโนรามา' },
      { time: 'วันแรก (ช่วงเย็น)', title: 'เช็กอินโฮมสเตย์บ้านผาฮี้', detail: 'นั่งหย่อนขาจิบกาแฟชมวิวภูเขาชายแดนไทย-พม่า อิ่มอร่อยกับขันโตกอาหารพื้นเมืองรสเลิศ' },
      { time: 'วันที่สอง (ช่วงเช้า)', title: 'ชมพระตำหนักดอยตุง & สวนแม่ฟ้าหลวง', detail: 'เดินชมสวนดอกไม้เมืองหนาวนานาพันธุ์ ถ่ายรูปมุมบันไดดอกไม้และสะพานเรือนยอดไม้ (Doi Tung Tree Top Walk)' },
      { time: 'วันที่สอง (ช่วงบ่าย)', title: 'ชิมชาอู่หลง ณ ไร่ชาฉุยฟง แม่จัน', detail: 'แวะจิบชาเขียวสด ยอดใบชาทอดกรอบ และซื้อของฝากก่อนเดินทางกลับ' }
    ],
    recommendedProduct: {
      name: 'โฮมสเตย์วิวทะเลหมอก ดอยผาฮี้ เชียงราย (รวมกาแฟดริป & ขันโตก)',
      price: 1800,
      tag: 'โฮมสเตย์ธรรมชาติ',
      serviceType: 'stay'
    }
  },
  {
    id: 'trail-art-culture',
    title: 'สายมหาพุทธศิลป์ล้านนาระดับโลก & คาเฟ่วิถีชุมชน',
    badge: 'มรดกศิลปะโลก',
    duration: 'วันเดย์ทริป (1 วัน)',
    themeColor: '#7c3aed',
    description: 'เจาะลึก 3 มหาพุทธศิลป์เอกลักษณ์ของเชียงราย ผลงานระดับตำนานของ อ.เฉลิมชัย และ อ.ถวัลย์ ดัชนี',
    highlights: ['วัดร่องขุ่น (วัดขาว)', 'พิพิธภัณฑ์บ้านดำ', 'วัดร่องเสือเต้น (วิหารสีน้ำเงิน)', 'สิงห์ปาร์ค'],
    signatureFood: ['ขนมจีนน้ำเงี้ยวเชียงราย', 'ลาบหมูคั่วพริกลาบ', 'ไส้อั่วสมุนไพร'],
    schedule: [
      { time: '09:00 - 11:30 น.', title: 'วัดร่องขุ่น (White Temple)', detail: 'ชมพุทธศิลป์สีขาวบริสุทธิ์ประดับกระจกแวววาว ถ่ายรูปสถาปัตยกรรมระดับสากล' },
      { time: '12:00 - 13:00 น.', title: 'ลิ้มลองน้ำเงี้ยวป้าสุขสูตรดั้งเดิม', detail: 'ทานมื้อเที่ยงเมนูเอกลักษณ์เชียงราย น้ำเงี้ยวเข้มข้นหอมดอกงิ้วและพริกลาบเมืองเหนือ' },
      { time: '13:30 - 15:30 น.', title: 'พิพิธภัณฑ์บ้านดำ (Black House)', detail: 'สัมผัสอาณาจักรศิลปะสถาปัตยกรรมไม้โทนดำ แฝงปรัชญาชีวิตและคอลเลกชันงานศิลป์อันทรงคุณค่า' },
      { time: '16:00 - 18:30 น.', title: 'สิงห์ปาร์ค เชียงราย', detail: 'นั่งรถฟาร์มทัวร์ ถ่ายรูปทุ่งดอกไม้คอสมอส และชมพระอาทิตย์ตกดินสุดโรแมนติก' }
    ],
    recommendedProduct: {
      name: 'One Day Trip มหาพุทธศิลป์เชียงราย: วัดร่องขุ่น - บ้านดำ - วัดร่องเสือเต้น - ไร่ชาฉุยฟง',
      price: 1490,
      tag: 'ทัวร์ศิลปะ',
      serviceType: 'tour'
    }
  },
  {
    id: 'trail-mist-mountain',
    title: 'สายล่าทะเลหมอก 360 องศา & สันเขาชายแดนตะวันออก',
    badge: 'ทะเลหมอก & เดินป่า',
    duration: '2 วัน 1 คืน',
    themeColor: '#059669',
    description: 'ผจญภัยสัมผัสลมหนาว แสงแรกยามเช้าเหนือทะเลหมอกสุดอลังการบนยอดภูชี้ฟ้าและสันคมมีดภูชี้ดาว',
    highlights: ['ยอดภูชี้ฟ้า', 'สันเขาภูชี้ดาว', 'ดอยผาตั้ง', 'สามเหลี่ยมทองคำ'],
    signatureFood: ['หมูกระทะบนยอดดอย', 'ยอดชาทอดกรอบ', 'แกงฮังเลลำไย'],
    schedule: [
      { time: 'วันแรก (ช่วงบ่าย)', title: 'เดินทางขึ้นภูชี้ฟ้า & เช็กอินที่พัก', detail: 'ขึ้นเขาสัมผัสไอหนาว ปิ้งหมูกระทะชมดาวระยิบระยับยามค่ำคืนท่ามกลางอุณหภูมิเลขตัวเดียว' },
      { time: 'วันที่สอง (05:00 น.)', title: 'ชมพระอาทิตย์ขึ้นเหนือหน้าผาภูชี้ฟ้า', detail: 'เดินขึ้นยอดหน้าผาชมทะเลหมอกกว้างสุดสายตาและลำแสงแรกตัดขอบฟ้าไทย-ลาว' },
      { time: 'วันที่สอง (08:30 น.)', title: 'เดินสันคมมีดภูชี้ดาว 360 องศา', detail: 'สัมผัสจุดชมวิวทะเลหมอกมุมสูงรอบทิศทาง ถ่ายรูปบนสันเขาที่ยังคงความบริสุทธิ์ของธรรมชาติ' },
      { time: 'วันที่สอง (ช่วงบ่าย)', title: 'แวะสามเหลี่ยมทองคำ เชียงแสน', detail: 'ชมจุดบรรจบของแม่น้ำโขง 3 ประเทศ ไทย-ลาว-พม่า ก่อนเดินทางกลับ' }
    ],
    recommendedProduct: {
      name: 'เช่ารถ SUV เที่ยวภูชี้ฟ้า - ดอยแม่สลอง พร้อมคนขับชำนาญทางขึ้นดอย',
      price: 2500,
      tag: 'บริการรถนำเที่ยว',
      serviceType: 'transport'
    }
  }
];

export interface RecommendedTrailsSectionProps {
  selectedTrailId?: string;
  onSelectTrail?: (trail: GuestTrail) => void;
  showMap?: boolean;
}

export default function RecommendedTrailsSection({
  selectedTrailId: controlledTrailId,
  onSelectTrail,
  showMap = false
}: RecommendedTrailsSectionProps = {}) {
  const router = useRouter();
  const [internalTrail, setInternalTrail] = useState<GuestTrail>(CHIANG_RAI_GUEST_TRAILS[0]);

  const selectedTrail = React.useMemo(() => {
    if (controlledTrailId) {
      return CHIANG_RAI_GUEST_TRAILS.find((t) => t.id === controlledTrailId) || internalTrail;
    }
    return internalTrail;
  }, [controlledTrailId, internalTrail]);

  const handleSelectTrail = (trail: GuestTrail) => {
    setInternalTrail(trail);
    if (onSelectTrail) {
      onSelectTrail(trail);
    }
  };

  const handleCustomizeWithAI = (trail: GuestTrail) => {
    // นำชื่อทริปส่งต่อไปยัง AI เพื่อนวางแผนเที่ยว
    router.push(`/features?tab=ai-planner&prompt=${encodeURIComponent(`ขอคำแนะนำปรับแต่งแผนท่องเที่ยว: ${trail.title} (${trail.duration})`)}`);
  };

  return (
    <Box
      component="section"
      id="recommended-trails-section"
      sx={{
        py: { xs: 6, md: 8 },
        px: 2,
        bgcolor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9'
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.2, py: 0.7, borderRadius: 9999, bgcolor: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', mb: 1.5 }}>
            <CompassIcon size={16} />
            <Typography component="span" sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
              เส้นทางแนะนำ • RECOMMENDED TRAILS
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.85rem', sm: '2.35rem', md: '2.6rem' },
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              mb: 1.5
            }}
          >
            เส้นทางตัวอย่างแนะนำ: เชียงราย
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              maxWidth: 680,
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              lineHeight: 1.6
            }}
          >
            สัมผัสเสน่ห์ดินแดนเหนือสุดในสยาม คัดสรร 3 เส้นทางยอดนิยมพร้อมตารางเวลา ไฮไลต์สถานที่ อาหารท้องถิ่น และแพ็กเกจราคาพิเศษ
          </Typography>
        </Box>

        {/* Trail Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
            mb: 4
          }}
        >
          {CHIANG_RAI_GUEST_TRAILS.map((trail) => {
            const isSelected = selectedTrail.id === trail.id;
            return (
              <Card
                key={trail.id}
                onClick={() => handleSelectTrail(trail)}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: '2px solid',
                  borderColor: isSelected ? trail.themeColor : '#e2e8f0',
                  bgcolor: isSelected ? '#ffffff' : '#f8fafc',
                  boxShadow: isSelected ? `0 10px 28px ${trail.themeColor}22` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: trail.themeColor,
                    bgcolor: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                  }
                }}
              >
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                      label={trail.badge}
                      size="small"
                      sx={{
                        bgcolor: `${trail.themeColor}15`,
                        color: trail.themeColor,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        borderRadius: 2
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon size={14} /> {trail.duration}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, lineHeight: 1.35 }}>
                    {trail.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.55, mb: 2 }}>
                    {trail.description}
                  </Typography>
                </Box>

                <Box sx={{ pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                  <Typography variant="caption" sx={{ color: trail.themeColor, fontWeight: 700, display: 'block' }}>
                    {isSelected ? '✓ กำลังดูรายละเอียดเส้นทางนี้' : 'คลิกเพื่อดูตารางทริป ➔'}
                  </Typography>
                </Box>
              </Card>
            );
          })}
        </Box>

        {/* Trail Detail Expansion Box */}
        {selectedTrail && (
          <Card
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 4 },
              borderRadius: 4,
              border: '1px solid #cbd5e1',
              bgcolor: '#ffffff',
              boxShadow: '0 10px 32px rgba(0,0,0,0.05)',
              mb: 5
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                  <Chip label="เจาะลึกตารางทริป" size="small" color="primary" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    จังหวัดเชียงราย • {selectedTrail.duration}
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {selectedTrail.title}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => handleCustomizeWithAI(selectedTrail)}
                startIcon={<SparklesIcon size={16} />}
                sx={{
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  borderColor: '#38bdf8',
                  color: '#0284c7',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: '#0284c7',
                    bgcolor: '#f0f9ff'
                  }
                }}
              >
                นำแผนนี้ไปปรับแต่งกับ AI
              </Button>
            </Stack>

            {showMap ? (
              /* 2-Column: Timeline (Left) & Chiang Rai Interactive Road Map (Right) */
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: '1.15fr 1fr' },
                  gap: 3,
                  mb: 3.5,
                  alignItems: 'start'
                }}
              >
                {/* Day Timeline */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 2 }}>
                    🗓️ กำหนดการเดินทางโดยสังเขป:
                  </Typography>
                  <Stack spacing={1.5}>
                    {selectedTrail.schedule.map((item, i) => (
                      <Box
                        key={i}
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          bgcolor: '#f8fafc',
                          borderLeft: `4px solid ${selectedTrail.themeColor}`
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: selectedTrail.themeColor, mb: 0.5 }}>
                          {item.time} — {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          {item.detail}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Interactive Chiang Rai Road Map */}
                <Box sx={{ width: '100%' }}>
                  <ChiangRaiRoadMap activeTrailId={selectedTrail.id} compact />
                </Box>
              </Box>
            ) : (
              /* Clean Timeline (เมื่อมี HeroMapSection แสดงแผนที่อยู่แล้ว) */
              <Box sx={{ mb: 3.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 2 }}>
                  🗓️ กำหนดการเดินทางโดยสังเขป:
                </Typography>
                <Stack spacing={1.5}>
                  {selectedTrail.schedule.map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: '#f8fafc',
                        borderLeft: `4px solid ${selectedTrail.themeColor}`
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: selectedTrail.themeColor, mb: 0.5 }}>
                        {item.time} — {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {item.detail}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Highlights & Signature Foods Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mb: 3.5 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
                  📍 สถานที่ไฮไลต์ในเส้นทางนี้:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedTrail.highlights.map((h, idx) => (
                    <Chip key={idx} label={h} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600, fontSize: '0.78rem' }} />
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
                  🍲 เมนูและของอร่อยห้ามพลาด:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedTrail.signatureFood.map((f, idx) => (
                    <Chip key={idx} label={f} size="small" sx={{ bgcolor: '#fff7ed', color: '#c2410c', fontWeight: 600, fontSize: '0.78rem' }} />
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Recommended Product Booking Banner */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: '#f0f9ff',
                border: '1px solid #bae6fd',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Chip label="แพ็กเกจตรงสาย" size="small" sx={{ bgcolor: '#0284c7', color: '#fff', fontWeight: 700, height: 22, fontSize: '0.75rem' }} />
                  <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 700 }}>
                    {selectedTrail.recommendedProduct.tag}
                  </Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {selectedTrail.recommendedProduct.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0284c7', mt: 0.3 }}>
                  ราคาเริ่มต้น {selectedTrail.recommendedProduct.price.toLocaleString()} บาท
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => router.push('/products')}
                sx={{
                  bgcolor: '#0284c7',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.2,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#0369a1' }
                }}
              >
                ดูรายละเอียด & จองแพ็กเกจ ➔
              </Button>
            </Box>
          </Card>
        )}

        {/* Bottom Banner Linking to AI Travel Planner */}
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              ✨ ต้องการแผนท่องเที่ยวเฉพาะตัวในจังหวัดอื่นๆ หรือปรับวันเดินทาง?
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              ทดลองใช้ <strong>เพื่อนวางแผนเที่ยว (AI Travel Copilot)</strong> เพื่อออกแบบเส้นทางตามสไตล์ งบประมาณ และเวลาของคุณได้ทันที
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => router.push('/features?tab=ai-planner')}
            sx={{
              bgcolor: '#0284c7',
              fontWeight: 700,
              borderRadius: 2.5,
              px: 3,
              py: 1.2,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#0369a1' }
            }}
          >
            ไปที่เพื่อนวางแผนเที่ยว ➔
          </Button>
        </Card>
      </Container>
    </Box>
  );
}
