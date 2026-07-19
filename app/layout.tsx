import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { ConditionalNav } from '@/components/layout/conditional-nav'
import { ConditionalFooter } from '@/components/layout/conditional-footer'
import { Toaster } from '@/components/ui/toaster'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Beyond The Skin Project',
    template: '%s | Beyond The Skin Project',
  },
  description:
    'A digital safe space for teenage girls to share stories, learn, inspire one another, and discover that beauty goes beyond the skin.',
  keywords: ['teenage girls', 'confidence', 'skin care', 'self love', 'stories'],
  openGraph: {
    type: 'website',
    siteName: 'Beyond The Skin Project',
    title: 'Beyond The Skin Project',
    description: 'Every girl deserves to be seen beyond her skin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beyond The Skin Project',
    description: 'Every girl deserves to be seen beyond her skin.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${dmSans.variable} antialiased bg-[#FDFAF5] text-[#1A1A1A]`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ConditionalNav />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <ConditionalFooter />
        <Toaster />
      </body>
    </html>
  )
}
