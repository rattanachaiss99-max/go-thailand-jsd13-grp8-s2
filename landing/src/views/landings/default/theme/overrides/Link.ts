// @mui
import type { LinkProps } from '@mui/material/Link';
import { Theme } from '@mui/material/styles';

// @project
import { generateFocusVisibleStyles } from '@/utils/CommonFocusStyle';

/*************************** OVERRIDES - LINK ***************************/

export default function Link(theme: Theme) {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'none' as LinkProps['underline']
      },
      styleOverrides: {
        root: {
          position: 'relative',
          '&:focus-visible': generateFocusVisibleStyles(theme.vars.palette.primary.main)
        }
      }
    }
  };
}
