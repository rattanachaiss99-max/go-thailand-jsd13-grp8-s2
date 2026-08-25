'use client';

import { useState, MouseEvent } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';

// @project
import SvgIcon from './SvgIcon';
import { Themes } from '@/config';

interface Props {
  defaultTheme?: string;
  onChange?: (value: { name: string; value: string; color: string }) => void;
}

interface ThemeListProps {
  name: string;
  value: string;
  color: string;
}

/***************************  THEME SELECTOR - DATA  ***************************/

const themeOptions: ThemeListProps[] = [
  { name: 'CRM', value: Themes.THEME_CRM, color: '#D0BCFF' },
  { name: 'DEFAULT', value: Themes.THEME_DEFAULT, color: '#006397' },
  { name: 'AI', value: Themes.THEME_AI, color: '#006397' },
  { name: 'CRYPTO', value: Themes.THEME_CRYPTO, color: '#006D37' },
  { name: 'HOSTING', value: Themes.THEME_HOSTING, color: '#606BDF' },
  { name: 'PMS', value: Themes.THEME_PMS, color: '#897700' },
  { name: 'HRM', value: Themes.THEME_HRM, color: '#2E847A' },
  { name: 'PLUGIN', value: Themes.THEME_PLUGIN, color: '#6375AD' },
  { name: 'LMS', value: Themes.THEME_LMS, color: '#005BC0' }
];

/***************************  COMMON - THEME SELECTOR  ***************************/

export default function ThemeSelector({ defaultTheme = Themes.THEME_CRM, onChange }: Props) {
  const theme = useTheme();

  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'menu-popper' : undefined;

  // Handle theme selection change
  const onSelectionChange = (item: { name: string; value: string; color: string }) => {
    setSelectedTheme(item.value);
    if (onChange) {
      onChange(item);
    }
  };

  return (
    <>
      <Button
        aria-describedby={id}
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
        variant="outlined"
        size="small"
        rel="noopener noreferrer"
        aria-label="theme selector"
        startIcon={<SvgIcon name="tabler-color-swatch" size={16} stroke={2} color="text.primary" />}
      >
        <Box
          sx={{
            width: 30,
            height: 16,
            bgcolor: themeOptions.find((item) => item.value === selectedTheme)?.color || 'grey.100',
            borderRadius: 1
          }}
        />
      </Button>
      <Popper
        placement="bottom"
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        sx={{ width: 136 }}
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 2] } }] }}
      >
        {({ TransitionProps }) => (
          <Fade in={open} {...TransitionProps}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: theme.vars.palette.grey[200], borderRadius: 4 }}>
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Box sx={{ p: 1 }}>
                  <List disablePadding>
                    <Grid container spacing={0.75}>
                      {themeOptions.map((item, index) => (
                        <Grid key={index} size={6}>
                          <ListItemButton
                            sx={{ borderRadius: 2, p: 1 }}
                            selected={selectedTheme === item.value}
                            onClick={() => selectedTheme != item.value && onSelectionChange(item)}
                          >
                            <Box sx={{ width: 40, height: 20, bgcolor: item.color, borderRadius: 1 }} />
                          </ListItemButton>
                        </Grid>
                      ))}
                    </Grid>
                  </List>
                </Box>
              </ClickAwayListener>
            </Card>
          </Fade>
        )}
      </Popper>
    </>
  );
}
