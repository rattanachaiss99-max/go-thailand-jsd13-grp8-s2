'use client';

import { useState } from 'react';

// @mui
import { SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { passwordSchema } from '@/utils/validationSchema';
import { resetPassword } from '@/server/api/auth';

interface NewPasswordFormInput {
  password: string;
  confirmPassword: string;
}

interface Props {
  inputSx?: SxProps;
  token?: string; // passed from URL query param
}

/***************************  AUTH - NEW PASSWORD  ***************************/

export default function AuthNewPassword({ inputSx, token }: Props) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewPasswordFormInput>();

  // Handle form submission — calls centralized api
  const onSubmit: SubmitHandler<NewPasswordFormInput> = async (data) => {
    setFeedback(null);

    if (data.password !== data.confirmPassword) {
      setFeedback({ type: 'error', msg: 'รหัสผ่านไม่ตรงกัน' });
      return;
    }

    if (!token) {
      setFeedback({ type: 'error', msg: 'ไม่พบโทเคนรีเซ็ต กรุณาขอรหัสใหม่' });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, data.password);
      setFeedback({ type: 'success', msg: 'เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบ' });
      reset();
    } catch (err) {
      setFeedback({ type: 'error', msg: err instanceof Error ? err.message : 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          New Password
        </Typography>
        <OutlinedInput
          {...register('password', passwordSchema)}
          placeholder="Enter new password"
          slotProps={{ input: { 'aria-label': 'New Password' } }}
          error={errors.password && Boolean(errors.password)}
          sx={{ ...inputSx }}
        />
        {errors.password?.message && (
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            {errors.password?.message}
          </Typography>
        )}
      </Stack>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Confirm Password
        </Typography>
        <OutlinedInput
          {...register('confirmPassword', passwordSchema)}
          placeholder="Re-enter new password"
          slotProps={{ input: { 'aria-label': 'Confirm Password' } }}
          error={errors.confirmPassword && Boolean(errors.confirmPassword)}
          sx={{ ...inputSx }}
        />
        {errors.confirmPassword?.message && (
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            {errors.confirmPassword?.message}
          </Typography>
        )}
      </Stack>
      <Button fullWidth type="submit" color="primary" variant="contained" disabled={loading} sx={{ mt: { xs: 3, sm: 4 } }}>
        {loading ? 'กำลังเปลี่ยน...' : 'Reset Password'}
      </Button>
      {feedback && (
        <Alert severity={feedback.type} sx={{ mt: 2 }}>
          {feedback.msg}
        </Alert>
      )}
    </form>
  );
}