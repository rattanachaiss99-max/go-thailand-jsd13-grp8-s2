// @next
import {
  Archivo,
  Figtree,
  Roboto,
  Urbanist,
  Space_Grotesk,
  DM_Sans,
  Plus_Jakarta_Sans,
  Manrope,
  Inter,
  Syne,
  Heebo
} from 'next/font/google';
import localFont from 'next/font/local';

// @types
import { ConfigStates } from '@/types/config';

export enum Themes {
  THEME_DEFAULT = 'default',
  THEME_CRM = 'crm',
  THEME_AI = 'ai',
  THEME_CRYPTO = 'crypto',
  THEME_HOSTING = 'hosting',
  THEME_PMS = 'pms',
  THEME_HRM = 'hrm',
  THEME_PLUGIN = 'plugin',
  THEME_LMS = 'lms'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum ThemeDirection {
  LTR = 'ltr',
  RTL = 'rtl'
}

export const CSS_VAR_PREFIX = '';
export const DEFAULT_THEME_MODE: ThemeMode = ThemeMode.SYSTEM;

/***************************  CONFIG  ***************************/

const config: ConfigStates = {
  currentTheme: Themes.THEME_DEFAULT,
  themeDirection: ThemeDirection.LTR
};

export default config;

/***************************  THEME - FONT FAMILY  ***************************/

const fontRobot = Roboto({ subsets: ['latin'], weight: ['100', '300', '400', '500', '700', '900'] });

// @default
const fontSyne = Syne({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });
const fontHeebo = Heebo({ subsets: ['latin'], weight: ['100', '300', '400', '500', '700', '900'] });

// @ai
const fontArchivo = Archivo({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const fontFigtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// @hosting
const fontSpaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const fontDMSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// @pms
const fontPlusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

//@crypto
const fontUrbanist = Urbanist({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

//@lms
const fontManrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '700'] });
const fontInter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const FONT_SYNE: string = fontSyne.style.fontFamily;
export const FONT_HEEBO: string = fontHeebo.style.fontFamily;
export const FONT_ROBOTO: string = fontRobot.style.fontFamily;
export const FONT_ARCHIVO: string = fontArchivo.style.fontFamily;
export const FONT_FIGTREE: string = fontFigtree.style.fontFamily;
export const FONT_SPACE_GROTESK: string = fontSpaceGrotesk.style.fontFamily;
export const FONT_DMSANS: string = fontDMSans.style.fontFamily;
export const FONT_PLUS_JAKARTA: string = fontPlusJakarta.style.fontFamily;
export const FONT_URBANIST: string = fontUrbanist.style.fontFamily;
export const FONT_MANROPE: string = fontManrope.style.fontFamily;
export const FONT_INTER: string = fontInter.style.fontFamily;
