'use client';

import { useState } from 'react';

// @mui
import { useTheme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { emailSchema, passwordSchema, firstNameSchema, lastNameSchema } from '@/utils/validationSchema';
import { useUser } from '@/contexts/UserContext';

// @assets
import { CloseEye, OpenEye } from '@/icons';

interface LoginFormInput {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
}

interface Props {
  inputSx?: SxProps;
}

// API base — ปรับเป็นตัวแปรสภาพแวดล้อมได้
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

/***************************  AUTH - REGISTER  ***************************/

export default function AuthRegister({ inputSx }: Props) {
  const theme = useTheme();
  const { register: registerUserCtx } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LoginFormInput>();

  // Handle form submission — uses centralized api + UserContext
  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    setFeedback(null);

    if (data.password !== data.confirmPassword) {
      setFeedback({ type: 'error', msg: 'รหัสผ่านไม่ตรงกัน' });
      return;
    }

    setLoading(true);
    try {
      await registerUserCtx({
        email: data.email,
        password: data.password,
        firstName: data.firstname,
        lastName: data.lastname,
        role: 'customer'
      });
      setFeedback({ type: 'success', msg: 'สมัครสมาชิกสำเร็จ' });
      reset();
    } catch (err) {
      setFeedback({ type: 'error', msg: err instanceof Error ? err.message : 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ gap: 2.5 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              First Name
            </Typography>
            <OutlinedInput
              {...register('firstname', firstNameSchema)}
              placeholder="First name"
              slotProps={{ input: { 'aria-label': 'First name' } }}
              error={errors.firstname && Boolean(errors.firstname)}
              sx={{ ...inputSx, width: 1 }}
            />
            {errors.firstname?.message && (
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                {errors.firstname?.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Last Name
            </Typography>
            <OutlinedInput
              {...register('lastname', lastNameSchema)}
              placeholder="Last name"
              slotProps={{ input: { 'aria-label': 'Last name' } }}
              error={errors.lastname && Boolean(errors.lastname)}
              sx={{ ...inputSx, width: 1 }}
            />
            {errors.lastname?.message && (
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                {errors.lastname?.message}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Email
          </Typography>
          <OutlinedInput
            {...register('email', emailSchema)}
            placeholder="example@gmail.com"
            slotProps={{ input: { 'aria-label': 'Email Address' } }}
            error={errors.email && Boolean(errors.email)}
            sx={{ ...inputSx }}
          />
          {errors.email?.message && (
            <Typography variant="caption" sx={{ color: 'error.main' }}>
              {errors.email?.message}
            </Typography>
          )}
        </Stack>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Create Password
          </Typography>
          <OutlinedInput
            {...register('password', passwordSchema)}
            type={isOpen ? 'text' : 'password'}
            placeholder="Choose a password"
            slotProps={{ input: { 'aria-label': 'Password' } }}
            error={errors.password && Boolean(errors.password)}
            endAdornment={
              <IconButton disableRipple onClick={() => setIsOpen(!isOpen)} rel="noopener noreferrer" aria-label="eye">
                {isOpen ? <OpenEye color={theme.vars.palette.grey[700]} /> : <CloseEye color={theme.vars.palette.grey[700]} />}
              </IconButton>
            }
            sx={inputSx}
          />
        </Stack>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Confirm Password
          </Typography>
          <OutlinedInput
            {...register('confirmPassword', passwordSchema)}
            type={isOpenConfirm ? 'text' : 'password'}
            placeholder="Re-enter your password"
            slotProps={{ input: { 'aria-label': 'Confirm Password' } }}
            error={errors.password && Boolean(errors.password)}
            endAdornment={
              <IconButton disableRipple onClick={() => setIsOpenConfirm(!isOpenConfirm)} rel="noopener noreferrer" aria-label="eye">
                {isOpenConfirm ? <OpenEye color={theme.vars.palette.grey[700]} /> : <CloseEye color={theme.vars.palette.grey[700]} />}
              </IconButton>
            }
            sx={inputSx}
          />
        </Stack>
        <Button fullWidth type="submit" color="primary" variant="contained" disabled={loading} sx={{ mt: { xs: 0.5, sm: 1.5 } }}>
          {loading ? 'กำลังสมัคร...' : 'Sign Up'}
        </Button>
        {feedback && (
          <Alert severity={feedback.type} sx={{ mt: 1 }}>
            {feedback.msg}
          </Alert>
        )}
      </Stack>
    </form>
  );
}
