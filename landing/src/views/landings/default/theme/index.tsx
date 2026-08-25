// @mui
import { createTheme, TypographyVariantsOptions } from '@mui/material/styles';

// @project
import { buildPalette } from './palette';
import componentsOverride from './overrides';
import typography from './typography';
import { CSS_VAR_PREFIX } from '@/config';

// @types
import useConfig from '@/hooks/useConfig';

export const colorSchemeSelector = 'data-color-scheme';

/*************************** DEFAULT THEME - MAIN ***************************/

export default function ThemeCustomization(selector?: string) {
  const {
    state: { themeDirection }
  } = useConfig();

  const palette = buildPalette();
  const muiTheme = createTheme();

  // create duplicate theme due to responsive typography and fontFamily
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1266,
        xl: 1440
      }
    },
    direction: themeDirection,
    colorSchemes: {
      light: { palette: palette.light },
      dark: { palette: palette.dark }
    },
    cssVariables: {
      cssVarPrefix: CSS_VAR_PREFIX,
      colorSchemeSelector: selector || colorSchemeSelector
    },
    typography: typography(muiTheme) as TypographyVariantsOptions
  });

  theme.components = componentsOverride(theme);

  return theme;
}
