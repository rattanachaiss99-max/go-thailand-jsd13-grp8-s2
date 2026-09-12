'use client';

// ============================================================================
// RoleCards Component — Reusable Navigation Bar for 4 CRM Views
// ============================================================================

import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCrm, CrmView } from '@/contexts/CrmContext';

interface ViewOption {
  id: CrmView;
  label: string;
  desc: string;
  icon: string;
}

const VIEW_OPTIONS: ViewOption[] = [
  { id: 'home', label: 'Home View', desc: 'หน้าภาพรวม & บทนำ', icon: '🏠' },
  { id: 'user', label: 'User View', desc: 'รายชื่อสมาชิก (Read Only)', icon: '👥' },
  { id: 'admin', label: 'Admin View', desc: 'เพิ่ม / ลบ สมาชิก (CRUD)', icon: '⚙️' },
  { id: 'owner', label: 'Owner View', desc: 'ข้อมูลผู้พัฒนา & Assessment', icon: '👤' }
];

export default function RoleCards() {
  const { currentView, setCurrentView, members } = useCrm();

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="stretch"
      >
        {VIEW_OPTIONS.map((opt) => {
          const isSelected = currentView === opt.id;
          return (
            <Button
              key={opt.id}
              variant={isSelected ? 'contained' : 'outlined'}
              onClick={() => setCurrentView(opt.id)}
              sx={{
                flex: 1,
                py: 2,
                px: 2.5,
                borderRadius: 3,
                textTransform: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'primary.main' : 'background.paper',
                boxShadow: isSelected ? '0 8px 24px rgba(13, 110, 253, 0.15)' : 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: isSelected ? 'primary.dark' : 'rgba(0,0,0,0.02)',
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography sx={{ fontSize: '1.5rem', mb: 0.2 }}>{opt.icon}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isSelected ? '#fff' : 'text.primary' }}>
                {opt.label}
              </Typography>
              <Typography variant="caption" sx={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>
                {opt.desc} {opt.id === 'user' || opt.id === 'admin' ? `(${members.length})` : ''}
              </Typography>
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
