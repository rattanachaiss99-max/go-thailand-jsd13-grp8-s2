'use client';

// ============================================================================
// CHIANG RAI VECTOR MAP COMPONENT (FLAGSHIP VECTOR GIS ENGINE)
// ============================================================================
// แผนที่เวกเตอร์เชียงรายแบบอินเตอร์แอคทีฟคุณภาพสูง:
// 1. เลเยอร์เวกเตอร์ครบสมบูรณ์ 100%: ขอบเขตจังหวัด, โครงข่ายถนน 8 สาย, แม่น้ำกก & โขง,
//    ป้ายหมายเลขทางหลวง, ป้ายชื่ออำเภอ, จุดแลนด์มาร์ก (POIs)
// 2. ผสาน UI สไตล์ OpenStreetMap iD Editor:
//    - แถบเมนูซ้าย "ค้นหาคุณลักษณะ" (Feature Search & Inspector) ค้นหาด้วย Vector DB
//    - แถบเครื่องมือด้านบน: ปุ่ม จุด (Point), เส้น (Line), แม่น้ำ (River), ป้ายทางหลวง, ป้ายชื่ออำเภอ
// 3. ซ่อน OpenStreetMap ไว้เป็นโหมด Debug (GIS Debug Mode) ตามคำสั่งของผู้ใช้
// 4. รองรับการเชื่อมต่อทริปแนะนำ (Active Trail Highlight) แบบมี Pulse Animation คมชัด
// ============================================================================

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import FeatureSearchSidebar from './osm/FeatureSearchSidebar';
import { searchFeatures } from '@/services/provinceMapService';
import { MapPointFeature, MapLineFeature, MapAreaFeature } from '@/data/provinceMapData';

// Dynamic import for Leaflet GIS Debug mode (hidden by default)
const OsmMapCanvas = dynamic(() => import('./osm/OsmMapCanvas'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0f172a',
        color: '#ffffff',
        gap: 2
      }}
    >
      <CircularProgress size={38} sx={{ color: '#38bdf8' }} thickness={4} />
      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
        กำลังโหลด GIS Debug Map...
      </Typography>
    </Box>
  )
});

// ข้อมูล Mapping เส้นทางและจุดแวะตามทริปแนะนำ
const TRAIL_ROUTE_CONFIG: Record<
  string,
  {
    roads: string[];
    pois: string[];
    trailName: string;
    routeDesc: string;
    themeColor: string;
  }
> = {
  'trail-slowlife-coffee': {
    roads: ['road-hwy-118', 'road-hwy-1', 'road-hwy-1089'],
    pois: ['poi-1', 'poi-3', 'poi-14'],
    trailName: 'สายสโลว์ไลฟ์ จิบกาแฟเหนือเมฆ & นอนชมทะเลหมอก',
    routeDesc: 'ใช้ทางหลวง 118 (ดอยช้าง/แม่สรวย) ➔ สาย 1 (พหลโยธิน) ➔ สาย 1089 (ดอยตุง/ฉุยฟง)',
    themeColor: '#0284c7'
  },
  'trail-art-culture': {
    roads: ['road-hwy-1', 'road-hwy-1232-1174'],
    pois: ['poi-8', 'poi-10'],
    trailName: 'สายมหาพุทธศิลป์ล้านนาระดับโลก',
    routeDesc: 'ใช้ทางหลวงสาย 1 (ถนนพหลโยธิน) ผ่านวัดร่องขุ่น ➔ เมืองเชียงราย ➔ บ้านดำ',
    themeColor: '#7c3aed'
  },
  'trail-mist-mountain': {
    roads: ['road-hwy-1020-1292', 'road-hwy-1021', 'road-hwy-1155', 'road-hwy-1016'],
    pois: ['poi-4', 'poi-12'],
    trailName: 'สายล่าทะเลหมอก 360 องศา & สันเขาชายแดนตะวันออก',
    routeDesc: 'ใช้ทางหลวง 1020 / 1155 มุ่งสู่ภูชี้ฟ้า ➔ สาย 1016 เชื่อมสามเหลี่ยมทองคำ เชียงแสน',
    themeColor: '#059669'
  }
};

// ข้อมูล Master Features สำหรับ Inspector และ Vector Search
const CHIANG_RAI_VECTOR_FEATURES = {
  points: [
    {
      id: 'poi-1',
      name: 'ดอยแม่สลอง (ชาอู่หลง & วิถีชุมชนจีนยูนนาน)',
      category: 'viewpoint' as const,
      coordinates: [20.1652, 99.6231] as [number, number],
      rating: 4.8,
      description: 'วิถีชุมชนชาวจีนยูนนาน ชิมชาอู่หลงชั้นเลิศ ทิวทัศน์ไร่ชาขั้นบันไดบนยอดดอยสูง',
      district: 'แม่ฟ้าหลวง',
      tags: ['ไร่ชา', 'จีนยูนนาน', 'ดอยแม่สลอง'],
      icon: '🍵'
    },
    {
      id: 'poi-2',
      name: 'จุดชมวิวดอยช้างมูบ ฐานปฏิบัติการชายแดน',
      category: 'viewpoint' as const,
      coordinates: [20.3341, 99.8335] as [number, number],
      rating: 4.7,
      description: 'จุดชมวิวเทือกเขาดอยนางนอนและฐานปฏิบัติการทหารชายแดนไทย-เมียนมา สูงเสียดฟ้า',
      district: 'แม่สาย',
      tags: ['ชายแดน', 'วิวภูเขา', 'ดอยนางนอน'],
      icon: '🏔️'
    },
    {
      id: 'poi-3',
      name: 'พระตำหนักดอยตุง & สวนแม่ฟ้าหลวง',
      category: 'culture' as const,
      coordinates: [20.2877, 99.8099] as [number, number],
      rating: 4.9,
      description: 'สวนดอกไม้เมืองหนาวระดับนานาชาติ พระตำหนักไม้สักทรงสวิสชาเลต์ผสมล้านนา',
      district: 'แม่ฟ้าหลวง',
      tags: ['สวนดอกไม้', 'ดอยตุง', 'โครงการพระราชดำริ'],
      icon: '🌺'
    },
    {
      id: 'poi-4',
      name: 'หอฝิ่น & สามเหลี่ยมทองคำ (สบรวก)',
      category: 'landmark' as const,
      coordinates: [20.3547, 100.0818] as [number, number],
      rating: 4.8,
      description: 'จุดบรรจบของพรมแดน 3 ประเทศ ไทย-ลาว-เมียนมา ริมแม่น้ำโขง และพิพิธภัณฑ์ประวัติศาสตร์ฝิ่น',
      district: 'เชียงแสน',
      tags: ['สามเหลี่ยมทองคำ', 'แม่น้ำโขง'],
      icon: '🏛️'
    },
    {
      id: 'poi-8',
      name: 'วัดร่องเสือเต้น & พิพิธภัณฑ์บ้านดำ',
      category: 'temple' as const,
      coordinates: [19.9234, 99.8419] as [number, number],
      rating: 4.8,
      description: 'พระวิหารสีน้ำเงินครามทองอร่าม ผลงานสถาปัตยกรรมไทยประยุกต์ร่วมสมัยอันวิจิตร',
      district: 'เมืองเชียงราย',
      tags: ['วัดสีน้ำเงิน', 'ศิลปะล้านนา', 'บ้านดำ'],
      icon: '🏯'
    },
    {
      id: 'poi-10',
      name: 'วัดร่องขุ่น & สิงห์ปาร์ค (White Temple)',
      category: 'temple' as const,
      coordinates: [19.8242, 99.7633] as [number, number],
      rating: 4.9,
      description: 'ผลงานมาสเตอร์พีซของ อ.เฉลิมชัย โฆษิตพิพัฒน์ พระอุโบสถสีขาวบริสุทธิ์ประดับกระจกแวววาว',
      district: 'เมืองเชียงราย',
      tags: ['วัดร่องขุ่น', 'อาจารย์เฉลิมชัย', 'สิงห์ปาร์ค'],
      icon: '✨'
    },
    {
      id: 'poi-12',
      name: 'ภูชี้ฟ้า & ภูชี้ดาว',
      category: 'nature' as const,
      coordinates: [19.8519, 100.4533] as [number, number],
      rating: 4.9,
      description: 'ยอดผาปลายแหลมชี้ขึ้นฟ้า จุดชมทะเลหมอกและพระอาทิตย์ขึ้น 360 องศาเหนือสันเขาไทย-ลาว',
      district: 'เทิง',
      tags: ['ทะเลหมอก', 'ภูชี้ฟ้า', 'พระอาทิตย์ขึ้น'],
      icon: '🌅'
    },
    {
      id: 'poi-14',
      name: 'ดอยช้าง & คาเฟ่กาแฟอาราบิกา',
      category: 'cafe' as const,
      coordinates: [19.7997, 99.5539] as [number, number],
      rating: 4.9,
      description: 'แหล่งปลูกกาแฟอาราบิกาพรีเมียมอันดับหนึ่งของไทย ท่ามกลางทิวเขา ป่าสน และคาเฟ่สไตล์ลอฟท์',
      district: 'แม่สรวย',
      tags: ['ดอยช้าง', 'กาแฟอาราบิกา', 'คาเฟ่'],
      icon: '☕'
    }
  ],
  lines: [
    {
      id: 'road-hwy-1',
      name: 'ถนนพหลโยธิน (สาย 1)',
      hwy: '1',
      type: 'primary' as const,
      coordinates: [[19.9105, 99.8406]] as [number, number][],
      description: 'เส้นทางหลวงสายหลักพาดผ่าน อ.พาน - อ.เมือง - อ.แม่จัน - ด่านพรมแดนแม่สาย'
    },
    {
      id: 'road-hwy-118',
      name: 'ทางหลวง 118 (เชียงใหม่ - เชียงราย)',
      hwy: '118',
      type: 'primary' as const,
      coordinates: [[19.6543, 99.5492]] as [number, number][],
      description: 'เส้นทางสายหลักเชื่อมเชียงใหม่ - เวียงป่าเป้า - แม่สรวย - แม่ลาว เข้าสู่ตัวเมือง'
    },
    {
      id: 'road-hwy-1016',
      name: 'ทางหลวง 1016 (แม่จัน - เชียงแสน)',
      hwy: '1016',
      type: 'secondary' as const,
      coordinates: [[20.1456, 99.8541]] as [number, number][],
      description: 'เส้นทางเชื่อมแม่จัน สู่เมืองประวัติศาสตร์เชียงแสน และสามเหลี่ยมทองคำ'
    },
    {
      id: 'road-hwy-1089',
      name: 'ทางหลวง 1089 (แม่จัน - ท่าตอน - ฝาง)',
      hwy: '1089',
      type: 'secondary' as const,
      coordinates: [[20.1234, 99.7212]] as [number, number][],
      description: 'ทางหลวงเชื่อมต่อ อ.ฝาง และทางขึ้นสู่ดอยแม่สลอง'
    },
    {
      id: 'road-hwy-1232-1174',
      name: 'ทางหลวง 1232 / 1174 (เวียงชัย - พญาเม็งราย)',
      hwy: '1232',
      type: 'secondary' as const,
      coordinates: [[19.9105, 99.8406]] as [number, number][],
      description: 'เส้นทางเชื่อม เวียงชัย - พญาเม็งราย - ดอยหลวง'
    },
    {
      id: 'road-hwy-1020-1292',
      name: 'ทางหลวง 1020 (เมืองเชียงราย - เทิง)',
      hwy: '1020',
      type: 'secondary' as const,
      coordinates: [[19.6891, 100.1876]] as [number, number][],
      description: 'เส้นทางเชื่อมตัวเมืองสู่ประตูสู่ภูชี้ฟ้า อำเภอเทิง'
    },
    {
      id: 'road-hwy-1155',
      name: 'ทางหลวง 1155 (เชียงของ - เวียงแก่น - ภูชี้ฟ้า)',
      hwy: '1155',
      type: 'scenic' as const,
      coordinates: [[19.8519, 100.4533]] as [number, number][],
      description: 'เส้นทางสายโรแมนติกเลียบชายแดนตะวันออกสู่ยอดภูชี้ฟ้า'
    },
    {
      id: 'road-hwy-1021',
      name: 'ทางหลวง 1021 (เทิง - เชียงคำ เชื่อมพะเยา)',
      hwy: '1021',
      type: 'secondary' as const,
      coordinates: [[19.6891, 100.1876]] as [number, number][],
      description: 'เส้นทางเชื่อมต่อระหว่าง อ.เทิง และ อ.เชียงคำ (จ.พะเยา)'
    },
    {
      id: 'river-kok',
      name: 'แม่น้ำกก (Kok River)',
      type: 'river' as const,
      coordinates: [[19.9234, 99.8419]] as [number, number][],
      description: 'แม่น้ำสายชีวิต ไหลผ่านตัวเมืองเชียงรายลงสู่แม่น้ำโขงที่เชียงแสน'
    },
    {
      id: 'river-khong',
      name: 'แม่น้ำโขง (Mekong River)',
      type: 'river' as const,
      coordinates: [[20.2891, 100.0812]] as [number, number][],
      description: 'แม่น้ำนานาชาติ เส้นกั้นพรมแดนไทย-ลาว ที่เชียงแสน-เชียงของ-เวียงแก่น'
    }
  ],
  areas: [] as MapAreaFeature[]
};

export interface ChiangRaiRoadMapProps {
  provinceSlug?: string;
  activeTrailId?: string;
  onSelectRoad?: (roadInfo: { hwy: string; name: string }) => void;
  onSelectPoi?: (poiInfo: any) => void;
  compact?: boolean;
}

export default function ChiangRaiRoadMap({
  activeTrailId,
  onSelectRoad,
  onSelectPoi,
  compact = false
}: ChiangRaiRoadMapProps) {
  // Layer Visibility Switches (Matching OSM iD Tools)
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showAttractions, setShowAttractions] = useState<boolean>(true);
  const [showBadges, setShowBadges] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Inspector Sidebar Open State (default open, toggleable via ตรวจสอบ button)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!compact);

  // GIS Debug Mode Toggle (Hidden by default, used for coordinate/OSM verification)
  const [showGisDebug, setShowGisDebug] = useState<boolean>(false);

  // Selected Feature for Left Sidebar Inspector
  const [selectedFeature, setSelectedFeature] = useState<{
    type: 'point' | 'line' | 'area';
    data: any;
  } | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{
    points: MapPointFeature[];
    lines: MapLineFeature[];
    areas: MapAreaFeature[];
    source: 'vector' | 'keyword';
  } | null>(null);

  // Floating Info Hover Tooltip
  const [hoveredRoad, setHoveredRoad] = useState<{ hwy: string; name: string } | null>(null);

  // ข้อมูลเส้นทางที่กำลัง Active
  const activeConfig = useMemo(() => {
    if (!activeTrailId) return null;
    return TRAIL_ROUTE_CONFIG[activeTrailId] || null;
  }, [activeTrailId]);

  const isRoadActive = useCallback(
    (roadId: string) => {
      if (!activeConfig) return false;
      return activeConfig.roads.includes(roadId);
    },
    [activeConfig]
  );

  const isPoiActive = useCallback(
    (poiId: string) => {
      if (!activeConfig) return false;
      return activeConfig.pois.includes(poiId);
    },
    [activeConfig]
  );

  const handleRoadClick = (hwy: string, name: string, roadId: string) => {
    const feat = CHIANG_RAI_VECTOR_FEATURES.lines.find((l) => l.id === roadId);
    if (feat) {
      setSelectedFeature({ type: 'line', data: feat });
    }
    if (onSelectRoad) {
      onSelectRoad({ hwy, name });
    }
  };

  const handlePoiClick = (poiId: string) => {
    const feat = CHIANG_RAI_VECTOR_FEATURES.points.find((p) => p.id === poiId);
    if (feat) {
      setSelectedFeature({ type: 'point', data: feat });
      if (onSelectPoi) {
        onSelectPoi(feat);
      }
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    const res = await searchFeatures(query, 'chiang-rai');
    setSearchResults(res);
    setIsSearching(false);

    if (res.points.length > 0) {
      setSelectedFeature({ type: 'point', data: res.points[0] });
    } else if (res.lines.length > 0) {
      setSelectedFeature({ type: 'line', data: res.lines[0] });
    }
  }, []);

  const containerHeight = compact ? '420px' : '580px';

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#ffffff',
        borderRadius: 4,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Header: Title & Trail Highlights */}
      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 1.5,
          borderBottom: '1px solid #f1f5f9',
          bgcolor: '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 0.8 }}
            >
              🗺️ แผนที่โครงข่ายเวกเตอร์ท่องเที่ยวเชียงราย (Chiang Rai Vector Map)
            </Typography>
            <Chip
              label="Interactive Vector GIS"
              size="small"
              sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
            />
            <Chip
              label="Vector Database"
              size="small"
              sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {activeConfig ? (
              <span style={{ color: activeConfig.themeColor, fontWeight: 700 }}>
                ● ไฮไลต์ตามทริป: {activeConfig.routeDesc}
              </span>
            ) : (
              'คลิกบนเส้นทางหลวง หรือหมุดท่องเที่ยว เพื่อดูคุณลักษณะและข้อมูลเชิงลึก'
            )}
          </Typography>
        </Box>

        {/* GIS Debug Mode Switch (Discreet button for developer / verification) */}
        <Tooltip title={showGisDebug ? 'กลับสู่โหมดเวกเตอร์หลัก' : 'เปิดโหมด GIS Debug (OpenStreetMap Tiles) เพื่อตรวจสอบพิกัดจริง'} arrow>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setShowGisDebug(!showGisDebug)}
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              borderColor: showGisDebug ? '#0284c7' : '#e2e8f0',
              bgcolor: showGisDebug ? '#f0f9ff' : 'transparent',
              color: showGisDebug ? '#0284c7' : '#64748b',
              borderRadius: 2,
              px: 1,
              py: 0.2
            }}
          >
            {showGisDebug ? '🗺️ ปิดโหมด Debug' : '🛠️ GIS Debug (OSM)'}
          </Button>
        </Tooltip>
      </Box>

      {/* Main Map Toolbar: OpenStreetMap iD Tools (จุด, เส้น, แม่น้ำ, ป้ายทางหลวง, ป้ายชื่ออำเภอ) */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          px: { xs: 1.5, sm: 2 },
          py: 0.8,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1
        }}
      >
        {/* Left: Inspect Sidebar Toggle Button */}
        <Tooltip title="เปิด/ปิด แถบค้นหาคุณลักษณะ (Feature Search & Inspector)" arrow>
          <Button
            size="small"
            variant={isSidebarOpen ? 'contained' : 'outlined'}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{
              minWidth: 36,
              px: 1.2,
              py: 0.4,
              fontSize: '0.75rem',
              fontWeight: 700,
              bgcolor: isSidebarOpen ? '#0f172a' : 'transparent',
              color: isSidebarOpen ? '#ffffff' : '#334155',
              borderColor: '#cbd5e1',
              '&:hover': {
                bgcolor: isSidebarOpen ? '#1e293b' : '#f1f5f9',
                borderColor: '#94a3b8'
              },
              display: 'flex',
              alignItems: 'center',
              gap: 0.8
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            <span>ตรวจสอบคุณลักษณะ</span>
          </Button>
        </Tooltip>

        {/* Right: Layer Toggles (จุด, เส้น, แม่น้ำ, ป้ายทางหลวง, ป้ายชื่อ) */}
        <Stack direction="row" spacing={0.6} alignItems="center" flexWrap="wrap">
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: { xs: 'none', md: 'inline' }, mr: 0.5 }}>
            เลเยอร์:
          </Typography>

          {/* 1. จุด (POIs) */}
          <Button
            size="small"
            variant={showAttractions ? 'contained' : 'outlined'}
            onClick={() => setShowAttractions(!showAttractions)}
            sx={{
              minWidth: 60,
              px: 1,
              py: 0.3,
              fontSize: '0.72rem',
              fontWeight: 700,
              bgcolor: showAttractions ? '#ef4444' : 'transparent',
              color: showAttractions ? '#ffffff' : '#64748b',
              borderColor: showAttractions ? '#ef4444' : '#e2e8f0',
              '&:hover': { bgcolor: showAttractions ? '#dc2626' : '#fee2e2' }
            }}
          >
            📍 จุด
          </Button>

          {/* 2. เส้น (Roads) */}
          <Button
            size="small"
            variant={showRoads ? 'contained' : 'outlined'}
            onClick={() => setShowRoads(!showRoads)}
            sx={{
              minWidth: 60,
              px: 1,
              py: 0.3,
              fontSize: '0.72rem',
              fontWeight: 700,
              bgcolor: showRoads ? '#f97316' : 'transparent',
              color: showRoads ? '#ffffff' : '#64748b',
              borderColor: showRoads ? '#f97316' : '#e2e8f0',
              '&:hover': { bgcolor: showRoads ? '#ea580c' : '#ffedd5' }
            }}
          >
            🛣️ เส้น
          </Button>

          {/* 3. แม่น้ำ (Rivers) */}
          <Button
            size="small"
            variant={showRivers ? 'contained' : 'outlined'}
            onClick={() => setShowRivers(!showRivers)}
            sx={{
              minWidth: 65,
              px: 1,
              py: 0.3,
              fontSize: '0.72rem',
              fontWeight: 700,
              bgcolor: showRivers ? '#0284c7' : 'transparent',
              color: showRivers ? '#ffffff' : '#64748b',
              borderColor: showRivers ? '#0284c7' : '#e2e8f0',
              '&:hover': { bgcolor: showRivers ? '#0369a1' : '#e0f2fe' }
            }}
          >
            🌊 แม่น้ำ
          </Button>

          {/* 4. ป้ายทางหลวง (Badges) */}
          <Button
            size="small"
            variant={showBadges ? 'contained' : 'outlined'}
            onClick={() => setShowBadges(!showBadges)}
            sx={{
              minWidth: 70,
              px: 1,
              py: 0.3,
              fontSize: '0.72rem',
              fontWeight: 700,
              bgcolor: showBadges ? '#334155' : 'transparent',
              color: showBadges ? '#ffffff' : '#64748b',
              borderColor: showBadges ? '#334155' : '#e2e8f0',
              '&:hover': { bgcolor: showBadges ? '#1e293b' : '#f1f5f9' }
            }}
          >
            🛡️ ป้ายทาง
          </Button>

          {/* 5. ป้ายชื่ออำเภอ (Town Labels) */}
          <Button
            size="small"
            variant={showLabels ? 'contained' : 'outlined'}
            onClick={() => setShowLabels(!showLabels)}
            sx={{
              minWidth: 65,
              px: 1,
              py: 0.3,
              fontSize: '0.72rem',
              fontWeight: 700,
              bgcolor: showLabels ? '#10b981' : 'transparent',
              color: showLabels ? '#ffffff' : '#64748b',
              borderColor: showLabels ? '#10b981' : '#e2e8f0',
              '&:hover': { bgcolor: showLabels ? '#059669' : '#d1fae5' }
            }}
          >
            🏷️ ชื่ออำเภอ
          </Button>
        </Stack>
      </Box>

      {/* Main Map Viewport: Left Feature Inspector Sidebar + Center Canvas */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: containerHeight,
          display: 'flex',
          overflow: 'hidden',
          bgcolor: '#f8fafc'
        }}
      >
        {/* Left Sidebar: Feature Search & Inspector */}
        <FeatureSearchSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          provinceName="เชียงราย"
          searchQuery={searchQuery}
          onSearch={handleSearch}
          isSearching={isSearching}
          searchResults={searchResults}
          selectedFeature={selectedFeature}
          onSelectFeature={(feat) => {
            setSelectedFeature(feat);
            if (feat?.type === 'point' && onSelectPoi) {
              onSelectPoi(feat.data);
            }
          }}
          allPoints={CHIANG_RAI_VECTOR_FEATURES.points}
          allLines={CHIANG_RAI_VECTOR_FEATURES.lines}
          allAreas={CHIANG_RAI_VECTOR_FEATURES.areas}
        />

        {/* Center Canvas Area: Vector Map (Primary) OR GIS Debug Map (Hidden/Debug) */}
        <Box
          sx={{
            flex: 1,
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1, sm: 2 },
            overflow: 'hidden'
          }}
        >
          {showGisDebug ? (
            /* OpenStreetMap Leaflet Canvas (GIS Debug Mode) */
            <OsmMapCanvas
              center={[19.9105, 99.8406]}
              zoom={10}
              tileStyle="satellite"
              showPoints={showAttractions}
              showLines={showRoads}
              showAreas={true}
              points={CHIANG_RAI_VECTOR_FEATURES.points}
              lines={CHIANG_RAI_VECTOR_FEATURES.lines}
              areas={[]}
              activeTrailRoadIds={activeConfig?.roads || []}
              activeTrailPoiIds={activeConfig?.pois || []}
              selectedFeatureId={selectedFeature?.data?.id || null}
              onSelectFeature={(feat) => setSelectedFeature(feat)}
              onSelectRoad={onSelectRoad}
              height="100%"
            />
          ) : (
            /* Primary Chiang Rai Vector Map (100% Rich SVG Architecture) */
            <Box
              sx={{
                width: '100%',
                maxWidth: compact ? '520px' : '720px',
                mx: 'auto',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Floating Info Tooltip */}
              {hoveredRoad && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 15,
                    zIndex: 15,
                    bgcolor: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    px: 2,
                    py: 1,
                    borderRadius: 2.5,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    pointerEvents: 'none',
                    fontSize: '0.8rem',
                    animation: 'fadeIn 0.2s ease'
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800, display: 'block' }}>
                    ทางหลวงหมายเลข {hoveredRoad.hwy}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {hoveredRoad.name}
                  </Typography>
                </Box>
              )}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="991 0 388 463"
                className="w-full h-auto"
                style={{
                  maxHeight: compact ? '400px' : '520px',
                  width: '100%',
                  filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.06))'
                }}
              >
                <defs>
                  <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" />
                  </filter>
                  <filter id="poi-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.6" />
                  </filter>
                  {/* สัญลักษณ์ป้ายทางหลวง (Shield Template) */}
                  <g id="shield-base">
                    <path
                      d="M-9,-7 L9,-7 Q11,2 9,8 L0,12 L-9,8 Q-11,2 -9,-7 Z"
                      fill="#ffffff"
                      stroke="#334155"
                      strokeWidth="1.2"
                      filter="url(#badge-shadow)"
                    />
                  </g>
                </defs>

                {/* Inline CSS Rules */}
                <style>{`
                  .province-base { fill: #ffffff; stroke: #94a3b8; stroke-width: 2.2; stroke-miterlimit: 10; }
                  .river-kok-style { fill: none; stroke: #38bdf8; stroke-width: 5; opacity: 0.75; stroke-linecap: round; }
                  .river-khong-style { fill: none; stroke: #0284c7; stroke-width: 6.5; opacity: 0.85; stroke-linecap: round; }
                  
                  .road-base { fill: none; stroke-linecap: round; stroke-linejoin: round; transition: all 0.25s ease; cursor: pointer; }
                  .road-primary { stroke: #ef4444; stroke-width: 4.8; }
                  .road-secondary { stroke: #f97316; stroke-width: 3.8; }
                  .road-scenic { stroke: #10b981; stroke-width: 3.5; }
                  
                  .road-base:hover { stroke-width: 7px !important; filter: drop-shadow(0 0 8px rgba(239,68,68,0.8)); }
                  
                  .road-active-pulse {
                    stroke-width: 6.5px !important;
                    stroke: ${activeConfig?.themeColor || '#0284c7'} !important;
                    stroke-dasharray: 8 5;
                    animation: dashFlow 1.6s linear infinite;
                    filter: drop-shadow(0 0 6px ${activeConfig?.themeColor || '#0284c7'});
                  }

                  @keyframes dashFlow {
                    from { stroke-dashoffset: 26; }
                    to { stroke-dashoffset: 0; }
                  }

                  .shield-label { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 6.5px; font-weight: 800; fill: #1e293b; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
                  .poi-marker { cursor: pointer; transition: transform 0.2s ease; }
                  .poi-marker:hover { transform: scale(1.35); }
                  .poi-active { transform: scale(1.3); filter: drop-shadow(0 0 7px #ef4444); }
                  .poi-num { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 7px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: central; }
                  
                  .city-label { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 7.5px; font-weight: 800; fill: #334155; text-anchor: middle; paint-order: stroke; stroke: #ffffff; stroke-width: 2.8px; stroke-linejoin: round; pointer-events: none; }
                  .outbound-label { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 7px; font-style: italic; fill: #64748b; font-weight: 600; pointer-events: none; }
                `}</style>

                {/* LAYER 1: ฐานขอบเขตจังหวัดเชียงราย (Boundary) */}
                <g id="layer-boundary">
                  <path
                    id="chiang-rai-province"
                    className="province-base"
                    d="m1374.4 98-13.1 77.1-7.9 15.7-14.4 4-2.6 15.7-10.5 11.7-1.3 1.4 5 8.5-9 9h-13.7v8.6l-6.9 10.2-18.7-3.4-3.4 12-12 3.4-8.5-3.4v22.1l-25.6-1.7-1.7 34.1-13.6-1.7-5.2 5.2-13.6-3.5-13.5 6.8-.4-.2-11.7-15-8.5 5-5.2-1.1-10.2-2.3-5.1 3.4-13.7 6.9-8.5 1.7V340h-20.5l-8.5-6.8-8.5-3.4V340s3.4 12 3.4 15.4-10.2 27.3-10.2 27.3l-3.5 17 6.9 15.4-6.9 8.5-1.7 6.8h-10.2l-13.6 22.2-12 3.4-5-20.5-13.7-8.5-12-30.7 10.2-20.5-.5-9.2-1.2-23.2 1.7-13.6-6.8-10.3-3.4-22.1 6.8-10.3-6.8-5.1v-8.5l-10.2-12 3.4-8.5 13.6-17 10.3 1.7 3.4-15.4 8.5-13.7 8.5-5-15.3-24 13.6-10.2V161l17.1-15.4-1.7-8.5 8.5-3.4-3.4-10.2 22.2-6.9-7.9-14.7h.5l6.5-17-3.4-2.2-11-7 1.4-13.1-2.7-2.6-1.3-10.5-14.4-11.8V27.3l5.3 1.3 40.5 18.3 9.2-4 11.8 9.2 14.4-10.4h13l6.6 5.2 17-36.6 17 1.3c1.3 0 9.2-5.3 9.2-5.3s11.7 13.1 11.7 14.4c0 1.2 7.8 1.3 10 1.3q.5 0 1 .4l16.5 14 1.3 31.4 18.4 5.3 6.5-6.6-2.6-10.4 13-5.3 9.2-21 6.6-3.8h17l14.4 17 6.5 24.8 7.9 9.2h6.5v11.8s17 15.7 18.3 15.7 11.8-11.8 11.8-11.8z"
                  />
                </g>

                {/* LAYER 2: สายน้ำธรรมชาติ (แม่น้ำกก & แม่น้ำโขง) */}
                {showRivers && (
                  <g id="layer-rivers">
                    {/* แม่น้ำกก */}
                    <path
                      id="river-kok"
                      className="river-kok-style"
                      d="M1249.9 73.8c-6.7 0-6 12-12 14-1.9.7-4.6-2.2-5.9-.8-.3.4 2.6 3.3 2.3 4.5q0 .4-.3.6c-4 4-1.7 6-4.9 10-3 3.8-8.5 5.6-12 9.3-1.2 1.3.7 2.7-.2 3.7-1.1 1.2-3.7 0-5.1 1-1 .6-.7 6.6-3.3 8.5-1.4 1-3.4-.9-4.8-.1-.4.2-3.2 4.7-3.5 5.3a52 52 0 0 0-1.9 16.1c.3 1.4 4.7 3.2 5.5 5 1.2 2.6-1.9 6-3.4 7.8-12 13.8-28.1 13.8-45 13.8-3.3 0-5.8.6-7.6 3.7-.1.4-1.2 1.6-1.7 1-1.9-2 1.5-6.3-2-8.2-2-1-4.9 1.2-7 .2-2.4-1.3-3.4-4-6.2-5.4-2.3-1-6.2.1-8.7-.2-1.7-.2-2.2-2.7-3.8-3.4-4.3-1.9-9-.3-13.2-3-6-3.8-3.8-11-8.6-14.7-4-3.2-9.6.6-14-.5-3.9-1-7.3-6.5-11.1-7-2.4-.3-12-1.1-13.2-3.5"
                      onClick={() => setSelectedFeature({ type: 'line', data: { name: 'แม่น้ำกก', description: 'แม่น้ำสายสำคัญ หล่อเลี้ยงอารยธรรมและชุมชนท่องเที่ยวเชียงราย' } })}
                    />
                    {/* แม่น้ำโขง */}
                    <path
                      id="river-khong"
                      className="river-khong-style"
                      d="M1339.4 83.4c-.5 1.2-2.6 1.5-3.3 2.8-1.4 2.9.6 5.3-2.3 8.2-1.8 1.7-5 2.9-6.2 5-1.8 3 2 8.7-.5 11.9-1.5 1.8-5 .6-6.3 2-1.4 1.4 1.2 6.3 1.1 8.2 0 1.2-4.2 8-5.3 9.4-1.5 1.8-4 1.8-5.4 3.4-2.4 2.7-2.9 6.7-5.5 9.4l-.3.3c-3.2 2-5.4-2.3-8.2 1.4-3.1 4.1 1.6 6.7 1.1 11.2-.4 3.8-4 4.3-5.4 7.2-2.2 4.4-.4 11.8-4.2 15.4-1.7 1.6-4.5-3.5-6-2.4-2 1.3-2.5 5.7-3.5 7.7-1.7 3.7-5.1 5.9-7.3 9-2.2 3.2-3 7.4-5 10.7-1.4 2.3-6 2.2-6.8 4.3-.8 1.8 3.8 2.1 4.4 3.7 1.7 4.8-2.8 9-2.3 13.6.2 2.4 4.1 2.3 4.2 4.8 0 .6-1.4 15.1-1.6 15.7-.6 2.2-2.7 4-3 6.3-.3 3.6 2 6.7 1.5 10-.3 2.5-3.6 4.2-3.6 7"
                      onClick={() => setSelectedFeature({ type: 'line', data: { name: 'แม่น้ำโขง', description: 'แม่น้ำนานาชาติ ชายแดนไทย-ลาว เชื่อมสามเหลี่ยมทองคำ' } })}
                    />
                  </g>
                )}

                {/* LAYER 3: โครงข่ายถนน (Road Network 8 สาย) */}
                {showRoads && (
                  <g id="layer-roads">
                    {/* สาย 1: พหลโยธิน */}
                    <path
                      id="road-hwy-1"
                      className={`road-base road-primary ${isRoadActive('road-hwy-1') ? 'road-active-pulse' : ''}`}
                      d="M1144.5 328.5c-2.9-8.5-4.6-16.8-5.5-22.3-1.4-7.9-4-15.6-5-23.8-1-7.7 1.5-16.3 0-23.9-2-9-6-11.6-6.4-23.6a46 46 0 0 1 7-25.1c6-9.5 7.6-14.5 16.6-20.1 6.4-4 11.2-16.4 13.2-23.2 2.7-8.8 8.2-42.6 7-50.6-1.1-7.7-9.8-9.3-9.6-18 .1-4.6 2.3-8.8 2.7-13.1.6-5.7-1-11.9.6-17.4 2.3-7.4 6.4-15 7.2-22.7 1.4-13.4-.4-27.3-.4-40.6"
                      onMouseEnter={() => setHoveredRoad({ hwy: '1', name: 'ถนนพหลโยธิน (พาน - เมือง - แม่จัน - แม่สาย)' })}
                      onMouseLeave={() => setHoveredRoad(null)}
                      onClick={() => handleRoadClick('1', 'ถนนพหลโยธิน', 'road-hwy-1')}
                    />

                    {/* สาย 118: เชียงใหม่ - แม่สรวย - แม่ลาว */}
                    <path
                      id="road-hwy-118"
                      className={`road-base road-primary ${isRoadActive('road-hwy-118') ? 'road-active-pulse' : ''}`}
                      style={{ stroke: '#ea580c' }}
                      d="M1013.7 437.5c11-9.4 20.2-12.8 35.1-21.3 5.4-3 9.2-4.5 13.1-9.3 6.7-8 6.8-15.3 7-19.3.3-6.7-.3-12.1-.5-19-.3-6.8.7-9.6.2-16.3-.4-6.3-5.3-41.4-6.7-47.6-6.7-31.7 20.2-82.9 67-81.5"
                      onMouseEnter={() => setHoveredRoad({ hwy: '118', name: 'สายเชียงใหม่ - เวียงป่าเป้า - แม่สรวย' })}
                      onMouseLeave={() => setHoveredRoad(null)}
                      onClick={() => handleRoadClick('118', 'สายเชียงใหม่ - เชียงราย', 'road-hwy-118')}
                    />

                    {/* สาย 1016: แม่จัน - เชียงแสน */}
                    <path
                      id="road-hwy-1016"
                      className={`road-base road-secondary ${isRoadActive('road-hwy-1016') ? 'road-active-pulse' : ''}`}
                      d="M1164.4 100.9q4.8-1.9 7.4-5.8c1.3-2 2.2-4 4.1-5.6 3.4-2.8 8.5-3.3 11.7-6.3 2.1-1.9 3-6 4.5-8.3 3.1-4.8 12.4-7.3 17.3-9.4 7.6-3.2 16.2 1.7 23.6-.9"
                      onMouseEnter={() => setHoveredRoad({ hwy: '1016', name: 'แม่จัน - เชียงแสน (เชื่อมสามเหลี่ยมทองคำ)' })}
                      onMouseLeave={() => setHoveredRoad(null)}
                      onClick={() => handleRoadClick('1016', 'แม่จัน - เชียงแสน', 'road-hwy-1016')}
                    />

                    {/* สาย 1089: แม่จัน - ท่าตอน - ฝาง */}
                    <path
                      id="road-hwy-1089"
                      className={`road-base road-secondary ${isRoadActive('road-hwy-1089') ? 'road-active-pulse' : ''}`}
                      d="M1162 105.2a50 50 0 0 1-19.1 9.2c-10.6 1.6-21.8-1-32.4-.4-5.3.4-10 3.4-15.8 3.3-6.5-.1-13-3.1-19.6-2.4-3.8.4-5 4-7.7 6a25 25 0 0 1-9.9 4.5"
                      onMouseEnter={() => setHoveredRoad({ hwy: '1089', name: 'แม่จัน - ท่าตอน - อ.ฝาง (เชื่อมดอยแม่สลอง)' })}
                      onMouseLeave={() => setHoveredRoad(null)}
                      onClick={() => handleRoadClick('1089', 'แม่จัน - ฝาง', 'road-hwy-1089')}
                    />

                    {/* สาย 1232 / 1174: เวียงชัย - พญาเม็งราย */}
                    <path
                      id="road-hwy-1232-1174"
                      className={`road-base road-secondary ${isRoadActive('road-hwy-1232-1174') ? 'road-active-pulse' : ''}`}
                      d="M1162.7 174.4c6.2 0 13.2-1 19.4 0 6 .9 8.8 4.3 15.4 3.3 6.3-.9 7.4-8.5 17.9-6.7 5.3.9 12.2 4 17 6.3 6.5 3 31.2.7 37.5-3 6.6-4 4.4-19.7 6.6-26 2-5.5 7.6-8.4 10-13.4 4.1-8.2 6.7-21.2 11.4-28.4 3.4-5 10.7-6.3 13.3-11 2.2-3.8-.2-9.4 2.8-12.9 1.4-1.6 3.7 0 5.3-1.2 2.7-2 5.7-10.8 5.7-14"
                      onMouseEnter={() => setHoveredRoad({ hwy: '1232/1174', name: 'เวียงชัย - พญาเม็งราย - ดอยหลวง' })}
                      onMouseLeave={() => setHoveredRoad(null)}
                      onClick={() => handleRoadClick('1232', 'เวียงชัย - พญาเม็งราย', 'road-hwy-1232-1174')}
                    />

                    {/* สาย 1020 / 1292: เชียงราย - เทิง */}
                    <path
                      id="road-hwy-1020-1292"
                      className={`road-base road-secondary ${isRoadActive('road-hwy-1020-1292') ? 'road-active-pulse' : ''}`}
                      d="M1158.3 184c.5 12.4 14.8 7.5 19.3 16.6 2.4 5.1 6 17 6.8 22.7 1.1 7-1.9 16.4 4.3 22.5 4.8 4.8 11.9 11.7 17.7 15 2.8 1.5 6.7.9 9.7 1.8 6.1 2 16.2 7 20.1 12.2 3 3.9 2.6 11 4.2 15.6"
                      onMouseEnter={() => setHoveredRoad({ hwy: '1020', name: 'เมืองเชียงราย - เทิง - ป่าแดด' })}
                      onMouseLeave={() => setHoveredRoad(null)}
                      onClick={() => handleRoadClick('1020', 'เชียงราย - เทิง', 'road-hwy-1020-1292')}
                    />

                    {/* สาย 1155: เชียงของ - เวียงแก่น - ภูชี้ฟ้า */}
                    <path
                      id="road-hwy-1155"
                      className={`road-base road-scenic ${isRoadActive('road-hwy-1155') ? 'road-active-pulse' : ''}`}
                      d="M1320 82c0 3.6-1.5 10.6 0 13.9 2.8 5.9 6 8.3 4.9 15.4-.4 2.5-4 3.8-4.8 6.2-2 5.3-5.6 9.5-8.2 14.6-1.6 3.1-1.5 7.4-3.3 10.2-1.9 3-5.5 4-7.3 7.4-6.9 12.4-10.2 25.8-15.7 38.8-1.8 4.3-6.2 7-8.4 11-4.8 8.6-3 21.6-5.9 31.2-1.1 3.9-7.7 6.4-8.2 9.6"
                      onMouseEnter={() => setHoveredRoad({ hwy: '1155', name: 'เส้นทางท่องเที่ยวภูชี้ฟ้า - เวียงแก่น' })}
                      onMouseLeave={() => setHoveredRoad(null)}
                      onClick={() => handleRoadClick('1155', 'เส้นทางภูชี้ฟ้า', 'road-hwy-1155')}
                    />

                    {/* สาย 1021: เทิง - เชียงคำ (พะเยา) */}
                    <path
                      id="road-hwy-1021"
                      className={`road-base road-secondary ${isRoadActive('road-hwy-1021') ? 'road-active-pulse' : ''}`}
                      d="M1221.3 262.9a35 35 0 0 1 12.8-15c5.4-4 7.3-8.2 14.1-10.6 7-2.5 8.8 3.3 14.8 5.1 5 1.6 12-1.7 16.8.3 5.7 2.5 10 8.4 14.4 12.5"
                      onMouseEnter={() => setHoveredRoad({ hwy: '1021', name: 'เทิง - เชียงคำ เชื่อมต่อพะเยา' })}
                      onMouseLeave={() => setHoveredRoad(null)}
                      onClick={() => handleRoadClick('1021', 'เทิง - เชียงคำ', 'road-hwy-1021')}
                    />
                  </g>
                )}

                {/* LAYER 4: ป้ายสัญลักษณ์ทางหลวง (Highway Badges) */}
                {showBadges && (
                  <g id="layer-road-badges">
                    <g transform="translate(1194, 52)"><use href="#shield-base" /><text className="shield-label">1</text></g>
                    <g transform="translate(1142, 290)"><use href="#shield-base" /><text className="shield-label">1</text></g>
                    <g transform="translate(1048, 385)"><use href="#shield-base" /><text className="shield-label">118</text></g>
                    <g transform="translate(1202, 85)"><use href="#shield-base" /><text className="shield-label">1016</text></g>
                    <g transform="translate(1105, 115)"><use href="#shield-base" /><text className="shield-label">1089</text></g>
                    <g transform="translate(1185, 220)"><use href="#shield-base" /><text className="shield-label">1020</text></g>
                    <g transform="translate(1255, 260)"><use href="#shield-base" /><text className="shield-label">1021</text></g>
                  </g>
                )}

                {/* LAYER 5: ข้อความเชื่อมต่อไปยังจังหวัดข้างเคียง */}
                <g id="layer-connectors">
                  <text x="1205" y="18" className="outbound-label">➔ ท่าขี้เหล็ก (เมียนมา)</text>
                  <text x="1330" y="70" className="outbound-label">➔ สปป.ลาว</text>
                  <text x="995" y="445" className="outbound-label">➔ ไปเชียงใหม่</text>
                  <text x="1055" y="130" className="outbound-label">➔ ไปฝาง</text>
                  <text x="1135" y="342" className="outbound-label">➔ ไปพะเยา</text>
                  <text x="1265" y="278" className="outbound-label">➔ ไปเชียงคำ</text>
                </g>

                {/* LAYER 6: จุดแลนด์มาร์กท่องเที่ยว (POIs 8 จุด) */}
                {showAttractions && (
                  <g id="layer-attractions">
                    {/* POI 1: ดอยแม่สลอง */}
                    <Tooltip title="1. ดอยแม่สลอง (ชาอู่หลง & วิถีชุมชนจีนยูนนาน)" arrow placement="top">
                      <g id="poi-1" className={`poi-marker ${isPoiActive('poi-1') ? 'poi-active' : ''}`} transform="translate(1120, 85)" filter="url(#poi-glow)" onClick={() => handlePoiClick('poi-1')}>
                        <circle r="6.5" fill={isPoiActive('poi-1') ? '#ef4444' : '#e11d48'} stroke="#ffffff" strokeWidth="1.5" />
                        <text className="poi-num">1</text>
                      </g>
                    </Tooltip>

                    {/* POI 2: ดอยช้างมูบ */}
                    <Tooltip title="2. จุดชมวิวดอยช้างมูบ ฐานปฏิบัติการชายแดน" arrow placement="top">
                      <g id="poi-2" className={`poi-marker ${isPoiActive('poi-2') ? 'poi-active' : ''}`} transform="translate(1178, 42)" filter="url(#poi-glow)" onClick={() => handlePoiClick('poi-2')}>
                        <circle r="6.5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                        <text className="poi-num">2</text>
                      </g>
                    </Tooltip>

                    {/* POI 3: พระตำหนักดอยตุง */}
                    <Tooltip title="3. พระตำหนักดอยตุง & สวนแม่ฟ้าหลวง" arrow placement="top">
                      <g id="poi-3" className={`poi-marker ${isPoiActive('poi-3') ? 'poi-active' : ''}`} transform="translate(1172, 62)" filter="url(#poi-glow)" onClick={() => handlePoiClick('poi-3')}>
                        <circle r="6.5" fill={isPoiActive('poi-3') ? '#ef4444' : '#e11d48'} stroke="#ffffff" strokeWidth="1.5" />
                        <text className="poi-num">3</text>
                      </g>
                    </Tooltip>

                    {/* POI 4: หอฝิ่น & สามเหลี่ยมทองคำ */}
                    <Tooltip title="4. หอฝิ่น & สามเหลี่ยมทองคำ (สบรวก)" arrow placement="top">
                      <g id="poi-4" className={`poi-marker ${isPoiActive('poi-4') ? 'poi-active' : ''}`} transform="translate(1238, 52)" filter="url(#poi-glow)" onClick={() => handlePoiClick('poi-4')}>
                        <circle r="6.5" fill={isPoiActive('poi-4') ? '#ef4444' : '#e11d48'} stroke="#ffffff" strokeWidth="1.5" />
                        <text className="poi-num">4</text>
                      </g>
                    </Tooltip>

                    {/* POI 8: วัดร่องเสือเต้น */}
                    <Tooltip title="8. วัดร่องเสือเต้น & พิพิธภัณฑ์บ้านดำ" arrow placement="top">
                      <g id="poi-8" className={`poi-marker ${isPoiActive('poi-8') ? 'poi-active' : ''}`} transform="translate(1155, 168)" filter="url(#poi-glow)" onClick={() => handlePoiClick('poi-8')}>
                        <circle r="6.5" fill={isPoiActive('poi-8') ? '#7c3aed' : '#e11d48'} stroke="#ffffff" strokeWidth="1.5" />
                        <text className="poi-num">8</text>
                      </g>
                    </Tooltip>

                    {/* POI 10: วัดร่องขุ่น */}
                    <Tooltip title="10. วัดร่องขุ่น อ.เฉลิมชัย & สิงห์ปาร์ค" arrow placement="top">
                      <g id="poi-10" className={`poi-marker ${isPoiActive('poi-10') ? 'poi-active' : ''}`} transform="translate(1136, 215)" filter="url(#poi-glow)" onClick={() => handlePoiClick('poi-10')}>
                        <circle r="6.5" fill={isPoiActive('poi-10') ? '#7c3aed' : '#e11d48'} stroke="#ffffff" strokeWidth="1.5" />
                        <text className="poi-num">10</text>
                      </g>
                    </Tooltip>

                    {/* POI 12: ภูชี้ฟ้า */}
                    <Tooltip title="12. จุดชมวิวทะเลหมอก ภูชี้ฟ้า & ภูชี้ดาว" arrow placement="top">
                      <g id="poi-12" className={`poi-marker ${isPoiActive('poi-12') ? 'poi-active' : ''}`} transform="translate(1288, 218)" filter="url(#poi-glow)" onClick={() => handlePoiClick('poi-12')}>
                        <circle r="6.5" fill={isPoiActive('poi-12') ? '#059669' : '#e11d48'} stroke="#ffffff" strokeWidth="1.5" />
                        <text className="poi-num">12</text>
                      </g>
                    </Tooltip>

                    {/* POI 14: ดอยช้าง */}
                    <Tooltip title="14. ดอยช้าง (Specialty Coffee) & น้ำพุร้อนแม่ขะจาน" arrow placement="top">
                      <g id="poi-14" className={`poi-marker ${isPoiActive('poi-14') ? 'poi-active' : ''}`} transform="translate(1048, 412)" filter="url(#poi-glow)" onClick={() => handlePoiClick('poi-14')}>
                        <circle r="6.5" fill={isPoiActive('poi-14') ? '#0284c7' : '#e11d48'} stroke="#ffffff" strokeWidth="1.5" />
                        <text className="poi-num">14</text>
                      </g>
                    </Tooltip>
                  </g>
                )}

                {/* LAYER 7: ป้ายชื่ออำเภอสำคัญ (Town Labels) */}
                {showLabels && (
                  <g id="layer-labels">
                    <text x="1195" y="38" className="city-label">อ.แม่สาย</text>
                    <text x="1235" y="80" className="city-label">อ.เชียงแสน</text>
                    <text x="1165" y="112" className="city-label">อ.แม่จัน</text>
                    <text x="1155" y="185" className="city-label">อ.เมืองเชียงราย</text>
                    <text x="1330" y="105" className="city-label">อ.เชียงของ</text>
                    <text x="1135" y="275" className="city-label">อ.พาน</text>
                    <text x="1075" y="285" className="city-label">อ.แม่สรวย</text>
                    <text x="1045" y="365" className="city-label">อ.เวียงป่าเป้า</text>
                    <text x="1225" y="250" className="city-label">อ.เทิง</text>
                  </g>
                )}
              </svg>
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer Notes: Vector GIS & Multi-province Info */}
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.72rem' }}>
          * แผนที่เวกเตอร์เชียงรายแบบโต้ตอบ ผสานระบบค้นหาด้วย Vector Database (คลิกปุ่ม 🛠️ GIS Debug เพื่อดูพิกัดจริง)
        </Typography>

        <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700, fontSize: '0.72rem' }}>
          8 จุดแลนด์มาร์ก • 8 เส้นทางหลวงหลัก • 2 แม่น้ำสายสำคัญ
        </Typography>
      </Box>
    </Box>
  );
}
