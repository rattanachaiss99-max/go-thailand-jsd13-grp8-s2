'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { getToken } from '@/services/authService';
import { useUser } from '@/contexts/UserContext';
import ProvincePostageStamp from '@/components/profile/ProvincePostageStamp';
import { THAILAND_PROVINCES, Province, REGION_METAS, RegionKey, getProvinceByIdOrSlug } from '@/data/thailandProvinces';
import { prefetchRegionVectors } from '@/services/provinceVectorService';

// ============================================================================
// SVG ICONS
// ============================================================================

function ChatBubbleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function GeminiSparkleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="geminiStarGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="35%" stopColor="#9B72CF" />
          <stop offset="70%" stopColor="#D96570" />
          <stop offset="100%" stopColor="#F4B400" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
        fill="url(#geminiStarGrad2)"
      />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ChevronDownIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SendPlaneIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function MapPinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const GUEST_STORAGE_KEY = 'gt_guest_trial_credits';
const DEFAULT_GUEST_CREDITS = 3;

export default function AiTravelCompanion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  // User Auth & Credits Status
  const [authStatus, setAuthStatus] = useState<{
    isAuthenticated: boolean;
    canAccessAi: boolean;
    aiCredits: number;
    userName: string;
  }>({
    isAuthenticated: false,
    canAccessAi: false,
    aiCredits: 0,
    userName: ''
  });
  const [isStatusChecked, setIsStatusChecked] = useState(false);

  // Guest Quota (stored in localStorage)
  const [guestCredits, setGuestCredits] = useState<number>(DEFAULT_GUEST_CREDITS);

  // Chat query state
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('Gemini 3.7 Flash');
  const [modelMenuAnchor, setModelMenuAnchor] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [convoHistory, setConvoHistory] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Stamp Selector Modal state (กำหนดจุดหมายปลายทางจากแสตมป์ 77 จังหวัด)
  const [isStampModalOpen, setIsStampModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Province | null>(null);
  const [stampFilterRegion, setStampFilterRegion] = useState<RegionKey | 'all'>('all');
  const [stampSearch, setStampSearch] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // 1. ตรวจสอบสถานะ User และโควตา Guest เมื่อโหลดหน้า
  useEffect(() => {
    // โหลด Guest Trial จาก localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        setGuestCredits(isNaN(parsed) ? DEFAULT_GUEST_CREDITS : parsed);
      } else {
        localStorage.setItem(GUEST_STORAGE_KEY, DEFAULT_GUEST_CREDITS.toString());
      }
    }

    // ตรวจสอบ JWT จาก /api/ai/travel-advisor/status
    const token = getToken();
    if (!token) {
      setIsStatusChecked(true);
      return;
    }

    fetch('/api/ai/travel-advisor/status', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated && data.user) {
          setAuthStatus({
            isAuthenticated: true,
            canAccessAi: Boolean(data.user.canAccessAi),
            aiCredits: typeof data.user.aiCredits === 'number' ? data.user.aiCredits : 0,
            userName: data.user.name || ''
          });
        }
      })
      .catch((err) => console.warn('Could not fetch user AI status:', err))
      .finally(() => setIsStatusChecked(true));
  }, []);

  // อ่านค่า prompt จาก URL query param (กรณีคลิกมาจากหน้า "เส้นทางแนะนำ")
  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setQuery(promptParam);
    }
  }, [searchParams]);

  // Prefetch SVG vectors เมื่อเปิดโมดัลแสตมป์
  useEffect(() => {
    if (isStampModalOpen) {
      prefetchRegionVectors(stampFilterRegion);
    }
  }, [isStampModalOpen, stampFilterRegion]);

  // ตรวจสอบว่าผู้ใช้เคยประทับแสตมป์จังหวัดนี้แล้วหรือไม่
  const isProvinceVisited = (prov: Province) => {
    if (!user || !Array.isArray(user.visitedProvinces)) return false;
    return user.visitedProvinces.some((p) => {
      const match = getProvinceByIdOrSlug(p);
      return p === prov.id || p === prov.slug || match?.slug === prov.slug;
    });
  };

  // กรองรายการแสตมป์ตามภาคและคำค้นหา
  const filteredStamps = useMemo(() => {
    return THAILAND_PROVINCES.filter((p) => {
      if (stampFilterRegion !== 'all' && p.region !== stampFilterRegion) return false;
      if (stampSearch.trim()) {
        const q = stampSearch.toLowerCase().trim();
        const matchTh = p.nameTh.includes(q);
        const matchEn = p.nameEn.toLowerCase().includes(q);
        if (!matchTh && !matchEn) return false;
      }
      return true;
    });
  }, [stampFilterRegion, stampSearch]);

  // เลือกแสตมป์เพื่อกำหนดเป็นจุดหมายปลายทาง
  const handleSelectStamp = (prov: Province) => {
    setSelectedDestination(prov);
    setIsStampModalOpen(false);

    if (!query.trim()) {
      setQuery(`ช่วยวางแผนเที่ยวจังหวัด${prov.nameTh} ขอไฮไลต์สถานที่ท่องเที่ยว อาหารเด็ด และที่พักแนะนำ`);
    } else if (!query.includes(prov.nameTh)) {
      setQuery((prev) => `${prev} (เน้นเที่ยวจังหวัด${prov.nameTh})`);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  // เงื่อนไขโหมด Guest Trail: ไม่ได้ล็อกอิน หรือ มีเครดิต <= 0
  const isGuestTrailMode = !authStatus.isAuthenticated || authStatus.aiCredits <= 0;
  const isOutOfTrialQuota = isGuestTrailMode && guestCredits <= 0 && (!authStatus.isAuthenticated || authStatus.aiCredits <= 0);

  const handleOpenModelMenu = (event: React.MouseEvent<HTMLElement>) => {
    setModelMenuAnchor(event.currentTarget);
  };

  const handleCloseModelMenu = (modelName?: string) => {
    if (modelName) setSelectedModel(modelName);
    setModelMenuAnchor(null);
  };

  // ส่งคำถาม AI
  const handleSend = async (customQuery?: string) => {
    const textToSend = (typeof customQuery === 'string' ? customQuery : query).trim();
    if (!textToSend || loading) return;

    // หากอยู่ในโหมด Guest และโควตาหมดแล้ว ให้แจ้งเตือนสมัครสมาชิก
    if (isOutOfTrialQuota) {
      setErrorMsg('คุณใช้สิทธิ์ทดลองถาม AI ฟรีครบแล้ว กรุณาสมัครสมาชิกหรือเข้าสู่ระบบเพื่อรับ 30 เครดิตทันที!');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const token = getToken();

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token && authStatus.isAuthenticated) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/ai/travel-advisor', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: textToSend,
          activeRegion: selectedDestination ? selectedDestination.region : 'all',
          targetProvince: selectedDestination ? selectedDestination.slug : undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูล');
      }

      // หักโควตา Guest ในกรณีไม่มี Token
      if (!token || !authStatus.isAuthenticated) {
        const nextQuota = Math.max(0, guestCredits - 1);
        setGuestCredits(nextQuota);
        if (typeof window !== 'undefined') {
          localStorage.setItem(GUEST_STORAGE_KEY, nextQuota.toString());
        }
      } else {
        // อัปเดตเครดิตของ User
        if (typeof data.creditsRemaining === 'number') {
          setAuthStatus((prev) => ({ ...prev, aiCredits: data.creditsRemaining }));
        }
      }

      const newConvo = {
        id: Date.now().toString(),
        query: textToSend,
        reply: data.reply,
        matchedProvinces: data.matchedProvinces || [],
        recommendedProducts: data.recommendedProducts || [],
        createdAt: new Date()
      };

      setConvoHistory((prev) => [newConvo, ...prev]);
      setQuery('');

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'ไม่สามารถติดต่อ AI ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      component="section"
      id="ai-travel-companion-section"
      sx={{
        py: { xs: 7, md: 9 },
        px: 2,
        bgcolor: '#ffffff',
        position: 'relative',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9'
      }}
    >
      <Container maxWidth="lg">
        {/* ==================================================================== */}
        {/* 1. Header Section: Badge + Title + Subtitle */}
        {/* ==================================================================== */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2.2,
              py: 0.7,
              borderRadius: 9999,
              bgcolor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#334155',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <ChatBubbleIcon size={16} />
            <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
              สนทนา
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.75rem' },
            color: '#0f172a',
            textAlign: 'center',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            mb: 1.5
          }}
        >
          เพื่อนวางแผนเที่ยว
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#64748b',
            textAlign: 'center',
            maxWidth: 620,
            mx: 'auto',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.65,
            mb: 3
          }}
        >
          ที่ปรึกษาการเดินทางส่วนตัวที่จะเปลี่ยนทุกทริปที่ยุ่งยากให้เป็นประสบการณ์ที่ราบรื่น ออกแบบแผนการเดินทางอย่างมืออาชีพครอบคลุมทุกไลฟ์สไตล์
        </Typography>

        {/* ==================================================================== */}
        {/* 2. Guest Trail Mode Badge (แสดงสถานะชัดเจนสำหรับ Guest) */}
        {/* ==================================================================== */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          {isGuestTrailMode ? (
            <Chip
              icon={<Box component="span" sx={{ fontSize: '1rem', pl: 0.5 }}>✨</Box>}
              label={
                !authStatus.isAuthenticated
                  ? `โหมดทดลองเที่ยวฟรี (Guest Trail: เชียงราย) • สิทธิ์ถาม AI คงเหลือ: ${guestCredits}/3 ครั้ง`
                  : `เครดิตของคุณหมดแล้ว (0 เครดิต) • ปลดล็อกโหมดทดลองเที่ยวเชียงรายฟรี!`
              }
              sx={{
                bgcolor: '#f0f9ff',
                borderColor: '#7dd3fc',
                color: '#0284c7',
                fontWeight: 700,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                py: 2,
                px: 1,
                border: '1px solid'
              }}
            />
          ) : (
            <Chip
              icon={<GeminiSparkleIcon size={16} />}
              label={`ยินดีต้อนรับ ${authStatus.userName || 'สมาชิก'} • เครดิต AI คงเหลือ: ${authStatus.aiCredits} เครดิต`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
          )}
        </Box>

        {/* ==================================================================== */}
        {/* 3. Signature Chat Input Box (Sky Blue Border) */}
        {/* ==================================================================== */}
        <Box
          sx={{
            maxWidth: 720,
            mx: 'auto',
            bgcolor: '#ffffff',
            border: '2px solid #38bdf8',
            borderRadius: '28px',
            p: { xs: 2, sm: 2.5 },
            boxShadow: '0 8px 32px rgba(56, 189, 248, 0.12)',
            transition: 'all 0.25s ease',
            mb: 1.5,
            '&:focus-within': {
              borderColor: '#0284c7',
              boxShadow: '0 12px 36px rgba(2, 132, 199, 0.2)'
            }
          }}
        >
          {/* Destination Badge from Stamp Selection */}
          {selectedDestination && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2, flexWrap: 'wrap' }}>
              <Chip
                icon={<MapPinIcon size={14} />}
                label={`จุดหมาย: ${selectedDestination.nameTh} (${selectedDestination.nameEn})`}
                onDelete={() => setSelectedDestination(null)}
                color="primary"
                size="small"
                sx={{
                  bgcolor: '#e0f2fe',
                  color: '#0284c7',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  border: '1px solid #7dd3fc',
                  '& .MuiChip-deleteIcon': { color: '#0284c7', '&:hover': { color: '#0369a1' } }
                }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.78rem' }}>
                แสตมป์{REGION_METAS[selectedDestination.region]?.labelTh} • คลิกปุ่ม (+) เพื่อเปลี่ยนจังหวัด
              </Typography>
            </Box>
          )}

          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            placeholder={
              isOutOfTrialQuota
                ? 'สิทธิ์ทดลองถามครบ 3 ครั้งแล้ว (สมัครสมาชิกเพื่อรับ 30 เครดิต หรือดูเมนูเส้นทางแนะนำ)'
                : selectedDestination
                  ? `พิมพ์คำถามเกี่ยวกับจังหวัด${selectedDestination.nameTh} เช่น ไฮไลต์ 2 วัน 1 คืน, ที่พัก, ของกิน`
                  : 'ถามได้เลย เช่น อยากไปจิบชาบนดอย หรือกดปุ่ม (+) เพื่อเลือกดูแสตมป์กำหนดจุดหมาย'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || isOutOfTrialQuota}
            sx={{
              '& .MuiOutlinedInput-root': {
                p: 0.5,
                fontSize: { xs: '1rem', md: '1.05rem' },
                color: '#1e293b',
                lineHeight: 1.5,
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' }
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#94a3b8',
                opacity: 1
              }
            }}
          />

          {/* Bottom Toolbar inside input */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1.5,
              pt: 1,
              borderTop: '1px solid #f8fafc'
            }}
          >
            <Stack direction="row" spacing={1.2} alignItems="center">
              {/* Plus Button: เรียกแสตมป์ 77 จังหวัด เพื่อกำหนดจุดหมาย */}
              <Tooltip title="เปิดดูแสตมป์พาสปอร์ต 77 จังหวัด เพื่อกำหนดจุดหมาย">
                <IconButton
                  onClick={() => setIsStampModalOpen(true)}
                  size="small"
                  aria-label="เลือกแสตมป์จุดหมายปลายทาง"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: selectedDestination ? '#e0f2fe' : '#f1f5f9',
                    color: selectedDestination ? '#0284c7' : '#475569',
                    border: selectedDestination ? '1.5px solid #38bdf8' : 'none',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: selectedDestination ? '#bae6fd' : '#e2e8f0' }
                  }}
                >
                  <PlusIcon size={16} />
                </IconButton>
              </Tooltip>

              {/* Model Dropdown Pill */}
              <Button
                onClick={handleOpenModelMenu}
                size="small"
                sx={{
                  bgcolor: '#f1f5f9',
                  color: '#334155',
                  borderRadius: 9999,
                  px: 1.8,
                  py: 0.6,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { bgcolor: '#e2e8f0' }
                }}
              >
                <GeminiSparkleIcon size={18} />
                <Typography component="span" sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                  {selectedModel}
                </Typography>
                <ChevronDownIcon size={13} />
              </Button>

              <Menu
                anchorEl={modelMenuAnchor}
                open={Boolean(modelMenuAnchor)}
                onClose={() => handleCloseModelMenu()}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                  paper: {
                    sx: { borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', mt: 1, p: 0.5 }
                  }
                }}
              >
                <MenuItem onClick={() => handleCloseModelMenu('Gemini 3.7 Flash')}>Gemini 3.7 Flash (แนะนำ)</MenuItem>
                <MenuItem onClick={() => handleCloseModelMenu('Gemini 3.8 Flash')}>Gemini 3.8 Flash (โมเดลใหม่)</MenuItem>
                <MenuItem onClick={() => handleCloseModelMenu('Gemini 2.5 Pro')}>Gemini 2.5 Pro (วิเคราะห์ลึก)</MenuItem>
              </Menu>
            </Stack>

            {/* Send Button */}
            <IconButton
              onClick={() => handleSend()}
              disabled={!query.trim() || loading || isOutOfTrialQuota}
              aria-label="ส่งข้อความ"
              sx={{
                width: 38,
                height: 38,
                bgcolor: query.trim() && !isOutOfTrialQuota ? '#0284c7' : '#f1f5f9',
                color: query.trim() && !isOutOfTrialQuota ? '#ffffff' : '#94a3b8',
                borderRadius: '50%',
                boxShadow: query.trim() ? '0 4px 14px rgba(2, 132, 199, 0.35)' : 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: query.trim() ? '#0369a1' : '#f1f5f9',
                  transform: 'scale(1.06)'
                }
              }}
            >
              {loading ? <CircularProgress size={18} color="inherit" /> : <SendPlaneIcon size={18} />}
            </IconButton>
          </Box>
        </Box>

        {/* Disclaimer */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '0.8rem',
            mb: 4
          }}
        >
          AI อาจผิดพลาดได้ หลีกเลี่ยงการใส่ข้อมูลส่วนตัวหรือความลับ
        </Typography>

        {/* ==================================================================== */}
        {/* 4. Chat Results & Conversation Area (Directly under input box) */}
        {/* ==================================================================== */}
        <div ref={resultsRef} />

        {errorMsg && (
          <Alert
            severity="error"
            onClose={() => setErrorMsg(null)}
            sx={{ maxWidth: 720, mx: 'auto', mb: 3, borderRadius: 3 }}
          >
            {errorMsg}
          </Alert>
        )}

        {loading && (
          <Card
            elevation={0}
            sx={{
              maxWidth: 720,
              mx: 'auto',
              p: 3,
              mb: 3,
              borderRadius: 4,
              border: '1px solid #bae6fd',
              bgcolor: '#f0f9ff',
              boxShadow: '0 4px 18px rgba(2, 132, 199, 0.08)'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={24} sx={{ color: '#0284c7' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GeminiSparkleIcon size={16} /> Go Thailand AI กำลังวิเคราะห์ข้อมูลและวางแผนให้คุณ...
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  กำลังค้นหาสถานที่ท่องเที่ยว วัฒนธรรมท้องถิ่น และข้อเสนอที่พักที่ตรงใจ
                </Typography>
              </Box>
            </Stack>
          </Card>
        )}

        {/* Placeholder ข้อความเล็กๆ เมื่อยังไม่มีการเริ่มสนทนา */}
        {convoHistory.length === 0 && !loading && (
          <Box
            sx={{
              maxWidth: 720,
              mx: 'auto',
              textAlign: 'center',
              py: 2,
              px: 2.5,
              bgcolor: '#f8fafc',
              borderRadius: 3,
              border: '1px dashed #cbd5e1',
              mb: 4
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <span>💡</span>
              <span>ยังไม่มีบทสนทนา — พิมพ์สถานที่หรือความต้องการท่องเที่ยวที่คุณอยากไป เช่น &ldquo;อยากไปจิบชาบนดอยเชียงราย&rdquo; หรือเลือกดูเส้นทางตัวอย่างในแท็บ &ldquo;เส้นทางแนะนำ&rdquo;</span>
            </Typography>
          </Box>
        )}

        {/* รายการผลลัพธ์บทสนทนา */}
        {convoHistory.length > 0 && (
          <Stack spacing={3} sx={{ maxWidth: 720, mx: 'auto', mb: 4 }}>
            {convoHistory.map((convo) => (
              <Card
                key={convo.id}
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  bgcolor: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: '#0284c7',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    คุณ
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                    {convo.query}
                  </Typography>
                </Box>

                <Box sx={{ pl: 2, borderLeft: '3px solid #38bdf8', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <GeminiSparkleIcon size={18} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0284c7' }}>
                      Go Thailand AI Copilot
                    </Typography>
                  </Box>
                  <Typography component="div" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: '0.95rem', color: '#334155' }}>
                    {convo.reply}
                  </Typography>
                </Box>

                {convo.matchedProvinces && convo.matchedProvinces.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
                      📍 จังหวัดที่แนะนำตรงตามความต้องการ:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {convo.matchedProvinces.map((prov: any) => (
                        <Chip
                          key={prov.slug}
                          label={`✨ ${prov.nameTh} (${prov.region})`}
                          onClick={() => router.push(`/accommodations?province=${prov.slug}`)}
                          clickable
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 700, borderRadius: 2 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {convo.recommendedProducts && convo.recommendedProducts.length > 0 && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
                      🛍️ แพ็กเกจทัวร์และที่พักที่เกี่ยวข้องในจังหวัดนี้:
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      {convo.recommendedProducts.map((prod: any, idx: number) => (
                        <Card
                          key={idx}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            borderColor: '#e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Chip label={prod.tag || 'ทัวร์'} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                              <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700 }}>
                                {prod.price.toLocaleString()} บาท
                              </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                              {prod.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {prod.description}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => router.push('/products')}
                            sx={{ mt: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', bgcolor: '#0284c7' }}
                          >
                            จองหรือดูรายละเอียด
                          </Button>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
              </Card>
            ))}
          </Stack>
        )}

        {/* ==================================================================== */}
        {/* 5. Paywall / Membership Hook เมื่อโควตาทดลองหมด */}
        {/* ==================================================================== */}
        {isOutOfTrialQuota && (
          <Fade in={isOutOfTrialQuota}>
            <Card
              sx={{
                maxWidth: 720,
                mx: 'auto',
                mb: 4,
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                bgcolor: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '2px solid #38bdf8',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.15)',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0369a1', mb: 1 }}>
                🎉 คุณใช้สิทธิ์ทดลองถาม AI ฟรีครบแล้ว!
              </Typography>
              <Typography variant="body2" sx={{ color: '#334155', mb: 2.5, maxWidth: 540, mx: 'auto' }}>
                สมัครสมาชิก Go Thailand วันนี้ <strong>รับฟรีทันที 30 เครดิต</strong> เพื่อปลดล็อก AI Travel Copilot วางแผนเที่ยวแบบไม่จำกัดครอบคลุมครบทั้ง 77 จังหวัด
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => router.push('/register')}
                  sx={{
                    bgcolor: '#0284c7',
                    fontWeight: 700,
                    borderRadius: 2.5,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#0369a1' }
                  }}
                >
                  สมัครสมาชิกรับ 30 เครดิตฟรี ✨
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/login')}
                  sx={{
                    borderColor: '#0284c7',
                    color: '#0284c7',
                    fontWeight: 700,
                    borderRadius: 2.5,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#f0f9ff' }
                  }}
                >
                  เข้าสู่ระบบ
                </Button>
              </Stack>
            </Card>
          </Fade>
        )}

        {/* ==================================================================== */}
        {/* 6. Stamp Selection Dialog (เลือกจุดหมายจากแสตมป์ 77 จังหวัด) */}
        {/* ==================================================================== */}
        <Dialog
          open={isStampModalOpen}
          onClose={() => setIsStampModalOpen(false)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: 4,
                p: { xs: 1.5, sm: 2.5 },
                maxHeight: '90vh'
              }
            }
          }}
        >
          <DialogTitle sx={{ p: 1.5, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip
                  label="PASSPORT STAMPS"
                  size="small"
                  sx={{ bgcolor: '#f0f9ff', color: '#0284c7', fontWeight: 800, fontSize: '0.72rem', height: 22 }}
                />
                {user && Array.isArray(user.visitedProvinces) && user.visitedProvinces.length > 0 && (
                  <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                    ✨ คุณสะสมแล้ว {user.visitedProvinces.length}/77 จังหวัด
                  </Typography>
                )}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                🗺️ เลือกจุดหมายจากแสตมป์พาสปอร์ต 77 จังหวัด
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mt: 0.3 }}>
                คลิกแสตมป์จังหวัดที่คุณอยากไป เพื่อกำหนดจุดหมายปลายทางให้ AI ช่วยวางแผนทริป
              </Typography>
            </Box>
            <IconButton
              onClick={() => setIsStampModalOpen(false)}
              size="small"
              sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a' } }}
            >
              <CloseIcon size={20} />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 1.5, pt: 0 }}>
            {/* Search & Region Filter Bar */}
            <Stack spacing={1.5} sx={{ mb: 2.5, mt: 0.5 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="ค้นหาชื่อจังหวัด (เช่น เชียงใหม่, ภูเก็ต, น่าน, ชลบุรี, กระบี่)..."
                value={stampSearch}
                onChange={(e) => setStampSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon size={16} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: '#f8fafc', fontSize: '0.9rem' }
                  }
                }}
              />

              {/* Region Filter Chips */}
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`ทั้งหมด (${THAILAND_PROVINCES.length})`}
                  onClick={() => setStampFilterRegion('all')}
                  variant={stampFilterRegion === 'all' ? 'filled' : 'outlined'}
                  color={stampFilterRegion === 'all' ? 'primary' : 'default'}
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                />
                {(Object.keys(REGION_METAS) as RegionKey[]).map((rKey) => {
                  const meta = REGION_METAS[rKey];
                  const count = THAILAND_PROVINCES.filter((p) => p.region === rKey).length;
                  const isSelected = stampFilterRegion === rKey;
                  return (
                    <Chip
                      key={rKey}
                      label={`${meta.labelTh} (${count})`}
                      onClick={() => setStampFilterRegion(rKey)}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        bgcolor: isSelected ? meta.color : '#f8fafc',
                        color: isSelected ? '#ffffff' : '#475569',
                        borderColor: isSelected ? meta.color : '#e2e8f0',
                        border: '1px solid',
                        '&:hover': {
                          bgcolor: isSelected ? meta.color : meta.bgLight
                        }
                      }}
                    />
                  );
                })}
              </Stack>
            </Stack>

            {/* Stamps Grid */}
            {filteredStamps.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#f8fafc', borderRadius: 3 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  ไม่พบแสตมป์จังหวัดที่ค้นหา &ldquo;{stampSearch}&rdquo;
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)'
                  },
                  gap: 2,
                  justifyItems: 'center',
                  maxHeight: { xs: 380, sm: 480 },
                  overflowY: 'auto',
                  pr: 0.5,
                  py: 1
                }}
              >
                {filteredStamps.map((prov) => {
                  const isSelected = selectedDestination?.id === prov.id;
                  const visited = isProvinceVisited(prov);
                  return (
                    <Box
                      key={prov.id}
                      sx={{
                        position: 'relative',
                        borderRadius: 3,
                        p: 0.8,
                        transition: 'all 0.2s ease',
                        border: isSelected ? '2px solid #0284c7' : '2px solid transparent',
                        bgcolor: isSelected ? '#f0f9ff' : 'transparent',
                        '&:hover': {
                          transform: 'scale(1.03)'
                        }
                      }}
                    >
                      <ProvincePostageStamp
                        province={prov}
                        isVisited={visited}
                        size="small"
                        onClick={() => handleSelectStamp(prov)}
                      />
                      {isSelected && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            bgcolor: '#0284c7',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: 22,
                            height: 22,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)'
                          }}
                        >
                          ✓
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
