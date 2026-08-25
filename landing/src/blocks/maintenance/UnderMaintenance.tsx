// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import { SECTION_COMMON_PY } from '@/utils/constant';

// @assets
import BackShortly from '@/images/maintenance/BackShortly';
import Maintenance from '@/images/maintenance/Maintenance';

interface Props {
  heading: string;
}

/***************************  UNDER MAINTENANCE - PAGES  ***************************/

/**
 *
 * Demos:
 * - [UnderMaintenance](https://www.saasable.io/blocks/under-maintenance)
 */

export default function UnderMaintenance({ heading }: Props) {
  return (
    <ContainerWrapper>
      <Stack sx={{ width: 1, height: '100vh', py: SECTION_COMMON_PY, minHeight: { xs: 450, sm: 600, md: 800 } }}>
        <GraphicsCard sx={{ width: 1, height: 1, position: 'relative' }}>
          <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: '60%' }}>
            <Box sx={{ width: 1, maxWidth: { xs: 360, sm: 486, md: 728 }, p: 2 }}>
              <BackShortly />
            </Box>
            <Typography sx={{ textAlign: 'center', width: { xs: 248, sm: 340, md: 448 } }}>{heading}</Typography>
          </Stack>
          <Box sx={{ width: '70%', maxWidth: { xs: 360, sm: 486, md: 820 }, position: 'absolute', left: -2, bottom: -6 }}>
            <Maintenance />
          </Box>
        </GraphicsCard>
      </Stack>
    </ContainerWrapper>
  );
}
