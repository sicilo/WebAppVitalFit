import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Primary color: #2dabe3
// Eigengrau (dark mode background): #16161d

export const VitalFitPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e6f6fc',
      100: '#b3e4f7',
      200: '#80d2f1',
      300: '#4dc0ec',
      400: '#2dabe3',
      500: '#2dabe3',
      600: '#2899cc',
      700: '#2387b4',
      800: '#1e759c',
      900: '#145272',
      950: '#0a2939',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      dark: {
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.900}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e2028', // Slightly lighter than eigengrau for cards
          900: '#16161d', // Eigengrau
          950: '#0d0d12', // Darker than eigengrau
        },
      },
    },
  },
});
