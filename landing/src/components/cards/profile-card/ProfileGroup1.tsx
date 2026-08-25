// @mui
import { SxProps } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @assets
import Wave from '@/images/graphics/Wave';

interface Props {
  avatarList: string[];
  review: string;
  position?: 'center' | 'end';
  sx?: SxProps;
}

/***************************  CARD - PROFILE GROUP 1  ***************************/

export default function ProfileGroup({ review, avatarList, position, sx }: Props) {
  return (
    <Stack sx={{ gap: 1, ...sx, alignItems: position || 'start' }}>
      <Stack sx={{ gap: 0.5, alignItems: position || 'start' }}>
        <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { borderWidth: 1, ml: -1.75 } }}>
          {avatarList.map((item, index) => (
            <Avatar key={index} src={item} alt="Avatar" slotProps={{ img: { loading: 'lazy' } }} />
          ))}
        </AvatarGroup>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {review}
        </Typography>
      </Stack>
      <Wave />
    </Stack>
  );
}
