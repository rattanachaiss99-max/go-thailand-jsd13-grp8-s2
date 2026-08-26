'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'motion/react';

// @project
import { navbar1Height } from '../Navbar1';
import ContainerWrapper from '@/components/ContainerWrapper';
import Logo from '@/components/logo';
import { Customization, MenuPopper, NavPrimaryButton, NavSecondaryButton, SocialIcons } from '@/components/navbar';
import { NavMenu, NavMenuDrawer } from '@/components/navbar/NavItems';
import SvgIcon from '@/components/SvgIcon';
import { withAlpha } from '@/utils/colorUtils';

// @types
import { NavbarContentProps } from '@/types/navbar';

/***************************  NAVBAR - CONTENT 1  ***************************/

export default function NavbarContent1({
  landingBaseUrl,
  navItems,
  primaryBtn,
  secondaryBtn,
  customization,
  selectedTheme,
  animated
}: NavbarContentProps) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', width: 1 }}>
      <Logo to={landingBaseUrl} />
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        {navItems && !downMD && (
          <Box sx={{ flexGrow: 1 }}>
            <NavMenu {...{ navItems }} />
          </Box>
        )}

        <Stack direction="row" sx={{ gap: { xs: 1, md: 1.5 } }}>
          {customization && <Customization selectedTheme={selectedTheme} />}
          {!downSM && (
            <>
              <SocialIcons />
              {secondaryBtn && <NavSecondaryButton {...secondaryBtn} />}
              {primaryBtn && (
                <>
                  {animated ? (
                    <motion.div
                      initial={{ borderRadius: '50px' }}
                      animate={{
                        boxShadow: [
                          `0px 0px 0px 0px ${withAlpha(theme.vars.palette.primary.main, 0.7)}`,
                          `0px 0px 0px 8px ${withAlpha(theme.vars.palette.primary.main, 0)}`,
                          `0px 0px 0px 0px ${withAlpha(theme.vars.palette.primary.main, 0)}`
                        ],
                        borderRadius: '50px'
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    >
                      <NavPrimaryButton {...primaryBtn} />
                    </motion.div>
                  ) : (
                    <NavPrimaryButton {...primaryBtn} />
                  )}
                </>
              )}
            </>
          )}
          {downMD && (
            <Box sx={{ flexGrow: 1, ...(!navItems && { display: { xs: 'flex', sm: 'none' } }) }}>
              <MenuPopper
                offset={downSM ? 12 : 16}
                toggleProps={{
                  children: <SvgIcon name="tabler-menu-2" color="text.primary" />,
                  color: 'inherit',
                  sx: { minWidth: 40, width: 40, height: 40, p: 0 }
                }}
              >
                <ContainerWrapper
                  sx={{
                    height: 'auto',
                    maxHeight: { xs: `calc(100vh - ${navbar1Height.xs}px)`, sm: `calc(100vh - ${navbar1Height.sm}px)` },
                    overflowY: 'auto'
                  }}
                >
                  {navItems && (
                    <>
                      <Box sx={{ mx: -2 }}>
                        <NavMenuDrawer {...{ navItems }} />
                      </Box>
                      {downSM && <Divider />}
                    </>
                  )}
                  {downSM && (
                    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: { xs: 1, md: 1.5 }, py: 2.5, width: 1 }}>
                      <SocialIcons />
                      {secondaryBtn && <NavSecondaryButton {...secondaryBtn} />}
                      {primaryBtn && <NavPrimaryButton {...primaryBtn} />}
                    </Stack>
                  )}
                </ContainerWrapper>
              </MenuPopper>
            </Box>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
