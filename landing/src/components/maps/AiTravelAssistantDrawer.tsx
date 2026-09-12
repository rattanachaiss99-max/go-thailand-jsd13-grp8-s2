'use client';

import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { Province, getProvinceByIdOrSlug } from '@/data/thailandProvinces';
import { getToken } from '@/services/authService';

function SparkleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
    </svg>
  );
}

function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function SendIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  matchedProvinces?: Array<{
    slug: string;
    provinceId: string;
    nameTh: string;
    nameEn: string;
    region: string;
    highlights: string[];
    unseenGems: string[];
    signatureFood: string[];
    bestMonths: string[];
  }>;
  createdAt: Date;
}

interface AiTravelAssistantDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectProvince: (province: Province) => void;
  activeRegion?: string;
  currentSelectedProvince?: Province;
}

const SAMPLE_PROMPTS = [
  '🌊 ทะเลสวยน้ำใส ดำน้ำดูปะการัง',
  '⛰️ ธรรมชาติทะเลหมอก สโลว์ไลฟ์',
  '🍲 สายกิน ตะลุยของอร่อยมิชลิน',
  '🧘 สายมูเตลู ไหว้พระริมน้ำ',
  '🚗 ทริปครอบครัว ขับรถใกล้กรุงเทพฯ'
];

export default function AiTravelAssistantDrawer({
  open,
  onClose,
  onSelectProvince,
  activeRegion,
  currentSelectedProvince
}: AiTravelAssistantDrawerProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [userStatus, setUserStatus] = useState<{
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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `สวัสดีครับ! ผมคือ **Go Thailand AI Travel Copilot** 🇹🇭✨\n\nพร้อมช่วยคุณค้นหาทริปท่องเที่ยว 77 จังหวัดทั่วไทยตามไลฟ์สไตล์ หรือวางแผนท่องเที่ยวเชิงลึก\n\nลองเลือกคำถามแนะนำด้านล่าง หรือพิมพ์บอกสิ่งที่คุณอยากเที่ยวได้เลยครับ!`,
      createdAt: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkAccessStatus = async () => {
    const token = getToken();
    if (!token) {
      setUserStatus({
        isAuthenticated: false,
        canAccessAi: false,
        aiCredits: 0,
        userName: ''
      });
      setAuthChecking(false);
      return;
    }

    try {
      setAuthChecking(true);
      const res = await fetch('/api/ai/travel-advisor/status', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.isAuthenticated && data.user) {
        setUserStatus({
          isAuthenticated: true,
          canAccessAi: Boolean(data.user.canAccessAi),
          aiCredits: typeof data.user.aiCredits === 'number' ? data.user.aiCredits : 0,
          userName: data.user.name || data.user.email
        });
      } else {
        setUserStatus({
          isAuthenticated: false,
          canAccessAi: false,
          aiCredits: 0,
          userName: ''
        });
      }
    } catch (e) {
      console.warn('Failed to check AI status:', e);
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    if (open) {
      checkAccessStatus();
      scrollToBottom();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const token = getToken();
    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '🔒 กรุณาเข้าสู่ระบบก่อนใช้งาน Go Thailand AI Copilot ครับ',
          createdAt: new Date()
        }
      ]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      createdAt: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/travel-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          query: textToSend.trim(),
          activeRegion
        })
      });

      const data = await res.json();

      if (data.success) {
        if (typeof data.creditsRemaining === 'number') {
          setUserStatus((prev) => ({ ...prev, aiCredits: data.creditsRemaining }));
        }
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply,
          matchedProvinces: data.matchedProvinces || [],
          createdAt: new Date()
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: data.error || 'ขออภัยครับ ระบบประมวลผลขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้งครับ',
            createdAt: new Date()
          }
        ]);
        if (
          data.code === 'FORBIDDEN_AI_ACCESS' ||
          data.code === 'INSUFFICIENT_CREDITS' ||
          data.code === 'UNAUTHORIZED'
        ) {
          checkAccessStatus();
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'ไม่สามารถเชื่อมต่อกับบริการ AI ได้ในขณะนี้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตครับ',
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceCardClick = (slug: string) => {
    const province = getProvinceByIdOrSlug(slug);
    if (province) {
      onSelectProvince(province);
      onClose(); // ปิด Drawer เพื่อให้ผู้ใช้เห็นแผนที่ซูมไปยังจังหวัดนั้น
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 460 },
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#f8fafc'
        }
      }}
    >
      {/* 1. Header */}
      <Box
        sx={{
          p: 2.5,
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
            }}
          >
            <SparkleIcon size={22} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: 'text.primary' }}>
                AI Travel Copilot
              </Typography>
              {authChecking ? (
                <CircularProgress size={14} sx={{ color: 'primary.main' }} />
              ) : !userStatus.isAuthenticated ? (
                <Chip
                  size="small"
                  label="🔒 สมาชิกเท่านั้น"
                  sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: '#f1f5f9', color: 'text.secondary' }}
                />
              ) : !userStatus.canAccessAi ? (
                <Chip
                  size="small"
                  label="🔒 รอเปิดสิทธิ์ใน DB"
                  color="warning"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                />
              ) : (
                <Chip
                  size="small"
                  label={`🌟 สิทธิ์ AI: ${userStatus.aiCredits} ครั้ง`}
                  color="success"
                  variant="filled"
                  sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                />
              )}
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
              MongoDB RAG & Gemini
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 2. Messages List */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <Card
                sx={{
                  maxWidth: '92%',
                  p: 2,
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  bgcolor: isUser ? 'primary.main' : '#ffffff',
                  color: isUser ? '#ffffff' : 'text.primary',
                  boxShadow: isUser ? '0 4px 14px rgba(2, 132, 199, 0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
                  border: isUser ? 'none' : '1px solid #e2e8f0'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-line',
                    lineHeight: 1.6,
                    fontSize: '0.9rem',
                    '& strong': { fontWeight: 700 }
                  }}
                >
                  {msg.text}
                </Typography>

                {/* แสดงการ์ดจังหวัดที่ AI แนะนำ */}
                {!isUser && msg.matchedProvinces && msg.matchedProvinces.length > 0 && (
                  <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed #e2e8f0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#0284c7', mb: 1, display: 'block' }}>
                      📍 คลิกเพื่อดูบนแผนที่และส่องดวงแสตมป์:
                    </Typography>
                    <Stack spacing={1}>
                      {msg.matchedProvinces.map((prov) => (
                        <Card
                          key={prov.slug}
                          onClick={() => handleProvinceCardClick(prov.slug)}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: '#f0f9ff',
                              borderColor: '#38bdf8',
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                              จังหวัด{prov.nameTh} ({prov.nameEn})
                            </Typography>
                            <Chip
                              size="small"
                              label="ส่องดูบนแผนที่"
                              icon={<Box component="span" sx={{ fontSize: '0.85rem' }}>📍</Box>}
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 22, fontWeight: 700 }}
                            />
                          </Box>
                          {prov.highlights.length > 0 && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Box component="span" sx={{ fontSize: '0.85rem' }}>🧭</Box>
                              {prov.highlights.slice(0, 2).join(' • ')}
                            </Typography>
                          )}
                          {prov.signatureFood.length > 0 && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Box component="span" sx={{ fontSize: '0.85rem' }}>🍲</Box>
                              {prov.signatureFood.slice(0, 2).join(' • ')}
                            </Typography>
                          )}
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Card>
            </Box>
          );
        })}

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
            <CircularProgress size={20} color="primary" />
            <Typography variant="caption" color="text.secondary">
              Go Thailand AI กำลังค้นหาข้อมูลท่องเที่ยวจาก MongoDB...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* 3. Access Gating & Input Box Section */}
      {authChecking ? (
        <Box sx={{ p: 3, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
          <CircularProgress size={18} color="primary" />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            กำลังตรวจสอบสิทธิ์การใช้งาน AI จากระบบ...
          </Typography>
        </Box>
      ) : !userStatus.isAuthenticated ? (
        <Box sx={{ p: 3, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Box sx={{ fontSize: '2rem', mb: 0.5 }}>🔒</Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            เฉพาะสมาชิกที่ได้รับสิทธิ์เท่านั้น
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2, px: 2 }}>
            ฟังก์ชัน AI Travel Copilot สงวนสิทธิ์สำหรับสมาชิก Go Thailand กรุณาเข้าสู่ระบบก่อนใช้งาน
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            href="/login"
            sx={{
              borderRadius: 2.5,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
            }}
          >
            เข้าสู่ระบบ (Sign In)
          </Button>
        </Box>
      ) : !userStatus.canAccessAi ? (
        <Box sx={{ p: 3, bgcolor: '#fffbeb', borderTop: '1px solid #fde68a', textAlign: 'center' }}>
          <Box sx={{ fontSize: '2rem', mb: 0.5 }}>🛡️</Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e', mb: 0.5 }}>
            บัญชีของคุณยังไม่ได้รับสิทธิ์ใช้งาน AI Travel
          </Typography>
          <Typography variant="caption" sx={{ color: '#b45309', display: 'block', mb: 1.5, px: 1 }}>
            สวัสดีคุณ <strong>{userStatus.userName}</strong> สิทธิ์การใช้งาน AI Copilot ต้องได้รับการเปิดสิทธิ์จากฐานข้อมูล (Database) โดยผู้ดูแลระบบ
          </Typography>
          <Chip
            size="small"
            label="สถานะ: รอดำเนินการเปิดสิทธิ์ใน DB"
            color="warning"
            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
          />
        </Box>
      ) : userStatus.aiCredits <= 0 ? (
        <Box sx={{ p: 3, bgcolor: '#fef2f2', borderTop: '1px solid #fecaca', textAlign: 'center' }}>
          <Box sx={{ fontSize: '2rem', mb: 0.5 }}>🪙</Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#991b1b', mb: 0.5 }}>
            โควต้าเครดิต AI ของคุณหมดแล้ว (0 ครั้ง)
          </Typography>
          <Typography variant="caption" sx={{ color: '#b91c1c', display: 'block' }}>
            กรุณาติดต่อผู้ดูแลระบบเพื่อเติมเครดิตการใช้งาน Go Thailand AI Copilot เพิ่มเติมครับ
          </Typography>
        </Box>
      ) : (
        <>
          {/* Sample Prompts Carousel */}
          <Box sx={{ px: 2, py: 1, bgcolor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.75, display: 'block' }}>
              💡 คำถามแนะนำ:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 0.75,
                overflowX: 'auto',
                pb: 0.5,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
              }}
            >
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <Chip
                  key={idx}
                  label={prompt}
                  size="small"
                  clickable
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  sx={{
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#e0f2fe', borderColor: '#38bdf8' }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Input Box */}
          <Box sx={{ p: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="ถาม AI ได้ทุกเรื่องเที่ยวไทย (เช่น ทริปทะเลหน้าหนาว, อาหารพื้นเมือง)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleSend()}
                      disabled={loading || !inputQuery.trim()}
                      color="primary"
                      edge="end"
                    >
                      <SendIcon size={18} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: '#f8fafc' }
              }}
            />
          </Box>
        </>
      )}
    </Drawer>
  );
}
