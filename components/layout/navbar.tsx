'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/stories', label: 'Stories' },
  { href: '/articles', label: 'Beauty & Beyond' },
  { href: '/changemaker', label: 'Changemaker' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-400',
          scrolled || isOpen
            ? 'bg-[#FDF9F3]/95 border-b border-black/6 shadow-[0_4px_30px_rgba(0,0,0,0.08)] backdrop-blur-md'
            : 'bg-[#FDF9F3]/80 backdrop-blur-md'
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <nav className="flex h-20 items-center justify-between" aria-label="Main navigation">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E85D75] rounded-xl transition-all"
              aria-label="Beyond The Skin Project"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#E85D75] to-[#B16FB5] shadow-lg"
                aria-hidden="true"
              >
                <span className="text-white text-lg font-extrabold" style={{ fontFamily: 'serif' }}>B</span>
              </motion.div>
              <span
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                className="text-xl font-extrabold text-[#161616] tracking-tight"
              >
                Beyond The Skin
              </span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden lg:flex items-center gap-2" role="list">
              {navLinks.map((link) => (
                <motion.li key={link.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={link.href}
                    className={cn(
                      'px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-300',
                      pathname === link.href || pathname.startsWith(link.href)
                        ? 'text-[#161616] bg-gradient-to-r from-[#E85D75]/10 to-[#B16FB5]/10 border border-[#E85D75]/20'
                        : 'text-[#3F3F3F] hover:text-[#161616] hover:bg-black/5'
                    )}
                    aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/share"
                className="hidden lg:inline-flex items-center gap-2 rounded-full bg-[#161616] px-6 py-3 text-sm font-bold text-white hover:bg-gradient-to-r hover:from-[#E85D75] hover:to-[#B16FB5] transition-all duration-300 shadow-lg"
              >
                Share Story
              </Link>

              {/* Mobile menu toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 transition-colors lg:hidden border border-black/5"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.nav
              id="mobile-nav"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-20 z-40 bg-[#FDF9F3]/98 border-b border-black/6 shadow-xl lg:hidden backdrop-blur-xl"
              aria-label="Mobile navigation"
            >
              <div className="mx-auto max-w-7xl px-6 py-6 space-y-2">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-5 py-4 rounded-2xl text-base font-bold transition-all',
                    pathname === '/' ? 'bg-gradient-to-r from-[#E85D75]/10 to-[#B16FB5]/10 text-[#161616] border border-[#E85D75]/20' : 'text-[#3F3F3F] hover:bg-black/5'
                  )}
                >
                  Home
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-5 py-4 rounded-2xl text-base font-bold transition-all',
                      pathname.startsWith(link.href) ? 'bg-gradient-to-r from-[#E85D75]/10 to-[#B16FB5]/10 text-[#161616] border border-[#E85D75]/20' : 'text-[#3F3F3F] hover:bg-black/5'
                    )}
                    aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 pb-2">
                  <Link
                    href="/share"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#E85D75] to-[#B16FB5] py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl"
                  >
                    Share Your Story
                  </Link>
                </div>
              </div>
            </motion.nav>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-20 z-30 bg-black/12 lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
