// @mui
import * as Theme from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface ThemeVars {
    typography: Theme['typography'];
    transitions: Theme['transitions'];
  }
}
