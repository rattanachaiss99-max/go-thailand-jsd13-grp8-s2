/* eslint-disable */
import * as createPalette from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }

  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}
