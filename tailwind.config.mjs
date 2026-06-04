/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1B3A6B',
          light: '#2A558C',
          dark: '#0F2440',
        },
        accent: {
          DEFAULT: '#EE352F',
          dark: '#B2302C',
        },
        success: {
          DEFAULT: '#3BC958',
          dark: '#1F8634',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F5F5F8',
        },
        muted: '#4A6FA5',
        danger: {
          DEFAULT: '#B2302C',
          bg: '#FCE8E8',
        },
        warning: {
          DEFAULT: '#EE352F',
          bg: '#FFF5E6',
        },
        info: {
          DEFAULT: '#4A6FA5',
          bg: '#E8EEF7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
};
