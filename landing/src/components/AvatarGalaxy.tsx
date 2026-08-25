import { ReactNode } from 'react';

// @mui
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import Box from '@mui/material/Box';

// @project
import CirclesBackground from '@/images/graphics/CirclesBackground';

const avatarSize1 = { height: { xs: 30, sm: 36 }, width: { xs: 30, sm: 36 } };
const avatarSize2 = { height: { xs: 40, sm: 46 }, width: { xs: 40, sm: 46 } };
const commonprops: AvatarProps = { alt: 'Avatar', slotProps: { img: { loading: 'lazy' } } };

/***************************  AVATAR GALAXY  ***************************/

export default function AvatarGalaxy({ avatarList, centerIcon }: { avatarList: string[]; centerIcon: ReactNode }) {
  return (
    <Box sx={{ position: 'relative', width: { xs: 450, sm: 553 } }}>
      <CirclesBackground />
      <Box sx={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%, -50%)' }}>{centerIcon}</Box>
      {avatarList[0] && (
        <Avatar src={avatarList[0]} {...commonprops} sx={{ position: 'absolute', top: '9%', left: '45%', ...avatarSize1 }} />
      )}
      {avatarList[1] && (
        <Avatar src={avatarList[1]} {...commonprops} sx={{ position: 'absolute', top: '40%', left: '27%', ...avatarSize1 }} />
      )}
      {avatarList[2] && (
        <Avatar src={avatarList[2]} {...commonprops} sx={{ position: 'absolute', top: '40%', left: '65%', ...avatarSize1 }} />
      )}
      {avatarList[3] && (
        <Avatar src={avatarList[3]} {...commonprops} sx={{ position: 'absolute', top: '15%', left: '20%', ...avatarSize2 }} />
      )}
      {avatarList[4] && (
        <Avatar src={avatarList[4]} {...commonprops} sx={{ position: 'absolute', top: '15%', left: '72%', ...avatarSize2 }} />
      )}
      {avatarList[5] && (
        <Avatar src={avatarList[5]} {...commonprops} sx={{ position: 'absolute', top: '69%', left: '45%', ...avatarSize2 }} />
      )}
      {avatarList[6] && (
        <Avatar src={avatarList[6]} {...commonprops} sx={{ position: 'absolute', top: '69%', left: '20%', ...avatarSize1 }} />
      )}
      {avatarList[7] && (
        <Avatar src={avatarList[7]} {...commonprops} sx={{ position: 'absolute', top: '69%', left: '73%', ...avatarSize1 }} />
      )}
    </Box>
  );
}
