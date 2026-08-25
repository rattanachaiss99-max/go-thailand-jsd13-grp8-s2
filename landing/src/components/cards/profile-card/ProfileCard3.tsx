'use client';

// @mui
import { SxProps } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import GetImagePath from '@/utils/GetImagePath';
import { AvatarImageProps } from '@/types/graphics';

interface Props {
  avatar: AvatarImageProps;
  avatarSize?: number;
  name: string;
  role: string;
  background?: string | boolean;
  sx?: SxProps;
}

/***************************  CARD - PROFILE CARD 3  ***************************/

export default function ProfileCard3({ avatar, avatarSize = 60, name, role, background, sx }: Props) {
  return (
    <Stack
      sx={{
        gap: 1.5,
        alignItems: 'center',
        ...(background && { p: { xs: 2, sm: 3 }, borderRadius: 10, bgcolor: typeof background === 'boolean' ? 'grey.200' : background }),
        ...sx
      }}
    >
      <Avatar
        src={GetImagePath(avatar)}
        sx={{ width: avatarSize, height: avatarSize }}
        alt="Avatar"
        slotProps={{ img: { loading: 'lazy' } }}
      />
      <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {role}
        </Typography>
      </Stack>
    </Stack>
  );
}
