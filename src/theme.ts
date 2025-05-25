import { extendTheme } from '@chakra-ui/react'

// 参考サイト（https://10th-anniversary.manga-one.com/top）を参考にカラーテーマとフォントを定義
const theme = extendTheme({
  colors: {
    // 例：参考サイトのキーカラーに近い色を設定
    brand: {
      50: '#ffebee', // 薄い赤系
      100: '#ffcdd2',
      200: '#ef9a9a',
      300: '#e57373',
      400: '#ef5350',
      500: '#f44336', // メインの赤
      600: '#e53935',
      700: '#d32f2f',
      800: '#c62828',
      900: '#b71c1c', // 濃い赤系
    },
    // 必要に応じて他のカラーも定義
  },
  fonts: {
    // 例：参考サイトのフォントに近いフォントを設定
    heading: 'Noto Sans JP, sans-serif',
    body: 'Noto Sans JP, sans-serif',
  },
  styles: {
    global: {
      body: {
        // 背景色など全体的なスタイルを調整
        bg: 'gray.100', // 少し明るい背景色
        color: 'gray.800',
      },
    },
  },
  components: {
    // コンポーネントごとのスタイル調整があればここに追加
  }
})

export default theme 