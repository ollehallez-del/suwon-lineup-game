import './globals.css'

export const metadata = {
  title: '수원삼성 선발 예측',
  description: '수원삼성블루윙즈 선발 명단 예측 게임',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
