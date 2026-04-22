/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep space dark backgrounds
        void:    { 950: '#02040A', 900: '#050810', 800: '#080D1A', 700: '#0D1525', 600: '#111D30', 500: '#172540' },
        // Electric cyan — primary accent
        cyan:    { 300: '#67F0FF', 400: '#22E5FF', 500: '#00CFFF', 600: '#00AEDD', 700: '#0088B0' },
        // Violet — secondary accent
        violet:  { 300: '#B09BFF', 400: '#8F72FF', 500: '#6E3FFF', 600: '#5A2EE0', 700: '#4520C0' },
        // Hot pink — highlight/alert
        pink:    { 300: '#FF85B3', 400: '#FF5593', 500: '#FF2D7B', 600: '#E01A65' },
        // Text
        ink:     { 50: '#F0F4FF', 100: '#E8EDF5', 200: '#C8D3E8', 300: '#8A9BB8', 400: '#5A6E8A', 500: '#3A4D65', 600: '#253347' },
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'aurora':      'aurora 8s ease-in-out infinite alternate',
        'float':       'float 6s ease-in-out infinite',
        'pulse-cyan':  'pulseCyan 2s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'slide-up':    'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'fade-in':     'fadeIn 0.35s ease-out',
        'bounce-dot':  'bounceDot 1.4s ease-in-out infinite',
        'glow-pulse':  'glowPulse 3s ease-in-out infinite',
        'scan-line':   'scanLine 3s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%':   { transform: 'translate(0%, 0%) scale(1)',    opacity: '0.6' },
          '50%':  { transform: 'translate(3%, -3%) scale(1.05)', opacity: '0.8' },
          '100%': { transform: 'translate(-2%, 2%) scale(0.98)', opacity: '0.5' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        pulseCyan: {
          '0%,100%': { boxShadow: '0 0 15px rgba(0,207,255,0.3)' },
          '50%':     { boxShadow: '0 0 35px rgba(0,207,255,0.7)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.96)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        bounceDot: {
          '0%,60%,100%': { transform: 'translateY(0)',    opacity: '0.4' },
          '30%':          { transform: 'translateY(-10px)', opacity: '1' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%':     { opacity: '0.9', transform: 'scale(1.08)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,207,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,207,255,0.03) 1px, transparent 1px)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
