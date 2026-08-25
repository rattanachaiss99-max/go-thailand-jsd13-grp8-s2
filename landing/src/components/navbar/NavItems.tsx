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

// @project
import MenuPopper from './MenuPopper';

import SvgIcon from '@/components/SvgIcon';

// @types
import { NavItemProps } from '@/types/navbar';

const navItemSX = { py: 1.5, borderRadius: { xs: 0, sm: 4 } };
const toggleProps = { color: 'text.primary', py: 1.5, typography: 'caption2', pl: { md: 2.25, lg: 3 } };

/***************************  NAVBAR - DRAWER  ***************************/

function MenuDrawer({ item, menuTextColor }: { item: NavItemProps; menuTextColor?: string }) {
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
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const currentPath = usePathname(); // Get the current path
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
