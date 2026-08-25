'use client';

import { useState } from 'react';

// @mui
import { useColorScheme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

// @project
import MenuPopper from './MenuPopper';
import SvgIcon from '@/components/SvgIcon';
import { Themes, ThemeDirection, ThemeMode } from '@/config';
import useConfig from '@/hooks/useConfig';

interface ThemeListProps {
  name: string;
  value: Themes;
  color: string;
}

type ThemeModeItem = {
  title: string;
  mode: ThemeMode;
  icon: string;
};

const themeModeData: ThemeModeItem[] = [
  { title: 'Light', mode: ThemeMode.LIGHT, icon: 'tabler-sun' },
  { title: 'Dark', mode: ThemeMode.DARK, icon: 'tabler-moon' },
  { title: 'System', mode: ThemeMode.SYSTEM, icon: 'tabler-sun-moon' }
];

/***************************  THEME SELECTOR - DATA  ***************************/

const themeOptions: ThemeListProps[] = [
  { name: 'DEFAULT', value: Themes.THEME_DEFAULT, color: '#006397' }
  // TODO(JSD13): เพิ่ม { name: 'TRAVEL', value: Themes.THEME_TRAVEL, color: '#00897B' } เมื่อสร้างธีมท่องเที่ยว
];

/***************************  NAVBAR - CUSTOMIZATION  ***************************/

export default function Customization({ selectedTheme }: { selectedTheme?: Themes }) {
  const { mode, setMode } = useColorScheme();

  const {
    state: { currentTheme, themeDirection },
    setField
  } = useConfig();
  const [selected, setSelected] = useState<Themes>(selectedTheme || currentTheme);

  // handle theme selection change
  const onSelectionChange = (value: Themes) => {
    setOpen(!open);
    setSelected(value);
    setField('currentTheme', value);
  };

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <MenuPopper
      offset={10}
      offsetX={15}
      toggleProps={{
        children: (
          <Badge
            badgeContent="New"
            color="error"
            slotProps={{ badge: { sx: { top: '-8px', right: '-8px', typography: 'caption', fontSize: '0.625rem' } } }}
          >
            <SvgIcon name="tabler-settings" color="primary.main" size={18} />
          </Badge>
        ),
        color: 'primary',
        variant: 'outlined',
        'aria-label': 'settings',
        sx: { minWidth: 40, width: 40, height: 40, p: 0 }
      }}
      popperWidth={234}
    >
      <List sx={{ p: 1.5 }}>
        <ListItem sx={{ px: 1 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <SvgIcon name="tabler-sun-moon" color="text.primary" stroke={1} />
          </ListItemIcon>
          <ListItemText color="grey.100">Mode</ListItemText>
          <Stack
            direction="row"
            sx={{ p: 1, gap: 1, height: 36, alignItems: 'center', borderRadius: 2, border: '1px solid', borderColor: 'grey.300' }}
          >
            {themeModeData.map((item, index) => (
              <Box key={index} sx={{ '&:hover': { cursor: 'pointer' } }} onClick={() => setMode(item.mode)}>
                <SvgIcon name={item.icon} size={20} stroke={2} color={mode === item.mode ? 'primary.main' : 'secondary.light'} />
              </Box>
            ))}
          </Stack>
        </ListItem>
        <ListItem sx={{ px: 1 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <SvgIcon name="tabler-text-direction-ltr" color="text.primary" stroke={1} />
          </ListItemIcon>
          <ListItemText color="grey.100">RTL</ListItemText>
          <Switch
            slotProps={{ input: { 'aria-label': 'direction-ltr' } }}
            checked={themeDirection === ThemeDirection.RTL}
            onChange={() => setField('themeDirection', themeDirection === ThemeDirection.RTL ? ThemeDirection.LTR : ThemeDirection.RTL)}
          />
        </ListItem>
        <ListItem sx={{ px: 1 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <SvgIcon name="tabler-color-swatch" color="text.primary" stroke={1} />
          </ListItemIcon>
          <ListItemText color="grey.100">Theme</ListItemText>
          <Button
            sx={{
              borderRadius: 2,
              height: 36,
              px: 1.5,
              justifyContent: 'space-between',
              bgcolor: 'grey.100',
              borderColor: 'grey.300',
              '&.MuiButton-root:hover': { borderColor: 'grey.600', bgcolor: 'grey.100' }
            }}
            onClick={handleClick}
            variant="contained"
            size="small"
            endIcon={<SvgIcon name="tabler-chevron-down" size={16} stroke={2} color="text.primary" />}
          >
            <Box
              sx={{
                width: 30,
                height: 16,
                bgcolor: themeOptions.find((item) => item.value === selected)?.color || 'grey.100',
                borderRadius: 1
              }}
            />
          </Button>
        </ListItem>
        <Collapse in={open && !selectedTheme} timeout="auto" unmountOnExit>
          <Box sx={{ p: 1 }}>
            <List disablePadding>
              <Stack sx={{ gap: 0.75 }}>
                {themeOptions.map((item, index) => (
                  <Box key={index}>
                    <ListItemButton
                      sx={{ borderRadius: 2, p: 1, gap: 1 }}
                      selected={selected === item.value}
                      onClick={() => selected != item.value && onSelectionChange(item.value)}
                    >
                      <Box sx={{ width: 40, height: 20, bgcolor: item.color, borderRadius: 1 }} />
                      <ListItemText primary={item.name} slotProps={{ primary: { variant: 'body2' } }} />
                    </ListItemButton>
                  </Box>
                ))}
              </Stack>
            </List>
          </Box>
        </Collapse>
      </List>
    </MenuPopper>
  );
}
