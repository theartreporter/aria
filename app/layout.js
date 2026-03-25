import './globals.css'

export const metadata = {
  title: 'ARIA — Agent Council',
  description: 'AI-powered art advisory platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
