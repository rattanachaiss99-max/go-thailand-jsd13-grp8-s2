'use client';

// @mui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';

// @project
import GetImagePath from '@/utils/GetImagePath';
import { SocialTypes } from '@/enum';

// @types
import { AuthSocialProps } from '@/types/auth';

/***************************  SOCIAL BUTTON - DATA  ***************************/

const authButtons = [
  {
    label: 'Google',
    icon: '/assets/images/social/google.svg',
    title: 'Sign in with Google'
  },
  {
    label: 'Apple',
    icon: { light: '/assets/images/social/apple-light.svg', dark: '/assets/images/social/apple-dark.svg' },
    title: 'Sign in with Apple'
  },
  {
    label: 'Facebook',
    icon: '/assets/images/social/facebook.svg',
    title: 'Sign in with Facebook'
  }
];

/***************************  AUTH - SOCIAL  ***************************/

export default function AuthSocial({ type = SocialTypes.VERTICAL, buttonSx }: AuthSocialProps) {
  return (
    <Stack direction={type === SocialTypes.VERTICAL ? 'column' : 'row'} sx={{ gap: 1 }}>
      {authButtons.map((item, index) => (
        <Button
          key={index}
          variant="outlined"
          fullWidth
          sx={{
            borderColor: 'grey.600',
            textTransform: 'none',
            ...(type === SocialTypes.HORIZONTAL && { borderRadius: 4, '.MuiButton-startIcon': { m: 0 } }),
            ...buttonSx
          }}
          startIcon={
            <CardMedia component="img" src={GetImagePath(item.icon)} sx={{ width: 16, height: 16 }} alt={item.label} loading="lazy" />
          }
        >
          {type === SocialTypes.VERTICAL && item.title}
        </Button>
      ))}
    </Stack>
  );
}
