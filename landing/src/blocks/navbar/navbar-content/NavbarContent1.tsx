'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import NextLink from 'next/link';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

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
import { useUser } from '@/contexts/UserContext';

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
  const { user, logout } = useUser();

  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', width: 1 }}>
      <Logo to={landingBaseUrl} />
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        {navItems && !downMD && (
          <Box sx={{ flexGrow: 1 }}>
            <NavMenu {...{ navItems }} />
          </Box>
        )}

        <Stack direction="row" sx={{ gap: { xs: 1, md: 1.5 }, alignItems: 'center' }}>
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

              {/* User Session Section (Desktop) */}
              {user ? (
                <MenuPopper
                  offset={12}
                  popperWidth={270}
                  toggleProps={{
                    sx: { p: 0.5, minWidth: 'auto', borderRadius: '50px', border: '1px solid', borderColor: 'divider' },
                    children: (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 0.5 }}>
                        <Avatar
                          src={user.avatarUrl}
                          sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}
                        >
                          {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                        {!downMD && (
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              maxWidth: 90,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {user.firstName || 'สมาชิก'}
                          </Typography>
                        )}
                      </Stack>
                    )
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                      <Avatar
                        src={user.avatarUrl}
                        sx={{ width: 42, height: 42, bgcolor: 'primary.main', fontWeight: 700 }}
                      >
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {user.email}
                        </Typography>
                        <Chip
                          size="small"
                          label={user.membershipTier ? `${user.membershipTier.toUpperCase()}` : 'MEMBER'}
                          color="primary"
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.65rem', mt: 0.5 }}
                        />
                      </Box>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <List dense disablePadding>
                      <ListItemButton component={NextLink} href="/profile" sx={{ borderRadius: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <SvgIcon name="tabler-user" size={18} />
                        </ListItemIcon>
                        <ListItemText primary="ข้อมูลส่วนตัว (Profile)" primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItemButton>
                      <ListItemButton component={NextLink} href="/cart" sx={{ borderRadius: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <SvgIcon name="tabler-shopping-cart" size={18} />
                        </ListItemIcon>
                        <ListItemText primary="ตะกร้าสินค้า (Cart)" primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItemButton>
                      <ListItemButton component={NextLink} href="/dashboard" sx={{ borderRadius: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <SvgIcon name="tabler-layout-dashboard" size={18} />
                        </ListItemIcon>
                        <ListItemText primary="แดชบอร์ด (Dashboard)" primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItemButton>
                      {user.role === 'admin' && (
                        <ListItemButton component={NextLink} href="/admin/products" sx={{ borderRadius: 1.5 }}>
                          <ListItemIcon sx={{ minWidth: 30, color: 'secondary.main' }}>
                            <SvgIcon name="tabler-settings" size={18} />
                          </ListItemIcon>
                          <ListItemText
                            primary="จัดการสินค้า (Admin)"
                            primaryTypographyProps={{ variant: 'body2', color: 'secondary.main', fontWeight: 600 }}
                          />
                        </ListItemButton>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <ListItemButton onClick={logout} sx={{ borderRadius: 1.5, color: 'error.main' }}>
                        <ListItemIcon sx={{ minWidth: 30, color: 'error.main' }}>
                          <SvgIcon name="tabler-logout" size={18} />
                        </ListItemIcon>
                        <ListItemText
                          primary="ออกจากระบบ (Sign Out)"
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                        />
                      </ListItemButton>
                    </List>
                  </Box>
                </MenuPopper>
              ) : (
                <Button
                  component={NextLink}
                  href="/login"
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: '50px',
                    px: 2.2,
                    py: 0.8,
                    fontWeight: 600,
                    boxShadow: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  เข้าสู่ระบบ
                </Button>
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
                      <Divider />
                    </>
                  )}

                  {/* Mobile User Section */}
                  <Box sx={{ py: 2 }}>
                    {user ? (
                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar src={user.avatarUrl} sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                            {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Button component={NextLink} href="/profile" variant="outlined" size="small" fullWidth>
                            โปรไฟล์
                          </Button>
                          <Button onClick={logout} variant="outlined" color="error" size="small" fullWidth>
                            ออกจากระบบ
                          </Button>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} sx={{ width: 1 }}>
                        <Button component={NextLink} href="/login" variant="contained" color="primary" size="small" fullWidth>
                          เข้าสู่ระบบ
                        </Button>
                        <Button component={NextLink} href="/register" variant="outlined" color="primary" size="small" fullWidth>
                          สมัครสมาชิก
                        </Button>
                      </Stack>
                    )}
                  </Box>

                  {downSM && (
                    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: { xs: 1, md: 1.5 }, pb: 2, width: 1 }}>
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
