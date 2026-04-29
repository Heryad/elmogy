import type { Metadata, Viewport } from 'next'
import { DM_Sans, JetBrains_Mono, Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { WhatsAppBubble } from '@/components/whatsapp-bubble'
import { StoreProvider } from '@/lib/store-context'
import { LanguageWrapper } from '@/components/language-wrapper'
import { CartSidebar } from '@/components/cart-sidebar'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700']
})

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700']
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500']
})

export const metadata: Metadata = {
  title: 'Elmougy | Premium Mobile Wholesale',
  description: 'Your trusted wholesale partner for premium mobile devices. Best prices on iPhone, Samsung, and more.',
}

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${dmSans.variable} ${cairo.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <StoreProvider>
          <LanguageWrapper>
            {children}
            <CartSidebar />
            <WhatsAppBubble />
          </LanguageWrapper>
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
