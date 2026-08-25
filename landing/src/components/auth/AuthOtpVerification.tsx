'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import OtpInput from 'react-otp-input';

// @project
import { otpSchema } from '@/utils/validationSchema';

interface OtpVerificationFormInput {
  otp: string;
}

/***************************  AUTH - OTP VERIFICATION  ***************************/

export default function AuthOtpVerification() {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize react-hook-form
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<OtpVerificationFormInput>();

  // Handle form submission
  const onSubmit: SubmitHandler<OtpVerificationFormInput> = (data) => {
    console.log(data);
    reset();

    // reset focus after submission
    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement) {
      activeElement.blur(); // blur the currently focused element
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ gap: 0.5 }}>
        <Box
          sx={{ '& input:focus-visible': { borderColor: `${theme.vars.palette.primary.main} !important`, borderWidth: '2px !important' } }}
        >
          <Controller
            control={control}
            name="otp"
            rules={otpSchema}
            render={({ field: { value, onChange } }) => (
              <OtpInput
                value={value}
                onChange={onChange}
                numInputs={6}
                inputType="tel"
                shouldAutoFocus
                containerStyle={{ gap: downSM ? 8 : 12, justifyContent: 'center' }}
                inputStyle={{
                  width: '100%',
                  maxWidth: 66,
                  height: 56,
                  fontSize: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  outline: 'none',
                  borderColor: theme.vars.palette.divider
                }}
                renderInput={(props) => <input {...props} aria-label="otp" />}
              />
            )}
          />
        </Box>
        {errors.otp?.message && (
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            {errors.otp?.message}
          </Typography>
        )}
      </Stack>
      <Button fullWidth type="submit" color="primary" variant="contained" sx={{ mt: { xs: 3, sm: 4 } }}>
        Verify
      </Button>
    </form>
  );
}
