'use client';

// ============================================================================
// UserView Component — Read-Only Members Table
// Follows react-crm-lifecycle: reads shared state from Context
// ============================================================================

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useCrm } from '@/contexts/CrmContext';

export default function UserView() {
  const { members, loading, error, refreshMembers } = useCrm();

  return (
    <Box sx={{ py: 1 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }} spacing={1}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
            👥 User View — รายชื่อสมาชิกทั้งหมด (Read Only)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            มุมมองแบบอ่านอย่างเดียว สำหรับแสดงรายชื่อสมาชิกทั้งหมดที่แชร์มาจาก CrmContext
          </Typography>
        </Box>
        <Button variant="outlined" size="small" onClick={refreshMembers} sx={{ borderRadius: 2 }}>
          🔄 รีเฟรชข้อมูล
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" size="small" onClick={refreshMembers}>ลองใหม่</Button>}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ID (Server Assigned)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ชื่อ (First Name)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>นามสกุล (Last Name)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ตำแหน่ง (Position)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>บทบาท (Role)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={36} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
                      กำลังโหลดข้อมูลสมาชิก...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      ยังไม่มีข้อมูลสมาชิกในระบบ
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'text.secondary' }}>
                      {member.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{member.firstName}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{member.lastName}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>
                      <Chip
                        label={member.role === 'admin' ? 'Admin' : 'User'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: member.role === 'admin' ? '#e0f2fe' : '#f1f5f9',
                          color: member.role === 'admin' ? '#0369a1' : '#475569'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
