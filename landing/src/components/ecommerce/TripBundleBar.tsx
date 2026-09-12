'use client';

// ============================================================================
// TripBundleBar.tsx — GoThailand Trio Bundle Builder Bar (BMC User Specification)
// ----------------------------------------------------------------------------
// Implements:
// 1. Floating Sticky Bar (Glassmorphism & Collapsible)
// 2. 3-Leg Progressive Travel Planner (🏠 ที่พัก + 🚗 รถเช่า + 🧭 ไกด์ท้องถิ่น)
// 3. Destination Switcher (เชียงใหม่, ภูเก็ต, สุราษฎร์ฯ, กรุงเทพฯ, อยุธยา, กระบี่ ฯลฯ)
// 4. CartContext Reactive Integration (ตรวจจับสินค้าในตะกร้าอัตโนมัติ)
// 5. Trio Combo Gamification (ส่วนลด 15% เมื่อครบ 3 ขา + โบนัส 300 GoThailand Points)
// 6. Quick Service Picker Dialog (เลือกและเพิ่มบริการเข้า Bundle ทันทีใน 1 คลิก)
// ============================================================================

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { useCart } from '@/contexts/CartContext';

// ข้อมูลบริการแนะนำรายจังหวัดสำหรับ Quick Picker
export interface BundleServiceOption {
  id: string;
  name: string;
  category: 'accommodation' | 'car_rental' | 'guide';
  categoryLabel: string;
  provinceSlug: string;
  provinceName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  bonusPoints: number;
  tag: string;
  imageUrl: string;
  description: string;
}

const BUNDLE_RECOMMENDED_SERVICES: BundleServiceOption[] = [
  // เชียงใหม่ (Chiang Mai)
  {
    id: 'cm-stay-1',
    name: 'โฮมสเตย์แม่กำปองวิวหมอก (พร้อมอาหารเช้า)',
    category: 'accommodation',
    categoryLabel: 'ที่พัก',
    provinceSlug: 'chiang-mai',
    provinceName: 'เชียงใหม่',
    price: 1250,
    originalPrice: 1500,
    rating: 4.9,
    bonusPoints: 100,
    tag: 'ที่พักโฮมสเตย์',
    imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=500&auto=format&fit=crop&q=80',
    description: 'บ้านไม้ริมลำธาร สัมผัสไอหมอกยามเช้าและวิถีชีวิตชาวบ้านแม่กำปองแท้ๆ'
  },
  {
    id: 'cm-car-1',
    name: 'รถเช่า Toyota Yaris Ativ (รับ-คืน สนามบินเชียงใหม่)',
    category: 'car_rental',
    categoryLabel: 'รถเช่า',
    provinceSlug: 'chiang-mai',
    provinceName: 'เชียงใหม่',
    price: 890,
    originalPrice: 1100,
    rating: 4.8,
    bonusPoints: 150,
    tag: 'บริการเดินทาง',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=80',
    description: 'รถยนต์ประหยัดน้ำมัน สภาพใหม่ ประกันภัยชั้น 1 ฟรี คืนน้ำมันตามจริง'
  },
  {
    id: 'cm-guide-1',
    name: 'มัคคุเทศก์ท้องถิ่น พาดอยอินทนนท์ & กิ่วแม่ปาน 1 วัน',
    category: 'guide',
    categoryLabel: 'ไกด์ท้องถิ่น',
    provinceSlug: 'chiang-mai',
    provinceName: 'เชียงใหม่',
    price: 1450,
    originalPrice: 1800,
    rating: 5.0,
    bonusPoints: 150,
    tag: 'ทัวร์และกิจกรรม',
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=500&auto=format&fit=crop&q=80',
    description: 'ไกด์เจ้าถิ่นมีใบอนุญาต พาเดินเส้นทางลับ สัมผัสวัฒนธรรมล้านนาและยอดดอยสูงสุด'
  },

  // ภูเก็ต (Phuket)
  {
    id: 'pk-stay-1',
    name: 'พูลวิลล่าริมหาดป่าตองซีวิว (Patong Sunset Villa)',
    category: 'accommodation',
    categoryLabel: 'ที่พัก',
    provinceSlug: 'phuket',
    provinceName: 'ภูเก็ต',
    price: 2800,
    originalPrice: 3500,
    rating: 4.9,
    bonusPoints: 150,
    tag: 'ที่พักรีสอร์ท',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80',
    description: 'วิลล่าสไตล์โมเดิร์น สระว่ายน้ำส่วนตัว มองเห็นพระอาทิตย์ตกดินริมทะเล'
  },
  {
    id: 'pk-car-1',
    name: 'รถตู้ VIP 9 ที่นั่ง พร้อมคนขับ (รับส่งสนามบินภูเก็ต)',
    category: 'car_rental',
    categoryLabel: 'รถเช่า',
    provinceSlug: 'phuket',
    provinceName: 'ภูเก็ต',
    price: 1800,
    originalPrice: 2200,
    rating: 4.9,
    bonusPoints: 150,
    tag: 'บริการเดินทาง',
    imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=500&auto=format&fit=crop&q=80',
    description: 'เดินทางเป็นหมู่คณะสะดวกสบาย เบาะนวดไฟฟ้า คนขับชำนาญทางปลอดภัย'
  },
  {
    id: 'pk-guide-1',
    name: 'ทัวร์เรือยอชต์คาตามารัน เกาะเฮ & แหลมพรหมเทพ',
    category: 'guide',
    categoryLabel: 'ไกด์ท้องถิ่น',
    provinceSlug: 'phuket',
    provinceName: 'ภูเก็ต',
    price: 1690,
    originalPrice: 2100,
    rating: 4.8,
    bonusPoints: 150,
    tag: 'ทัวร์ทางทะเล',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    description: 'ล่องเรือชมพระอาทิตย์ตก ดำน้ำดูปะการังน้ำตื้น พร้อมไกด์ผู้เชี่ยวชาญการันตีความปลอดภัย'
  },

  // สุราษฎร์ธานี (Surat Thani - Samui)
  {
    id: 'st-stay-1',
    name: 'แพริมน้ำเขื่อนเชี่ยวหลาน (Khao Sok Floating Resort)',
    category: 'accommodation',
    categoryLabel: 'ที่พัก',
    provinceSlug: 'surat-thani',
    provinceName: 'สุราษฎร์ธานี',
    price: 2400,
    originalPrice: 2900,
    rating: 4.9,
    bonusPoints: 120,
    tag: 'ที่พักธรรมชาติ',
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&auto=format&fit=crop&q=80',
    description: 'นอนแพกลางสายน้ำมรกต กุ้ยหลินเมืองไทย พายเรือคายัคฟรีหน้าห้องพัก'
  },
  {
    id: 'st-car-1',
    name: 'รถ SUV ขับเคลื่อน 4 ล้อ เที่ยวเขาสก (Surat Airport)',
    category: 'car_rental',
    categoryLabel: 'รถเช่า',
    provinceSlug: 'surat-thani',
    provinceName: 'สุราษฎร์ธานี',
    price: 1350,
    originalPrice: 1700,
    rating: 4.7,
    bonusPoints: 150,
    tag: 'บริการเดินทาง',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=80',
    description: 'ลุยได้ทุกเส้นทางธรรมชาติ กว้างขวาง จุสัมภาระได้ครบครัน'
  },
  {
    id: 'st-guide-1',
    name: 'ไกด์ท้องถิ่น ล่องเรือหางยาวกุ้ยหลิน & ถ้ำปะการัง',
    category: 'guide',
    categoryLabel: 'ไกด์ท้องถิ่น',
    provinceSlug: 'surat-thani',
    provinceName: 'สุราษฎร์ธานี',
    price: 1100,
    originalPrice: 1400,
    rating: 5.0,
    bonusPoints: 150,
    tag: 'ทัวร์และกิจกรรม',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=80',
    description: 'ชี้จุดถ่ายรูปเขาสามเกลอ ชมหินงอกหินย้อย พร้อมเรื่องเล่าตำนานเขื่อนเชี่ยวหลาน'
  }
];

const POPULAR_DESTINATIONS = [
  { slug: 'chiang-mai', name: 'เชียงใหม่ (Chiang Mai)' },
  { slug: 'phuket', name: 'ภูเก็ต (Phuket)' },
  { slug: 'surat-thani', name: 'สุราษฎร์ธานี (Surat Thani)' },
  { slug: 'krabi', name: 'กระบี่ (Krabi)' },
  { slug: 'bangkok', name: 'กรุงเทพฯ (Bangkok)' },
  { slug: 'nan', name: 'น่าน (Nan)' }
];

export interface TripBundleBarProps {
  initialProvince?: string;
  onNavigateToExplore?: () => void;
}

export default function TripBundleBar({ initialProvince = 'chiang-mai', onNavigateToExplore }: TripBundleBarProps) {
  const { items, addToCart } = useCart();

  const [selectedProvince, setSelectedProvince] = useState<string>(initialProvince);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [activePickerCategory, setActivePickerCategory] = useState<'accommodation' | 'car_rental' | 'guide' | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // ตรวจจับสินค้าใน Cart ว่ามีขาไหนบ้าง
  const legStatus = useMemo(() => {
    let hasStay = false;
    let stayItem: any = null;

    let hasCar = false;
    let carItem: any = null;

    let hasGuide = false;
    let guideItem: any = null;

    items.forEach((item) => {
      const tagLower = (item.tag || '').toLowerCase();
      const nameLower = (item.name || '').toLowerCase();

      // Check Stay
      if (
        tagLower.includes('พัก') ||
        tagLower.includes('โฮมสเตย์') ||
        tagLower.includes('รีสอร์ท') ||
        tagLower.includes('stay') ||
        tagLower.includes('hotel') ||
        tagLower.includes('villa') ||
        nameLower.includes('พัก') ||
        nameLower.includes('โฮมสเตย์') ||
        nameLower.includes('รีสอร์ท') ||
        nameLower.includes('วิลล่า')
      ) {
        hasStay = true;
        stayItem = item;
      }

      // Check Car
      if (
        tagLower.includes('รถ') ||
        tagLower.includes('เดินทาง') ||
        tagLower.includes('transport') ||
        tagLower.includes('car') ||
        tagLower.includes('van') ||
        nameLower.includes('รถ') ||
        nameLower.includes('เช่ารถ') ||
        nameLower.includes('รถตู้') ||
        nameLower.includes('คนขับ')
      ) {
        hasCar = true;
        carItem = item;
      }

      // Check Guide
      if (
        tagLower.includes('ไกด์') ||
        tagLower.includes('ทัวร์') ||
        tagLower.includes('guide') ||
        tagLower.includes('tour') ||
        tagLower.includes('กิจกรรม') ||
        tagLower.includes('ดำน้ำ') ||
        nameLower.includes('ไกด์') ||
        nameLower.includes('ทัวร์') ||
        nameLower.includes('มัคคุเทศก์') ||
        nameLower.includes('นำเที่ยว')
      ) {
        hasGuide = true;
        guideItem = item;
      }
    });

    const count = (hasStay ? 1 : 0) + (hasCar ? 1 : 0) + (hasGuide ? 1 : 0);
    return {
      hasStay,
      stayItem,
      hasCar,
      carItem,
      hasGuide,
      guideItem,
      completedCount: count,
      isTrioComplete: count === 3
    };
  }, [items]);

  // คำนวณยอดเงินและส่วนลด Trio Combo 15%
  const pricingInfo = useMemo(() => {
    const rawTotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const discountAmount = legStatus.isTrioComplete ? Math.round(rawTotal * 0.15) : 0;
    const finalTotal = Math.max(0, rawTotal - discountAmount);
    const earnedPoints = legStatus.isTrioComplete ? 300 : legStatus.completedCount * 50;

    return {
      rawTotal,
      discountAmount,
      finalTotal,
      earnedPoints
    };
  }, [items, legStatus]);

  // เปิด Dialog เลือกบริการด่วน
  const handleOpenPicker = (category: 'accommodation' | 'car_rental' | 'guide') => {
    setActivePickerCategory(category);
    setPickerOpen(true);
  };

  // กรองบริการตามจังหวัดและหมวดหมู่
  const filteredServices = useMemo(() => {
    if (!activePickerCategory) return [];
    return BUNDLE_RECOMMENDED_SERVICES.filter(
      (s) => s.category === activePickerCategory && (s.provinceSlug === selectedProvince || selectedProvince === 'all')
    );
  }, [activePickerCategory, selectedProvince]);

  // กดเพิ่มบริการลงตะกร้า
  const handleSelectService = async (service: BundleServiceOption) => {
    try {
      setIsAdding(true);
      await addToCart({
        _id: service.id,
        name: service.name,
        price: service.price,
        tag: service.tag,
        imageUrl: service.imageUrl
      });
      setPickerOpen(false);
    } catch (err) {
      console.error('Failed to add bundle service to cart', err);
    } finally {
      setIsAdding(false);
    }
  };

  const getProvinceName = () => {
    const p = POPULAR_DESTINATIONS.find((d) => d.slug === selectedProvince);
    return p ? p.name.split(' ')[0] : 'จุดหมายปลายทาง';
  };

  // ==========================================
  // RENDER: ย่อเป็น Floating Pill Badge
  // ==========================================
  if (isMinimized) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1200,
          cursor: 'pointer',
          animation: 'fadeInUp 0.3s ease'
        }}
        onClick={() => setIsMinimized(false)}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 1.2,
            bgcolor: legStatus.isTrioComplete ? '#10b981' : 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(16px)',
            color: '#ffffff',
            borderRadius: '50px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 14px 35px rgba(0,0,0,0.35)'
            }
          }}
        >
          <Typography sx={{ fontSize: '1.2rem' }}>📍</Typography>
          <Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>
              ทริป{getProvinceName()} ({legStatus.completedCount}/3 บริการ)
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', opacity: 0.85 }}>
              {legStatus.isTrioComplete
                ? '🎉 ปลดล็อกส่วนลด 15% + 300 แต้มแล้ว!'
                : `เพิ่มอีก ${3 - legStatus.completedCount} ขา เพื่อรับส่วนลด 15%`}
            </Typography>
          </Box>
          <Chip
            size="small"
            label="เปิดดูแผนทริป 🔼"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.7rem',
              ml: 1
            }}
          />
        </Box>
      </Box>
    );
  }

  // ==========================================
  // RENDER: Full Sticky Floating Bar
  // ==========================================
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 12, sm: 20 },
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: 'calc(100% - 24px)', sm: '92%', md: 960 },
          maxWidth: '100%',
          zIndex: 1200,
          bgcolor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: { xs: '20px', md: '24px' },
          border: '1.5px solid',
          borderColor: legStatus.isTrioComplete ? '#10b981' : 'rgba(226, 232, 240, 0.9)',
          boxShadow: '0 16px 40px -8px rgba(15, 23, 42, 0.18), 0 6px 16px -4px rgba(15, 23, 42, 0.08)',
          p: { xs: 1.8, sm: 2.2 },
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Header Bar: Destination Context + Progress Info + Minimize Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '1.25rem' }}>📍</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              วางแผนทริป:
            </Typography>

            {/* Destination Quick Selector */}
            <FormControl size="small" variant="standard">
              <Select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                disableUnderline
                sx={{
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: 'primary.main',
                  bgcolor: 'rgba(37, 99, 235, 0.08)',
                  px: 1.2,
                  py: 0.2,
                  borderRadius: '8px',
                  '& .MuiSelect-select': { py: 0.3, pr: '24px !important' }
                }}
              >
                {POPULAR_DESTINATIONS.map((dest) => (
                  <MenuItem key={dest.slug} value={dest.slug} sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {dest.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Chip
              label={`จัดแล้ว ${legStatus.completedCount}/3 ขา`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.72rem',
                bgcolor: legStatus.isTrioComplete ? '#d1fae5' : '#f1f5f9',
                color: legStatus.isTrioComplete ? '#059669' : '#475569'
              }}
            />
          </Box>

          {/* Banner ข้อเสนอจูงใจ (Dynamic Incentive Message) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 0.6,
                bgcolor: legStatus.isTrioComplete ? '#ecfdf5' : '#fffbeb',
                border: '1px solid',
                borderColor: legStatus.isTrioComplete ? '#a7f3d0' : '#fef3c7',
                px: 1.2,
                py: 0.4,
                borderRadius: '8px'
              }}
            >
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: legStatus.isTrioComplete ? '#059669' : '#b45309' }}>
                {legStatus.isTrioComplete
                  ? '🎉 ครบ 3 ขา! ปลดล็อกส่วนลด Trio Combo 15% + 300 แต้ม'
                  : legStatus.completedCount === 2
                  ? '🔥 เพิ่มอีก 1 บริการเพื่อปลดล็อกส่วนลด 15%!'
                  : '🎁 รวม 3 ขา (ที่พัก + รถ + ไกด์) รับส่วนลด 15%'}
              </Typography>
            </Box>

            {/* Minimize Button */}
            <IconButton
              size="small"
              onClick={() => setIsMinimized(true)}
              title="ย่อแถบวางแผนทริป"
              sx={{
                p: 0.5,
                color: 'text.secondary',
                bgcolor: 'rgba(0,0,0,0.04)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' }
              }}
            >
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>🔽</Typography>
            </IconButton>
          </Box>
        </Box>

        {/* Linear Progress Bar */}
        <Box sx={{ mb: 1.8 }}>
          <LinearProgress
            variant="determinate"
            value={(legStatus.completedCount / 3) * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#e2e8f0',
              '& .MuiLinearProgress-bar': {
                bgcolor: legStatus.isTrioComplete ? '#10b981' : '#2563eb',
                borderRadius: 3,
                transition: 'transform 0.4s ease'
              }
            }}
          />
        </Box>

        {/* 3 Travel Legs + Pricing Action Bar */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr auto' },
            gap: 1.2,
            alignItems: 'center'
          }}
        >
          {/* Leg 1: ที่พัก (Accommodation) */}
          <Box
            onClick={() => !legStatus.hasStay && handleOpenPicker('accommodation')}
            sx={{
              p: 1.2,
              borderRadius: '12px',
              border: '1.5px solid',
              borderColor: legStatus.hasStay ? '#10b981' : '#cbd5e1',
              bgcolor: legStatus.hasStay ? 'rgba(16, 185, 129, 0.06)' : '#ffffff',
              cursor: legStatus.hasStay ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              '&:hover': !legStatus.hasStay ? { borderColor: '#2563eb', bgcolor: 'rgba(37, 99, 235, 0.04)', transform: 'translateY(-1px)' } : {}
            }}
          >
            <Typography sx={{ fontSize: '1.4rem' }}>🏠</Typography>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                ขาที่ 1: ที่พัก
              </Typography>
              {legStatus.hasStay ? (
                <Typography noWrap sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                  ✅ {legStatus.stayItem?.name?.slice(0, 18)}...
                </Typography>
              ) : (
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>
                  + เพิ่มที่พัก
                </Typography>
              )}
            </Box>
          </Box>

          {/* Leg 2: รถเช่า (Car Rental) */}
          <Box
            onClick={() => !legStatus.hasCar && handleOpenPicker('car_rental')}
            sx={{
              p: 1.2,
              borderRadius: '12px',
              border: '1.5px solid',
              borderColor: legStatus.hasCar ? '#10b981' : '#cbd5e1',
              bgcolor: legStatus.hasCar ? 'rgba(16, 185, 129, 0.06)' : '#ffffff',
              cursor: legStatus.hasCar ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              '&:hover': !legStatus.hasCar ? { borderColor: '#2563eb', bgcolor: 'rgba(37, 99, 235, 0.04)', transform: 'translateY(-1px)' } : {}
            }}
          >
            <Typography sx={{ fontSize: '1.4rem' }}>🚗</Typography>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                ขาที่ 2: รถเช่า / เดินทาง
              </Typography>
              {legStatus.hasCar ? (
                <Typography noWrap sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                  ✅ {legStatus.carItem?.name?.slice(0, 18)}...
                </Typography>
              ) : (
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>
                  + เพิ่มรถเช่า <span style={{ fontSize: '0.7rem', color: '#ea580c' }}>(+150 แต้ม)</span>
                </Typography>
              )}
            </Box>
          </Box>

          {/* Leg 3: ไกด์เจ้าถิ่น (Local Tour Guide) */}
          <Box
            onClick={() => !legStatus.hasGuide && handleOpenPicker('guide')}
            sx={{
              p: 1.2,
              borderRadius: '12px',
              border: '1.5px solid',
              borderColor: legStatus.hasGuide ? '#10b981' : '#cbd5e1',
              bgcolor: legStatus.hasGuide ? 'rgba(16, 185, 129, 0.06)' : '#ffffff',
              cursor: legStatus.hasGuide ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              '&:hover': !legStatus.hasGuide ? { borderColor: '#2563eb', bgcolor: 'rgba(37, 99, 235, 0.04)', transform: 'translateY(-1px)' } : {}
            }}
          >
            <Typography sx={{ fontSize: '1.4rem' }}>🧭</Typography>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                ขาที่ 3: ไกด์ท้องถิ่น
              </Typography>
              {legStatus.hasGuide ? (
                <Typography noWrap sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                  ✅ {legStatus.guideItem?.name?.slice(0, 18)}...
                </Typography>
              ) : (
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>
                  + เพิ่มไกด์ <span style={{ fontSize: '0.7rem', color: '#ea580c' }}>(+150 แต้ม)</span>
                </Typography>
              )}
            </Box>
          </Box>

          {/* Summary Pricing & CTA Action */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'space-between', md: 'flex-end' },
              gap: 1.5,
              mt: { xs: 1, md: 0 },
              pt: { xs: 1, md: 0 },
              borderTop: { xs: '1px dashed #e2e8f0', md: 'none' }
            }}
          >
            {items.length > 0 ? (
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'text.primary' }}>
                    ฿{pricingInfo.finalTotal.toLocaleString()}
                  </Typography>
                  {legStatus.isTrioComplete && (
                    <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', textDecoration: 'line-through' }}>
                      ฿{pricingInfo.rawTotal.toLocaleString()}
                    </Typography>
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.7rem', color: legStatus.isTrioComplete ? '#059669' : 'text.secondary', fontWeight: 700 }}>
                  {legStatus.isTrioComplete
                    ? `ประหยัด ฿${pricingInfo.discountAmount.toLocaleString()} + ได้ ${pricingInfo.earnedPoints} แต้ม 🏆`
                    : `มี ${items.length} รายการในตะกร้า`}
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', textAlign: { xs: 'left', md: 'right' } }}>
                คลิกเลือกบริการ<br />เพื่อเริ่มจัดแพ็กเกจ
              </Typography>
            )}

            <Button
              component={Link}
              href="/cart"
              variant="contained"
              color={legStatus.isTrioComplete ? 'success' : 'primary'}
              sx={{
                fontWeight: 800,
                fontSize: '0.85rem',
                borderRadius: '12px',
                px: 2.2,
                py: 1,
                boxShadow: legStatus.isTrioComplete
                  ? '0 6px 20px rgba(16, 185, 129, 0.35)'
                  : '0 6px 20px rgba(37, 99, 235, 0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              {legStatus.isTrioComplete ? 'จองแพ็กเกจลด 15% ➔' : 'ดูตะกร้าสินค้า ➔'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ==========================================
          DIALOG: Quick Service Picker
          ========================================== */}
      <Dialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '1.4rem' }}>
              {activePickerCategory === 'accommodation' ? '🏠' : activePickerCategory === 'car_rental' ? '🚗' : '🧭'}
            </Typography>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                เลือก{activePickerCategory === 'accommodation' ? 'ที่พัก' : activePickerCategory === 'car_rental' ? 'รถเช่า' : 'ไกด์ท้องถิ่น'}สำหรับทริป{getProvinceName()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                บริการแนะนำการันตีคุณภาพ พร้อมรับคะแนนสะสมพิเศษ
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setPickerOpen(false)}>
            ✕
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2 }}>
          <Stack spacing={2}>
            {filteredServices.length > 0 ? (
              filteredServices.map((svc) => (
                <Box
                  key={svc.id}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1.8,
                    p: 1.5,
                    borderRadius: '16px',
                    border: '1.5px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#2563eb',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.06)'
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={svc.imageUrl}
                    alt={svc.name}
                    sx={{
                      width: { xs: '100%', sm: 110 },
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip size="small" label={svc.tag} sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700 }} />
                        <Typography sx={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>
                          ⭐ {svc.rating}
                        </Typography>
                        <Chip
                          size="small"
                          label={`+${svc.bonusPoints} แต้ม`}
                          sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700, bgcolor: '#fef3c7', color: '#b45309' }}
                        />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3, mb: 0.5 }}>
                        {svc.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {svc.description}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'primary.main' }}>
                          ฿{svc.price.toLocaleString()}
                        </Typography>
                        {svc.originalPrice && (
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', textDecoration: 'line-through' }}>
                            ฿{svc.originalPrice.toLocaleString()}
                          </Typography>
                        )}
                      </Box>

                      <Button
                        size="small"
                        variant="contained"
                        disabled={isAdding}
                        onClick={() => handleSelectService(svc)}
                        sx={{
                          fontWeight: 700,
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          px: 1.5
                        }}
                      >
                        + เพิ่มในแพ็กเกจ
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                  ไม่มีบริการแนะนำในจังหวัดนี้ สามารถสำรวจบริการทั้งหมดได้ในหน้าค้นหา
                </Typography>
                <Button component={Link} href="/products" variant="outlined" size="small" onClick={() => setPickerOpen(false)}>
                  ดูรายการบริการทั้งหมด ➔
                </Button>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
          <Button size="small" component={Link} href="/products" onClick={() => setPickerOpen(false)} sx={{ color: 'text.secondary' }}>
            ค้นหาบริการอื่นเพิ่มเติม ➔
          </Button>
          <Button size="small" onClick={() => setPickerOpen(false)}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
