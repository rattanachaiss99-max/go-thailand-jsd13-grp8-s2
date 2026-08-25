'use client';

// @mui
import { SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { emailSchema } from '@/utils/validationSchema';

interface ForgotPasswordFormInput {
  email: string;
}

interface Props {
  inputSx?: SxProps;
}

/***************************  AUTH - FORGOT PASSWORD  ***************************/

export default function AuthForgotPassword({ inputSx }: Props) {
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ForgotPasswordFormInput>();

  // Handle form submission
  const onSubmit: SubmitHandler<ForgotPasswordFormInput> = (data) => {
    console.log(data);
    reset();
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
      <Button fullWidth type="submit" color="primary" variant="contained" sx={{ mt: { xs: 3, sm: 4 } }}>
        Send Code
      </Button>
    </form>
  );
}
