'use client';

// @mui
import { SxProps } from '@mui/material/styles';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';

// @project
import GetImagePath from '@/utils/GetImagePath';

// @types
import { AvatarImageProps } from '@/types/graphics';

interface Props {
  avatar: AvatarImageProps;
  avatarProps?: AvatarProps;
  name: string;
  role: string;
  nameProps?: TypographyProps;
  roleProps?: TypographyProps;
  background?: string | boolean;
  stackProps?: StackProps;
  sx?: SxProps;
}

/***************************  CARD - PROFILE CARD 2  ***************************/

export default function ProfileCard2({ avatar, avatarProps, name, nameProps, role, roleProps, background, stackProps, sx }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        gap: { xs: 1, sm: 1.5 },
        ...(background && { p: 1, pr: 3, borderRadius: 10, bgcolor: typeof background === 'boolean' ? 'grey.200' : background }),
        ...sx
      }}
    >
      <Avatar
        src={GetImagePath(avatar)}
        {...avatarProps}
        sx={{ width: 56, height: 56, ...avatarProps?.sx }}
        alt="Avatar"
        slotProps={{ img: { loading: 'lazy' } }}
      />
      <Stack {...stackProps} sx={{ gap: 0.5, justifyContent: 'center', ...stackProps?.sx }}>
        <Typography variant="h5" {...nameProps}>
          {name}
        </Typography>
        <Typography variant="body2" {...roleProps} sx={{ color: 'text.secondary', ...roleProps?.sx }}>
          {role}
        </Typography>
      </Stack>
    </Stack>
  );
}
