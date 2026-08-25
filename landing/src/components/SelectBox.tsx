'use client';

import { useState, MouseEvent } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import SvgIcon from '@/components/SvgIcon';

interface Props {
  options: { title: string; value: string }[];
  defaultSelection?: string;
  onChange?: (value: { title: string; value: string }) => void;
}

/***************************  COMMON - SELECT BOX  ***************************/

export default function SelectBox({ options, defaultSelection = '', onChange }: Props) {
  const theme = useTheme();

  const [selectedItem, setSelectedItem] = useState(defaultSelection);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'menu-popper' : undefined;

  // Handle button click to toggle the dropdown menu
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // Handle option selection, update the state and trigger onChange callback
  const onSelectionChange = (item: { title: string; value: string }) => {
    setSelectedItem(item.value);
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
          px: 2,
          py: 1.5,
          minWidth: 128,
          justifyContent: 'space-between',
          bgcolor: 'grey.100',
          borderColor: 'grey.300',
          '&.MuiButton-root:hover': { borderColor: 'grey.600', bgcolor: 'grey.100' }
        }}
        onClick={handleClick}
        variant="outlined"
        size="small"
        endIcon={<SvgIcon name="tabler-chevron-down" size={16} color="text.primary" stroke={2.5} />}
        rel="noopener noreferrer"
        aria-label="select box"
      >
        <Typography variant="caption" sx={{ color: 'text.primary' }}>
          {options.find((item) => item.value === selectedItem)?.title}
        </Typography>
      </Button>
      <Popper
        placement="bottom"
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 2] } }] }}
      >
        {({ TransitionProps }) => (
          <Fade in={open} {...TransitionProps}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: theme.vars.palette.grey[200], borderRadius: 4 }}>
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Box sx={{ p: 1 }}>
                  <List disablePadding>
                    {options.map((item, index) => (
                      <ListItemButton
                        key={index}
                        sx={{ borderRadius: 2, mb: 0.5 }}
                        selected={selectedItem === item.value}
                        onClick={() => selectedItem != item.value && onSelectionChange(item)}
                      >
                        <ListItemText primary={`${item.title}`} slotProps={{ primary: { variant: 'subtitle1' } }} sx={{ m: 0 }} />
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
