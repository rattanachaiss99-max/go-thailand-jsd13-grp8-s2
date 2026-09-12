'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import ThailandInteractiveMap from '@/components/maps/ThailandInteractiveMap';
import PassportStampAlbum from '@/components/profile/PassportStampAlbum';
import { useUser } from '@/contexts/UserContext';
import { THAILAND_PROVINCES, Province, getProvinceByIdOrSlug } from '@/data/thailandProvinces';
import {
  fetchUserBookings,
  completeBookingRequest,
  simulateCompletedTrip,
  BookingData
} from '@/services/bookingService';

interface Trophy {
  id: string;
  icon: string;
  title: string;
  description: string;
  requirement: string;
  isUnlocked: boolean;
  current: number;
  total: number;
  color: string;
}

export default function TravelTrophyPassport() {
  const { user, token, updateProfile } = useUser();
  const [visited, setVisited] = useState<string[]>(user?.visitedProvinces || []);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookings state from MongoDB Atlas
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [selectedSimProvince, setSelectedSimProvince] = useState<string>('chiang-rai');

  // Load bookings from MongoDB on mount
  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await fetchUserBookings(token);
      setBookings(data);

      // รวบรวมจังหวัดจากการจองที่ completed ทั้งหมด
      const completedProvs = Array.from(
        new Set(
          data
            .filter((b) => b.bookingStatus === 'completed')
            .map((b) => getProvinceByIdOrSlug(b.province || b.item?.province || '')?.slug || b.province)
            .filter(Boolean)
        )
      );

      // ผสานกับ visitedProvinces ที่มีอยู่
      if (completedProvs.length > 0) {
        setVisited((prev) => Array.from(new Set([...prev, ...completedProvs])));
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [token]);

  // Sync state if user data refreshes
  useEffect(() => {
    if (user?.visitedProvinces && user.visitedProvinces.length > 0) {
      setVisited((prev) => Array.from(new Set([...prev, ...user.visitedProvinces!])));
    }
  }, [user?.visitedProvinces]);

  const visitedCount = visited.length;
  const percentCompleted = Math.min(100, Math.round((visitedCount / 77) * 100));

  // Completed & Pending Bookings
  const completedBookings = useMemo(() => {
    return bookings.filter((b) => b.bookingStatus === 'completed');
  }, [bookings]);

  const pendingOrConfirmedBookings = useMemo(() => {
    return bookings.filter((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending');
  }, [bookings]);

  // คำนวณเลเวลและฉายาของนักเดินทาง
  const travelerRank = useMemo(() => {
    if (visitedCount >= 77) return { title: '👑 ตำนานยอดนักเที่ยวไทย (Legend)', color: '#eab308' };
    if (visitedCount >= 50) return { title: '🌟 จอมยุทธ์เที่ยวไทย (Thailand Veteran)', color: '#9333ea' };
    if (visitedCount >= 20) return { title: '🧭 นักผจญภัยไทยแลนด์ (Adventurer)', color: '#2563eb' };
    if (visitedCount >= 10) return { title: '🎒 นักเดินทางตัวยง (Pathfinder)', color: '#0284c7' };
    if (visitedCount >= 3) return { title: '🌲 นักสำรวจ (Explorer)', color: '#16a34a' };
    if (visitedCount >= 1) return { title: '🌱 นักเดินทางมือใหม่ (Rookie Traveler)', color: '#d97706' };
    return { title: '🗺️ ผู้เริ่มต้นการเดินทาง (New Adventurer)', color: '#64748b' };
  }, [visitedCount]);

  // สถิติตามรายภาค
  const regionStats = useMemo(() => {
    const stats: Record<string, { visited: number; total: number }> = {
      north: { visited: 0, total: 9 },
      isan: { visited: 0, total: 20 },
      central: { visited: 0, total: 22 },
      east: { visited: 0, total: 7 },
      west: { visited: 0, total: 5 },
      south: { visited: 0, total: 14 }
    };

    visited.forEach((id) => {
      const p = getProvinceByIdOrSlug(id);
      if (p && stats[p.region]) {
        stats[p.region].visited += 1;
      }
    });

    return stats;
  }, [visited]);

  // คำนวณสถานะถ้วยรางวัล (Trophies)
  const trophies: Trophy[] = useMemo(() => {
    return [
      {
        id: 'first-step',
        icon: '🥉',
        title: 'ก้าวแรกสู่ไทย',
        description: 'บันทึกการเดินทางครั้งแรกสำเร็จผ่านการจอง',
        requirement: 'พิชิตทริปสำเร็จครบ 1 จังหวัด',
        isUnlocked: visitedCount >= 1,
        current: Math.min(1, visitedCount),
        total: 1,
        color: '#cd7f32'
      },
      {
        id: 'northern-master',
        icon: '🌲',
        title: 'พิชิตล้านนา',
        description: 'เที่ยวครบทั้ง 9 จังหวัดของภาคเหนือ',
        requirement: 'จบการเดินทางภาคเหนือครบ 9 จังหวัด',
        isUnlocked: regionStats.north.visited >= 9,
        current: regionStats.north.visited,
        total: 9,
        color: '#0284c7'
      },
      {
        id: 'isan-explorer',
        icon: '🌾',
        title: 'มนต์เสน่ห์แดนอีสาน',
        description: 'เดินทางท่องเที่ยวภาคตะวันออกเฉียงเหนือ',
        requirement: 'จบการเดินทางอีสานครบ 5 จังหวัด',
        isUnlocked: regionStats.isan.visited >= 5,
        current: Math.min(5, regionStats.isan.visited),
        total: 5,
        color: '#f59e0b'
      },
      {
        id: 'southern-seas',
        icon: '🌊',
        title: 'ผู้พิชิตด้ามขวานทอง',
        description: 'ท่องเที่ยวทะเลและธรรมชาติแดนใต้',
        requirement: 'จบการเดินทางภาคใต้ครบ 5 จังหวัด',
        isUnlocked: regionStats.south.visited >= 5,
        current: Math.min(5, regionStats.south.visited),
        total: 5,
        color: '#06b6d4'
      },
      {
        id: 'adventurer-20',
        icon: '🧭',
        title: 'นักผจญภัยไทยแลนด์',
        description: 'เดินทางท่องเที่ยวทั่วไทยมากกว่า 20 จังหวัด',
        requirement: 'จบการเดินทางสะสมครบ 20 จังหวัด',
        isUnlocked: visitedCount >= 20,
        current: Math.min(20, visitedCount),
        total: 20,
        color: '#9333ea'
      },
      {
        id: 'grandmaster-77',
        icon: '👑',
        title: 'ตำนานยอดนักเที่ยวไทย',
        description: 'สุดยอดนักเดินทางที่พิชิตครบทุก 77 จังหวัดทั่วไทย',
        requirement: 'จบการเดินทางครบ 77 จังหวัด',
        isUnlocked: visitedCount >= 77,
        current: visitedCount,
        total: 77,
        color: '#eab308'
      }
    ];
  }, [visitedCount, regionStats]);

  // ฟังก์ชันยืนยันการสิ้นสุดทริปเพื่อปลดล็อกตราประทับ
  const handleCompleteBooking = async (bookingId: string) => {
    setActionLoading(true);
    try {
      const res = await completeBookingRequest(bookingId, token);
      if (res.success) {
        setToastMessage(`🎉 สิ้นสุดทริปสำเร็จ! ปลดล็อกแสตมป์จังหวัด ${res.unlockedProvince} เรียบร้อยแล้ว (+100 pt)`);
        await loadBookings();
        if (res.visitedProvinces) {
          setVisited(res.visitedProvinces);
        }
      } else {
        setToastMessage(`เกิดข้อผิดพลาด: ${res.error}`);
      }
    } catch (err: any) {
      setToastMessage(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // ฟังก์ชันจำลองการจองและพิชิตทริปใหม่ลง MongoDB Atlas ทันที
  const handleSimulateNewTrip = async (province: Province) => {
    setActionLoading(true);
    try {
      const res = await simulateCompletedTrip(province.slug, province.nameTh, token);
      if (res.success) {
        setToastMessage(`🎉 ยืนยันการจองและพิชิตทริป ${province.nameTh} สำเร็จ! บันทึกลง MongoDB เรียบร้อย`);
        await loadBookings();
        const nextList = Array.from(new Set([...visited, province.slug, province.id]));
        setVisited(nextList);
      } else {
        setToastMessage(`เกิดข้อผิดพลาด: ${res.error}`);
      }
    } catch (err: any) {
      setToastMessage(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 1. Header Card: สถิติพาสปอร์ต & ฉายา */}
      <Card
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Chip
                label="GO THAILAND PASSPORT"
                size="small"
                sx={{
                  bgcolor: 'rgba(212, 175, 55, 0.2)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  fontWeight: 700,
                  letterSpacing: 1
                }}
              />
              <Chip
                label={travelerRank.title}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: travelerRank.color,
                  fontWeight: 700
                }}
              />
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#ffffff' }}>
              พาสปอร์ตนักเดินทาง 77 จังหวัด
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
              ปลดล็อกดวงแสตมป์ ตราประทับ และเหรียญรางวัลเกียรติยศ <strong>จากการจองทริปที่สำเร็จจริงเท่านั้น</strong> ผ่าน MongoDB Shared Services
            </Typography>

            {/* แถบ Progress ความคืบหน้า */}
            <Box sx={{ width: '100%', mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                  พิชิตแล้ว {visitedCount} จาก 77 จังหวัด
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {percentCompleted}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentCompleted}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#10b981',
                    borderRadius: 5,
                    backgroundImage: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                  }
                }}
              />
            </Box>
          </Grid>

          {/* สถิติ 6 ภาค */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 3,
                p: 2.5,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#cbd5e1', fontWeight: 700 }}>
                📊 สถิติการเดินทางตามภูมิภาค (จากการจอง)
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>🌲 ภาคเหนือ</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#38bdf8' }}>
                    {regionStats.north.visited} / {regionStats.north.total} จว.
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>🌾 ภาคอีสาน</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#fbbf24' }}>
                    {regionStats.isan.visited} / {regionStats.isan.total} จว.
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>🏛️ ภาคกลาง</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#4ade80' }}>
                    {regionStats.central.visited} / {regionStats.central.total} จว.
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>🌊 ภาคใต้</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#22d3ee' }}>
                    {regionStats.south.visited} / {regionStats.south.total} จว.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* 2. ส่วนแสดงเหรียญรางวัลและโทรฟี่ (Travel Trophies) */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            🏆 เหรียญรางวัลนักเดินทาง (Travel Trophies)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            พิชิตเป้าหมายการเดินทางในแต่ละภูมิภาคเพื่อปลดล็อกเหรียญตราเกียรติยศ
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {trophies.map((trophy) => (
            <Grid key={trophy.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: trophy.isUnlocked ? trophy.color : 'grey.200',
                  bgcolor: trophy.isUnlocked ? '#ffffff' : 'grey.50',
                  boxShadow: trophy.isUnlocked ? `0 8px 24px ${trophy.color}20` : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      bgcolor: trophy.isUnlocked ? `${trophy.color}15` : 'grey.200',
                      border: trophy.isUnlocked ? `1px solid ${trophy.color}40` : 'none',
                      flexShrink: 0
                    }}
                  >
                    {trophy.icon}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {trophy.title}
                      </Typography>
                      {trophy.isUnlocked ? (
                        <Chip label="ปลดล็อกแล้ว" size="small" color="success" sx={{ fontSize: '0.65rem', height: 20 }} />
                      ) : (
                        <Chip label="ยังไม่ได้รับ" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                      )}
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                      {trophy.description}
                    </Typography>

                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          ความคืบหน้า ({trophy.requirement})
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {trophy.current} / {trophy.total}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (trophy.current / trophy.total) * 100)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: trophy.color,
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 3. ประวัติการจองและเครื่องมือทดสอบ MongoDB Shared Service */}
      <Box sx={{ mb: 4 }}>
        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'grey.200',
            bgcolor: '#ffffff'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                📦 ประวัติการจองในระบบ MongoDB ที่ปลดล็อกตราประทับ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ตราประทับและจังหวัดที่เคยไปจะถูกบันทึกเมื่อการจองมีสถานะ <strong>completed</strong> (สิ้นสุดการเดินทาง)
              </Typography>
            </Box>

            {loadingBookings && <CircularProgress size={20} />}
          </Box>

          {/* รายการจองที่เสร็จสิ้นแล้ว */}
          {completedBookings.length > 0 ? (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, mb: 2.5 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>รหัสการจอง</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>รายการทัวร์ / ที่พัก</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>จังหวัดที่ปลดล็อก</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>สถานะ</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">แต้มที่ได้รับ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedBookings.map((b) => (
                    <TableRow key={b._id}>
                      <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {b.bookingReference}
                      </TableCell>
                      <TableCell>{b.item.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={`📍 ${getProvinceByIdOrSlug(b.province)?.nameTh || b.province}`}
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label="✓ สิ้นสุดทริปแล้ว (Completed)" size="small" color="success" sx={{ fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#d97706' }}>
                        +100 pt
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
              ยังไม่พบการจองที่เสร็จสิ้นสมบูรณ์ในระบบ MongoDB
            </Alert>
          )}

          {/* รายการจองที่อยู่ระหว่างรอการเดินทาง (Confirmed/Pending) */}
          {pendingOrConfirmedBookings.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0369a1' }}>
                ⏳ ทริปที่ยืนยันแล้ว รอสิ้นสุดการเดินทาง ({pendingOrConfirmedBookings.length} รายการ)
              </Typography>
              <Stack spacing={1}>
                {pendingOrConfirmedBookings.map((b) => (
                  <Box
                    key={b._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      bgcolor: '#f0f9ff',
                      borderRadius: 2,
                      border: '1px solid #bae6fd'
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {b.bookingReference} — {b.item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        จังหวัด: {getProvinceByIdOrSlug(b.province)?.nameTh || b.province} • สถานะ: {b.bookingStatus}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={actionLoading}
                      onClick={() => handleCompleteBooking(b._id)}
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    >
                      ✓ ยืนยันสิ้นสุดทริป & ปลดล็อกแสตมป์
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* แถบทดสอบระบบ Shared Service สำหรับเพื่อนร่วมทีมและกรรมการ */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: '#fafafa',
              border: '1px dashed #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                🧪 เครื่องมือทดสอบ MongoDB Shared Service
              </Typography>
              <Typography variant="caption" color="text.secondary">
                จำลองการจองและสิ้นสุดการเดินทาง (Create Completed Booking) เพื่อทดสอบการปลดล็อกพาสปอร์ตทันที
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                select
                size="small"
                value={selectedSimProvince}
                onChange={(e) => setSelectedSimProvince(e.target.value)}
                sx={{ minWidth: 160, bgcolor: '#ffffff' }}
              >
                {THAILAND_PROVINCES.slice(0, 15).map((p) => (
                  <MenuItem key={p.id} value={p.slug}>
                    {p.nameTh} ({p.nameEn})
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                disabled={actionLoading}
                onClick={() => {
                  const targetProv = THAILAND_PROVINCES.find((p) => p.slug === selectedSimProvince);
                  if (targetProv) handleSimulateNewTrip(targetProv);
                }}
                sx={{ fontWeight: 700, borderRadius: 2, whiteSpace: 'nowrap' }}
              >
                {actionLoading ? 'กำลังบันทึก...' : '🚀 จำลองจองและจบพิชิตทริป'}
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>

      {/* 4. ส่วนแผนที่ Interactive 77 จังหวัด */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            🗺️ แผนที่พาสปอร์ตการเดินทาง 77 จังหวัด
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ดูสถานะการปลดล็อกตราประทับในแต่ละจังหวัดจากการเดินทางที่บันทึกในฐานข้อมูล MongoDB
          </Typography>
        </Box>

        <ThailandInteractiveMap
          visitedProvinceIds={visited}
          onToggleVisited={(province) => handleSimulateNewTrip(province)}
        />
      </Box>

      {/* 5. สมุดสะสมแสตมป์ประจำแต่ละจังหวัด (Collectible Stamp Album) */}
      <Box sx={{ mb: 4 }}>
        <PassportStampAlbum
          visitedProvinceIds={visited}
          completedBookings={completedBookings}
          onSimulateTrip={(province) => handleSimulateNewTrip(province)}
        />
      </Box>

      {/* 6. รายการจังหวัดที่เคยไปแล้ว (Visited List Tags) */}
      {visitedCount > 0 && (
        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'grey.200',
            bgcolor: '#ffffff'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            📍 รายชื่อจังหวัดที่คุณประทับตราแล้ว ({visitedCount} จังหวัด)
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {visited.map((id) => {
              const p = getProvinceByIdOrSlug(id);
              if (!p) return null;
              return (
                <Chip
                  key={p.id}
                  label={`✓ ${p.nameTh}`}
                  sx={{
                    bgcolor: '#dcfce7',
                    color: '#15803d',
                    fontWeight: 600,
                    borderRadius: 2,
                    border: '1px solid #86efac'
                  }}
                />
              );
            })}
          </Box>
        </Card>
      )}

      {/* Toast แจ้งเตือน */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3500}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
