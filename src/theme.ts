import { extendTheme } from '@chakra-ui/react'

// オシャレでポップな配色・角丸・フォントを中心にテーマを拡張
const theme = extendTheme({
  colors: {
    brand: {
      50: '#fff1f5',
      100: '#ffe4ec',
      200: '#fecdd8',
      300: '#fda4b8',
      400: '#fb7195',
      500: '#f43f5e', // メイン：ポップなピンク
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
    },
    accent: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
    lemon: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },
  },
  fonts: {
    heading: "'M PLUS Rounded 1c', 'Noto Sans JP', system-ui, -apple-system, sans-serif",
    body: "'M PLUS Rounded 1c', 'Noto Sans JP', system-ui, -apple-system, sans-serif",
  },
  radii: {
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '28px',
  },
  shadows: {
    outline: '0 0 0 3px rgba(244,63,94,0.35)',
    glow: '0 10px 30px rgba(244,63,94,0.25)',
  },
  styles: {
    global: {
      body: {
        color: 'gray.800',
        bg: 'white',
      },
      '::selection': {
        backgroundColor: 'brand.200',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: 'bold',
      },
      variants: {
        pill: {
          bgGradient: 'linear(to-r, brand.400, accent.400)',
          color: 'white',
          boxShadow: 'glow',
          _hover: { filter: 'brightness(1.05)', transform: 'translateY(-2px)' },
          _active: { transform: 'translateY(0px)' },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        textTransform: 'none',
        fontWeight: 'bold',
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: '2xl',
          boxShadow: '2xl',
        },
      },
    },
  },
})

export default theme