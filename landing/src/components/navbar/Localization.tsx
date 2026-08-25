'use client';

import { useState, MouseEvent } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';

// @project
import SvgIcon from '@/components/SvgIcon';
import { useLanguage, Locale } from '@/contexts/LanguageContext';

/***************************  LOCALIZATION - DATA  ***************************/

const locales = [
  { name: 'English', code: 'en' as Locale, sample: 'EN' },
  { name: 'Thai', code: 'th' as Locale, sample: 'TH' }
];

/***************************  NAVBAR - LOCALIZATION  ***************************/

export default function Localization({ ...rest }: ButtonProps) {
  const theme = useTheme();
  const { locale: currentLocale, setLocale } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'menu-popper' : undefined;

  const currentLocaleItem = locales.find((l) => l.code === currentLocale) || locales[0];

  return (
    <>
      <Button
        aria-describedby={id}
        onClick={handleClick}
        variant="outlined"
        size="small"
        endIcon={<SvgIcon name="tabler-chevron-down" size={16} stroke={2.5} />}
        {...rest}
      >
        {currentLocaleItem.sample}
      </Button>
      <Popper
        placement="bottom"
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        sx={{ zIndex: 1202 }}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 2]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Fade in={open} {...TransitionProps}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: theme.vars.palette.grey[200], borderRadius: 4 }}>
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Box sx={{ p: 1 }}>
                  <List disablePadding>
                    {locales.map((locale, index) => (
                      <ListItemButton
                        key={index}
                        sx={{ borderRadius: 4, mb: 0.5 }}
                        selected={currentLocale === locale.code}
                        onClick={() => {
                          setLocale(locale.code);
                          setAnchorEl(null);
                        }}
                      >
                        <ListItemText primary={`${locale.name} (${locale.sample})`} slotProps={{ primary: { variant: 'subtitle1' } }} />
                      </ListItemButton>
                    ))}
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
