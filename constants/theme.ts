/**
 * Hushu Design System - "Midnight Sanctuary" Theme v2
 * Calm, Sacred, Modern — A quiet sanctuary at night
 * 
 * PRIME DIRECTIVE: If a design choice feels expressive, decorative, or loud — remove it.
 * Calm comes from restraint, not creativity.
 */

import { Platform } from 'react-native';

// Core Design System Colors - Midnight Sanctuary Theme
export const DesignTokens = {
  // Backgrounds - SOLID COLORS ONLY (NO GRADIENTS EVER)
  // Use ONE background color per screen. Do not mix.
  background: {
    primary: '#020617',      // Slate 950 - Near-black - PRIMARY screen background
    secondary: '#0F172A',    // Slate 900 - Alternative screen background
    surface: '#111827',      // Primary Surface - Cards (emerges gently from bg)
    surfaceAlt: '#162021',   // Secondary Surface - Alternative card bg
  },
  
  // Accents - SACRED, RITUAL USE ONLY
  // These appear only at moments of meaning
  accent: {
    // Primary Ritual Accent - Creased Khaki
    // ONLY for: Primary CTA, completion moments, commitment states
    // NEVER for: Decoration, large quantities
    primary: '#F8D794',
    
    // Structural Accent - Deep Emerald
    // ONLY for: Selected card borders, progress indicators, active nav
    emerald: '#284139',
    
    // Warm Accent - Earth Ember (EXTREMELY RARE)
    // ONLY for: Emotional warmth, anxiety/sadness guidance
    // NEVER in: Standard flows
    earth: '#BB6830',
  },
  
  // Text - Silence First
  text: {
    heading: '#F8FAFC',      // Off-White / Cream - Serif headings
    body: '#94A3B8',         // Soft Grey - Body text
    muted: '#64748B',        // Even softer grey - Metadata, labels
    onPrimary: '#111A19',    // Text on primary buttons (dark)
  },
  
  // Borders - Low Contrast by Default
  // "If you can clearly see the card edge, it is too strong."
  border: {
    subtle: 'rgba(255,255,255,0.04)',   // Default border - barely visible
    light: 'rgba(255,255,255,0.12)',    // Ghost button borders
    selected: '#284139',                 // Emerald for selected states (thin)
  },
  
  // Legacy mappings for backward compatibility
  gold: '#F8D794',           // Now Creased Khaki (Primary Ritual Accent)
  teal: '#284139',           // Now Deep Emerald (Structural Accent)
};

// Spacing Scale - Use space generously. Silence is created through emptiness.
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius - Cards should feel soft and heavy, not sharp or floating
export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,     // Default for cards (16-24px recommended)
  full: 9999, // For badges, buttons
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
    tint: DesignTokens.accent.primary,
    icon: DesignTokens.text.body,
    tabIconDefault: DesignTokens.text.muted,
    tabIconSelected: DesignTokens.accent.primary,
  },
};

// Font System - Reading Is Sacred
// Headings: Serif (Playfair Display / Lora) - used sparingly, large, calm
// Body: Sans-serif (Inter / Nunito) - optimized for long reading
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
