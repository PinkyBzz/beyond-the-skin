'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './footer'

/**
 * Renders the public Footer only on non-admin pages.
 */
export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <Footer />
}
