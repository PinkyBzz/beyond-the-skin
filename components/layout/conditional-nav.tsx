'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'

/**
 * Renders the public Navbar only on non-admin pages.
 */
export function ConditionalNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <Navbar />
}
