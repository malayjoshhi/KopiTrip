/**
 * KopiTrip Design System - Theme
 * Combines colors, typography, and spacing into a cohesive theme
 */

import { Colors } from './Colors';
import { Spacing } from './Spacing';
import { Typography } from './Typography';

export const Theme = {
  colors: {
    ...Colors,
    primary: Colors.primary.ocean,
    error: Colors.error,
    border: Colors.light.border,
    surface: Colors.light.surface,
    surfaceVariant: Colors.light.surfaceVariant,
    textPrimary: Colors.light.text,
    textSecondary: Colors.light.textSecondary,
    textTertiary: Colors.neutral[500],
  } as any,
  spacing: Spacing,
  typography: {
    ...Typography,
    heading: {
      ...Typography.heading,
      fontSize: Typography.heading.lg.fontSize,
      lineHeight: Typography.heading.lg.lineHeight,
    },
    subtitle: {
      ...Typography.subtitle,
      fontSize: Typography.subtitle.lg.fontSize,
      lineHeight: Typography.subtitle.lg.lineHeight,
    },
    body: {
      ...Typography.body,
      fontSize: Typography.body.lg.fontSize,
      lineHeight: Typography.body.lg.lineHeight,
    },
    caption: {
      ...Typography.caption,
      fontSize: Typography.caption.lg.fontSize,
      lineHeight: Typography.caption.lg.lineHeight,
    },
  } as any,
  
  // Shadows for depth
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Animations
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  },
};

export const theme = Theme;


