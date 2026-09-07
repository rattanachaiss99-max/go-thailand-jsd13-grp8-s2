'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/navigation';
import { Guide } from '@/data/guides';
import GuideAvatar from './GuideAvatar';
import AvailabilityCalendar from './AvailabilityCalendar';

function StarRating({ rating }: { rating: number }) {
  return (
    <Box sx={{ display: 'flex', gap: '2px', my: 0.5 }} aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(function (star) {
        return (
          <Typography
            key={star}
            component="span"
            sx={{
              fontSize: '14px',
              lineHeight: 1,
              color: star <= rating ? '#f2b429' : '#cbd5e1'
            }}
          >
            ★
          </Typography>
        );
      })}
    </Box>
  );
}

interface GuideCardProps {
  guide: Guide;
}

export default function GuideCard({ guide }: GuideCardProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (day: number, month: number, year: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    setSelectedDate(`${day} ${monthNames[month]} ${year}`);
    setOpenModal(true);
  };

  const handleBooking = () => {
    // Navigate to checkout or cart
    setOpenModal(false);
    router.push('/checkout');
  };

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          borderRadius: '16px',
          border: '2px solid transparent',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          p: 2,
          pb: 3,
          bgcolor: '#ffffff',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: '#f2b429',
            boxShadow: '0 8px 24px rgba(242,180,41,0.2)',
            transform: 'translateY(-3px)'
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Left: Guide Avatar */}
          <Box
            sx={{
              width: '36%',
              flexShrink: 0,
              height: 175,
              borderRadius: '12px',
              overflow: 'hidden',
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}
          >
            <GuideAvatar avatar={guide.avatar} name={guide.name} />
          </Box>

          {/* Right: Info + Calendar */}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'var(--font-display, serif)',
                fontWeight: 700,
                color: '#082340',
                fontSize: '1.1rem',
                lineHeight: 1.2
              }}
            >
              {guide.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.75rem',
                lineHeight: 1.3,
                mt: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {guide.description}
            </Typography>

            <StarRating rating={guide.rating} />

            <AvailabilityCalendar
              guideId={guide.id}
              guideName={guide.name}
              onSelectDate={handleDateSelect}
            />
          </Box>
        </Box>

        {/* Bottom overlapping pill button */}
        <Button
          onClick={() => setOpenModal(true)}
          sx={{
            position: 'absolute',
            bottom: -14,
            left: 18,
            bgcolor: '#082340',
            color: '#ffffff',
            borderRadius: '9999px',
            px: 2.5,
            py: 0.5,
            fontSize: '0.75rem',
            fontWeight: 700,
            boxShadow: '0 4px 10px rgba(8,35,64,0.3)',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#1c2f7d',
              boxShadow: '0 6px 14px rgba(8,35,64,0.4)'
            },
            '&:active': {
              transform: 'scale(0.96)',
              bgcolor: '#f2b429',
              color: '#082340'
            }
          }}
        >
          More information &rsaquo;
        </Button>
      </Card>

      {/* Guide Detail Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px', p: 1 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 56, height: 64, borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
              <GuideAvatar avatar={guide.avatar} name={guide.name} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#082340', lineHeight: 1.2 }}>
                {guide.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {guide.location} • {guide.specialty}
              </Typography>
              <StarRating rating={guide.rating} />
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ color: '#334155', mb: 2 }}>
            {guide.description}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
            ภาษาที่สื่อสารได้:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {guide.languages.map(function (lang) {
              return (
                <Chip
                  key={lang}
                  label={lang}
                  size="small"
                  sx={{ bgcolor: '#f1f5f9', color: '#082340', fontWeight: 600 }}
                />
              );
            })}
          </Stack>

          <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                อัตราค่าบริการ:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#082340' }}>
                ฿{guide.pricePerDay.toLocaleString()} <Typography component="span" variant="caption" sx={{ color: '#64748b' }}>/ วัน</Typography>
              </Typography>
            </Stack>
            {selectedDate && (
              <Typography variant="caption" sx={{ color: '#0f766e', fontWeight: 600, display: 'block', mt: 0.5 }}>
                ✓ วันที่เลือก: {selectedDate}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: '#64748b', textTransform: 'none' }}>
            ปิด
          </Button>
          <Button
            variant="contained"
            onClick={handleBooking}
            sx={{
              bgcolor: '#082340',
              color: '#ffffff',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              '&:hover': { bgcolor: '#f2b429', color: '#082340' }
            }}
          >
            จองไกด์นำเที่ยว
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
