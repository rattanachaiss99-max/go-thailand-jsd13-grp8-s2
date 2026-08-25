'use client';

import { useState } from 'react';

// @next
import NextLink from 'next/link';

// @mui
import { useTheme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { emailSchema, passwordSchema } from '@/utils/validationSchema';

// @assets
import { CloseEye, OpenEye } from '@/icons';

interface LoginFormInput {
  email: string;
  password: string;
}

interface Props {
  inputSx?: SxProps;
}

/***************************  AUTH - LOGIN  ***************************/

export default function AuthLogin({ inputSx }: Props) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LoginFormInput>();

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ gap: 2.5 }}>
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
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Password
          </Typography>
          <OutlinedInput
            {...register('password', passwordSchema)}
            type={isOpen ? 'text' : 'password'}
            placeholder="Enter your password"
            slotProps={{ input: { 'aria-label': 'Password' } }}
            error={errors.password && Boolean(errors.password)}
            endAdornment={
              <IconButton onClick={() => setIsOpen(!isOpen)} rel="noopener noreferrer" aria-label="eye">
                {isOpen ? <OpenEye color={theme.vars.palette.grey[700]} /> : <CloseEye color={theme.vars.palette.grey[700]} />}
              </IconButton>
            }
            sx={inputSx}
          />
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: errors.password?.message ? 'space-between' : 'flex-end', width: 1 }}
          >
            {errors.password?.message && (
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                {errors.password?.message}
              </Typography>
            )}
            <Link
              component={NextLink}
              underline="hover"
              variant="caption2"
              href=""
              sx={{ textAlign: 'right', '&:hover': { color: 'primary.dark' } }}
            >
              Forgot Password?
            </Link>
          </Stack>
        </Stack>
        <Button fullWidth type="submit" color="primary" variant="contained" sx={{ mt: { xs: 0.5, sm: 1.5 } }}>
          Sign In
        </Button>
      </Stack>
    </form>
  );
}
