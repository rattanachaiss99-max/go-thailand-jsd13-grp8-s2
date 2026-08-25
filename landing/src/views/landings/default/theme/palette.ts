// @mui
import { PaletteMode } from '@mui/material/styles';

// @project
import { extendPaletteWithChannels } from '@/utils/colorUtils';

/***************************  DEFAULT / AI THEME - PALETTE  ***************************/

export function buildPalette() {
  const textPrimary = '#1A1C1E'; // AI/neutral/10 - on surface
  const textSecondary = '#42474E'; // AI/neutral variant/30 - on surface variant
  const divider = '#C2C7CE'; // AI/neutral variant/80 - outline variant
  const background = '#FFF';

  const textPrimaryDark = '#E2E2E5'; // AI/neutral/90 - on surface
  const textSecondaryDark = '#C2C7CE'; // AI/neutral variant/80 - on surface variant
  const dividerDark = '#42474E'; // AI/neutral variant/30 - outline variant
  const backgroundDark = '#0B0F12'; // AI/neutral/04 - container lowest

  const lightPalette = {
    primary: {
      lighter: '#CCE5FF', // AI/primary/90 - primary container / primary fixed
      light: '#92CCFF', // AI/primary/80 - primary fixed dim
      main: '#006397', // AI/primary/40 - primary
      dark: '#004B73', // AI/primary/30 - on primary fixed variant
      darker: '#001D31' // AI/primary/10 - on primary container / on primary fixed
    },
    secondary: {
      lighter: '#D3E4F8', // AI/secondary/90 - secondary container / secondary fixed
      light: '#B7C8DB', // AI/secondary/80 - secondary fixed dim
      main: '#4F6070', // AI/secondary/40 - secondary
      dark: '#384858', // AI/secondary/30 - on secondary fixed variant
      darker: '#0B1D2B' // AI/secondary/10 - on secondary container / on secondary fixed
    },
    grey: {
      50: '#F9F9FC', // AI/neutral/98 - surface / surface bright
      100: '#F1F4F9', // AI/neutral/96 - surface container low
      200: '#EBEEF3', // AI/neutral/94 - surface container
      300: '#E6E8EE', // AI/neutral/92 - surface container high
      400: '#E2E2E5', // AI/neutral/90 - surface container highest
      500: '#D7DADF', // AI/neutral/87 - surface dim
      600: divider, // AI/neutral variant/80 - outline variant
      700: '#72787E', // AI/neutral variant/50 - outline
      800: textSecondary, // AI/neutral variant/30 - on surface variant
      900: textPrimary // AI/neutral/10 - on surface
    },
    text: {
      primary: textPrimary, // AI/neutral/10 - on surface
      secondary: textSecondary // AI/neutral variant/30 - on surface variant
    },
    divider,
    background: {
      default: background
    }
  };

  const darkPalette = {
    primary: {
      lighter: '#004B73', // AI/primary/30 - primary container / on primary fixed variant
      light: '#3398DB', // AI/primary/60 - primary fixed dim
      main: '#92CCFF', // AI/primary/80 - primary
      dark: '#CCE5FF', // AI/primary/90 - on primary container / primary fixed
      darker: '#E7F2FF' // AI/primary/95 - on primary container / on primary fixed
    },
    secondary: {
      lighter: '#384858', // AI/secondary/30 - secondary container / on secondary fixed variant
      light: '#8193A4', // AI/secondary/60 - secondary fixed dim
      main: '#B7C8DB', // AI/secondary/80 - secondary
      dark: '#D3E4F8', // AI/secondary/90 - on secondary container / secondary fixed
      darker: '#E7F2FF' // AI/secondary/95   - on secondary container / on secondary fixed
    },
    grey: {
      50: '#101418', // AI/neutral/06 - surface / surface dim
      100: '#1A1C1E', // AI/neutral/10 - surface container low
      200: '#1C2024', // AI/neutral/12 - surface container
      300: '#272A2E', // AI/neutral/17 - surface container high
      400: '#313539', // AI/neutral/22 - surface container highest
      500: backgroundDark, // AI/neutral/04 - surface container lowest
      600: dividerDark, // AI/neutral variant/30 - outline variant
      700: '#8C9198', // AI/neutral variant/60 - outline
      800: textSecondaryDark, // AI/neutral variant/80 - on surface variant
      900: textPrimaryDark // AI/neutral/90 - on surface
    },
    text: {
      primary: textPrimaryDark, // AI/neutral/90 - on surface
      secondary: textSecondaryDark // AI/neutral variant/80 - on surface variant
    },
    divider: dividerDark,
    background: {
      default: backgroundDark,
      paper: backgroundDark
    }
  };

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPalette);
  const extendedDark = extendPaletteWithChannels(darkPalette);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light' as PaletteMode,
      ...extendedCommon,
      ...extendedLight
    },
    dark: {
      mode: 'dark' as PaletteMode,
      ...extendedCommon,
      ...extendedDark
    }
  };
}
