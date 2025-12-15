/**
 * Hushu Design System - "Serene & Faceless"
 * Dark mode first, Midnight & Gold theme
 */

import { Platform } from 'react-native';

// Core Design System Colors
export const DesignTokens = {
  // Backgrounds
  background: {
    primary: '#0F172A',      // Deep Anthracite / Midnight Blue
    secondary: '#020617',    // Darker variant
    surface: '#1E293B',      // Lighter Midnight for cards
  },
  
  // Accents
  accent: {
    gold: '#D4AF37',         // Divine Gold - CTAs and progress
    teal: '#14B8A6',         // Serene Teal - calming elements
    emerald: '#10B981',      // Emerald variant
  },
  
  // Text
  text: {
    heading: '#F8FAFC',      // Off-White / Cream
    body: '#94A3B8',         // Soft Grey
    muted: '#64748B',        // Even softer grey
  },
  
  // Borders & Overlays
  border: {
    subtle: 'rgba(255,255,255,0.05)',
    light: 'rgba(255,255,255,0.1)',
  },
  
  // Gradients (for LinearGradient)
  gradients: {
    midnight: ['#0F172A', '#020617'],
    dusk: ['#1E293B', '#0F172A'],
    dawn: ['#1E3A5F', '#0F172A'],
  },
};

// Spacing Scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 9999,
};

// Legacy Colors export for compatibility
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: DesignTokens.text.heading,
    background: DesignTokens.background.primary,
    tint: DesignTokens.accent.gold,
    icon: DesignTokens.text.body,
    tabIconDefault: DesignTokens.text.body,
    tabIconSelected: DesignTokens.accent.gold,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'system-ui',
    mono: 'Menlo',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
  },
});
