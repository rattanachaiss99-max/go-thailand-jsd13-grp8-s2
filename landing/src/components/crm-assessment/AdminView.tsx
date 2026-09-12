'use client';

// ============================================================================
// AdminView Component — CRUD Operations (Create & Delete Members)
// Follows react-crm-lifecycle:
// 1. "state used by ONE component → local useState" (Form inputs)
// 2. Event-handler fetches (Save/Delete clicks) do NOT need useEffect
// 3. State updates are IMMUTABLE (append on create, filter on delete)
// ============================================================================

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useCrm } from '@/contexts/CrmContext';

export default function AdminView() {
  const { members, loading, error, addMember, removeMember } = useCrm();

  // Local useState for Form inputs (Rule: state used by ONE component → local useState)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    role: 'user' as 'user' | 'admin'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'กรุณากรอกชื่อ (First Name)';
    if (!formData.lastName.trim()) errs.lastName = 'กรุณากรอกนามสกุล (Last Name)';
    if (!formData.position.trim()) errs.position = 'กรุณากรอกตำแหน่ง (Position)';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Event handler fetch (Save): no useEffect needed
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const created = await addMember(formData);
      setActionSuccess(`เพิ่มสมาชิก "${created.firstName} ${created.lastName}" สำเร็จแล้ว!`);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        position: '',
        role: 'user'
      });
    } catch (err: any) {
      setActionError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Event handler fetch (Delete): no useEffect needed
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิก "${name}"?`)) return;

    setDeletingId(id);
    setActionError(null);
    setActionSuccess(null);

    try {
      await removeMember(id);
      setActionSuccess(`ลบสมาชิก "${name}" เรียบร้อยแล้ว`);
    } catch (err: any) {
      setActionError(err.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box sx={{ py: 1 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
          ⚙️ Admin View — จัดการสมาชิก (CRUD Operations)
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          มุมมองผู้ดูแลระบบสำหรับเพิ่มและลบสมาชิก ข้อมูลที่สร้างจะได้รับ Server-assigned ID และอัปเดต State แบบ Immutable
        </Typography>
      </Box>

      {/* Notifications */}
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionSuccess(null)}>
          {actionSuccess}
        </Alert>
      )}
      {(actionError || error) && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setActionError(null)}>
          {actionError || error}
        </Alert>
      )}

      {/* Create Member Form Card */}
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 4 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            ➕ เพิ่มสมาชิกใหม่ (Create Member)
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="ชื่อ (First Name)"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.firstName)}
                  helperText={formErrors.firstName}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="นามสกุล (Last Name)"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.lastName)}
                  helperText={formErrors.lastName}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="ตำแหน่ง (Position)"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.position)}
                  helperText={formErrors.position}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="บทบาท (Role)"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <MenuItem value="user">User (ทั่วไป)</MenuItem>
                  <MenuItem value="admin">Admin (ผู้ดูแล)</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2.5 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  borderRadius: 2,
                  px: 3.5,
                  py: 1,
                  fontWeight: 700,
                  textTransform: 'none'
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึกสมาชิก (Save Member)'
                )}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Members Management Table */}
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ชื่อ - นามสกุล</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ตำแหน่ง</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>บทบาท</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  การจัดการ (Action)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={36} />
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      ไม่มีรายชื่อสมาชิก กรุณาเพิ่มสมาชิกใหม่ด้านบน
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'text.secondary' }}>
                      {member.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {member.firstName} {member.lastName}
                    </TableCell>
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
                    <TableCell align="center">
                      <Tooltip title="ลบสมาชิกนี้">
                        <span>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            disabled={deletingId === member.id}
                            onClick={() => handleDelete(member.id, `${member.firstName} ${member.lastName}`)}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
                          >
                            {deletingId === member.id ? <CircularProgress size={16} color="inherit" /> : '🗑️ Delete'}
                          </Button>
                        </span>
                      </Tooltip>
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
