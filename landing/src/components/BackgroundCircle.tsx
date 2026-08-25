// @mui
import Box from '@mui/material/Box';

// @assets
import Circles from '@/images/Circles';

/***************************  BACKGROUND - CIRCLE  ***************************/

export default function BackgroundCircle() {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: 1,
        mt: { xs: -34.5, sm: -34.25, md: -33 },
        height: 600,
        transform: { xs: 'scale(1.5)', sm: 'scale(1.3)', md: 'unset' },
        '& svg': { width: 1, height: 1 }
      }}
    >
      <Circles />
    </Box>
  );
}
