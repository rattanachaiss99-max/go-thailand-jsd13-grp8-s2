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
import { emailSchema } from '@/utils/validationSchema';
import { forgotPassword } from '@/server/api/auth';

interface ForgotPasswordFormInput {
  email: string;
}

interface Props {
  inputSx?: SxProps;
}

/***************************  AUTH - FORGOT PASSWORD  ***************************/

export default function AuthForgotPassword({ inputSx }: Props) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ForgotPasswordFormInput>();

  // Handle form submission — calls centralized api
  const onSubmit: SubmitHandler<ForgotPasswordFormInput> = async (data) => {
    setFeedback(null);
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setFeedback({ type: 'success', msg: 'ส่งรหัสรีเซ็ตรหัสผ่านไปที่อีเมลแล้ว' });
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
          Email
        </Typography>
        <OutlinedInput
          {...register('email', emailSchema)}
          placeholder="example@gmail.com"
          slotProps={{ input: { 'aria-label': 'Email address' } }}
          error={errors.email && Boolean(errors.email)}
          sx={{ ...inputSx }}
        />
        {errors.email?.message && (
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            {errors.email?.message}
          </Typography>
        )}
      </Stack>
      <Button fullWidth type="submit" color="primary" variant="contained" disabled={loading} sx={{ mt: { xs: 3, sm: 4 } }}>
        {loading ? 'กำลังส่ง...' : 'Send Code'}
      </Button>
      {feedback && (
        <Alert severity={feedback.type} sx={{ mt: 2 }}>
          {feedback.msg}
        </Alert>
      )}
    </form>
  );
}