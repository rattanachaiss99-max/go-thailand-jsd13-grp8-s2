// @mui
import { Theme } from '@mui/material/styles';

// @project
import { generateFocusVisibleStyles } from '@/utils/CommonFocusStyle';

/***************************  COMPONENT - ICON BUTTON  ***************************/

export default function IconButton(theme: Theme) {
  return {
    MuiIconButton: {
      defaultProps: {
        disableFocusRipple: true
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 8,
          '&:focus-visible': generateFocusVisibleStyles(theme.vars.palette.primary.main)
        }
      }
    }
  };
}
