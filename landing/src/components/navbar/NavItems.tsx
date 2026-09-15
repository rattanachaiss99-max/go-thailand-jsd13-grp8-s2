'use client';

import { ReactElement, useState } from 'react';

// @next
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';

// @project
import MenuPopper from './MenuPopper';
import SvgIcon from '@/components/SvgIcon';

// @types
import { NavItemProps } from '@/types/navbar';

const navItemSX = { py: 1.5, borderRadius: { xs: 0, sm: 4 } };
const toggleProps = { color: 'text.primary', py: 1.5, typography: 'caption2', pl: { md: 2.25, lg: 3 } };

/***************************  NAVBAR - DRAWER  ***************************/

function MenuDrawer({ item, menuTextColor }: { item: NavItemProps; menuTextColor?: string }) {
  const [openSub, setOpenSub] = useState(true);

  if (item.children && item.children.length > 0) {
    return (
      <Box>
        <ListItemButton onClick={() => setOpenSub(!openSub)} sx={navItemSX}>
          <ListItemText
            primary={item.title}
            slotProps={{ primary: { variant: 'caption2', fontWeight: 700, color: menuTextColor || 'text.primary' } }}
          />
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{openSub ? '▲' : '▼'}</span>
        </ListItemButton>
        <Collapse in={openSub} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {item.children.map((child, idx) => (
              <ListItemButton
                key={idx}
                component={NextLink}
                href={child.link}
                sx={{ py: 1, borderRadius: 2 }}
              >
                {child.icon && <span style={{ marginRight: 8, fontSize: '0.9rem' }}>{child.icon}</span>}
                <ListItemText
                  primary={child.title}
                  slotProps={{ primary: { variant: 'caption2', color: '#0284c7', fontWeight: 600 } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </Box>
    );
  }

  return (
    <ListItemButton
      {...(item.link && { component: NextLink, href: item.link, underline: 'none', ...(item?.target && { target: item.target }) })}
      sx={navItemSX}
    >
      <ListItemText primary={item.title} slotProps={{ primary: { variant: 'caption2', color: menuTextColor || 'text.primary' } }} />
    </ListItemButton>
  );
}

/***************************  NAVBAR - LIST  ***************************/

function NavList({ item, menuTextColor }: { item: NavItemProps; menuTextColor?: string }) {
  const theme = useTheme();
  const currentPath = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (item.children && item.children.length > 0) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // If item has dropdown submenus
  if (item.children && item.children.length > 0) {
    const isParentActive =
      (item.link && currentPath === item.link) ||
      item.children.some((child) => currentPath === child.link.split('?')[0]);

    return (
      <Box component="span" sx={{ display: 'inline-block' }}>
        <Button
          size="small"
          onClick={handleOpen}
          sx={{
            ...toggleProps,
            pr: { md: 1.5, lg: 2 },
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.6,
            textTransform: 'none',
            ...(isParentActive && {
              color: 'primary.main',
              fontWeight: 700
            })
          }}
        >
          {item.title}
          <span
            style={{
              fontSize: '0.65rem',
              display: 'inline-block',
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'none'
            }}
          >
            ▼
          </span>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                mt: 1,
                minWidth: 230,
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '1px solid #e2e8f0',
                p: 0.8
              }
            }
          }}
        >
          {item.children.map((child, idx) => (
            <MenuItem
              key={idx}
              component={NextLink}
              href={child.link}
              onClick={handleClose}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                '&:hover': { bgcolor: '#f0f9ff' }
              }}
            >
              {child.icon && <span style={{ fontSize: '1.1rem' }}>{child.icon}</span>}
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {child.title}
                </Typography>
                {child.desc && (
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                    {child.desc}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  const buttonProps = {
    sx: {
      ...toggleProps,
      pr: { md: 2.25, lg: 3 },
      ...(item.icon && { justifyContent: 'center', gap: 0.75 }),
      ...(item.link &&
        (currentPath === item.link || (item.link === '/sections' && currentPath.includes('/sections'))) && {
          color: 'primary.main',
          fontWeight: 600
        })
    },
    ...(item.link && { component: NextLink, href: item.link, ...(item?.target && { target: item.target }) })
  };

  return (
    <Button size="small" {...buttonProps}>
      {item.title}
      {item?.icon && <SvgIcon color="inherit" size={16} {...(typeof item.icon === 'string' ? { name: item.icon } : { ...item.icon })} />}
    </Button>
  );
}

/***************************  NAVBAR - MENUS  ***************************/

export function NavMenu({ navItems, menuTextColor }: { navItems: NavItemProps[]; menuTextColor?: string }) {
  return navItems.map((item: NavItemProps, index: number) => <NavList key={index} {...{ item, menuTextColor }} />);
}

export function NavMenuDrawer({ navItems, menuTextColor }: { navItems: NavItemProps[]; menuTextColor?: string }) {
  return (
    <List>
      {navItems.map((item: NavItemProps, index: number) => (
        <MenuDrawer key={index} {...{ item, menuTextColor }} />
      ))}
    </List>
  );
}
