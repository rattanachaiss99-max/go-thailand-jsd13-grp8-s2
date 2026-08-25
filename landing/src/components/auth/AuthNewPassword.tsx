'use client';

import { useState, useRef } from 'react';

// @mui
import { useTheme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { passwordSchema } from '@/utils/validationSchema';

// @assets
import { CloseEye, OpenEye } from '@/icons';

interface NewPasswordFormInput {
  password: string;
  confirmPassword: string;
}

interface Props {
  inputSx?: SxProps;
}

/***************************  AUTH - NEW PASSWORD  ***************************/

export default function AuthNewPassword({ inputSx }: Props) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<NewPasswordFormInput>();

  const password = useRef({});
  password.current = watch('password', '');

  // Handle form submission
  const onSubmit: SubmitHandler<NewPasswordFormInput> = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ gap: 2.5 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Password
          </Typography>
          <OutlinedInput
            {...register('password', passwordSchema)}
            type={isOpen ? 'text' : 'password'}
            placeholder="Enter new password"
            slotProps={{ input: { 'aria-label': 'Password' } }}
            error={errors.password && Boolean(errors.password)}
            endAdornment={
              <IconButton onClick={() => setIsOpen(!isOpen)} rel="noopener noreferrer" aria-label="eye">
                {isOpen ? <OpenEye color={theme.vars.palette.grey[700]} /> : <CloseEye color={theme.vars.palette.grey[700]} />}
              </IconButton>
            }
            sx={inputSx}
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
            {...register('confirmPassword', { validate: (value) => value === password.current || 'The passwords do not match' })}
            type={isConfirmOpen ? 'text' : 'password'}
            placeholder="Enter confirm password"
            slotProps={{ input: { 'aria-label': 'Confirm Password' } }}
            error={errors.confirmPassword && Boolean(errors.confirmPassword)}
            endAdornment={
              <IconButton onClick={() => setIsConfirmOpen(!isConfirmOpen)} rel="noopener noreferrer" aria-label="eye">
                {isConfirmOpen ? <OpenEye color={theme.vars.palette.grey[700]} /> : <CloseEye color={theme.vars.palette.grey[700]} />}
              </IconButton>
            }
            sx={inputSx}
          />
          {errors.confirmPassword?.message && (
            <Typography variant="caption" sx={{ color: 'error.main' }}>
              {errors.confirmPassword?.message}
            </Typography>
          )}
        </Stack>
        <Button fullWidth type="submit" color="primary" variant="contained" sx={{ mt: { xs: 0.5, sm: 1.5 } }}>
          Reset Password
        </Button>
      </Stack>
    </form>
  );
}
