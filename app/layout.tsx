import type { Metadata, Viewport } from 'next'
import { fontVariables } from '@/lib/fonts'
import { BootScript } from '@/components/boot-script'
import { Providers } from '@/components/providers'
import { Mesh } from '@/components/ui'
import './globals.css'

export const metadata: Metadata = {
  title: 'نُقوش — موقعك الشخصي بعشر دقايق',
  description:
    'اعمل موقعك الشخصي بالعربي من غير خبرة ومن غير حساب. عبّي نموذج واحد واحصل على رابط دائم.',
  applicationName: 'نُقوش',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never disable zoom.
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Arabic is the source language, so rtl/ar is the served default.
    // The toggle rewrites both attributes; suppressHydrationWarning covers the
    // boot script having already done so from localStorage.
    <html lang="ar" dir="rtl" className={fontVariables} suppressHydrationWarning>
      <body>
        <BootScript />
        <Mesh />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
