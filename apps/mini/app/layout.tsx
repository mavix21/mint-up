import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mini',
  description: 'Mini',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
