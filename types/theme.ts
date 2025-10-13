import { scale, verticalScale } from "@/utils/styling";
export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  primary: string;
  secondary: string;
  white: string;
  black: string;
  inputBackground: string;
  transparent: string;
  tabBackground: string;
  containerBackground: string;
  skeletonBase: string;
  skeletonHighlight: string;

  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  disabled: string;
  loadingSpinner: string;
  overlay: string;
  gradient: string[];
  pending: string;
  inReview: string;
  resolved: string;
  rejected: string;
};

export type AppTheme = {
  mode: ThemeMode;
  colors: ThemeColors;
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
}

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
  _70: verticalScale(70),
  _100: verticalScale(100),
  _150: verticalScale(150),
  _200: verticalScale(200),
  _350: verticalScale(350),
  _400: verticalScale(400),
  _500: verticalScale(500),
}

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
}
