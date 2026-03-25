import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ARIA - Agent Council for Art Advisory',
  description: 'Multi-agent AI advisory platform for serious collectors',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
