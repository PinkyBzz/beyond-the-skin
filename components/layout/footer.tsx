import React from 'react'
import Link from 'next/link'
import { Heart, Mail, Lock } from 'lucide-react'

const footerLinks = {
  explore: [
    { href: '/stories', label: 'Behind Every Smile' },
    { href: '/articles', label: 'Beauty & Beyond' },
    { href: '/changemaker', label: 'Confidence Changemaker' },
    { href: '/search', label: 'Search' },
  ],
  participate: [
    { href: '/share', label: 'Share Your Story' },
    { href: '/articles/skin-talk', label: 'Skin Talk' },
    { href: '/articles/girl-talk', label: 'Girl Talk' },
    { href: "/articles/creators-corner", label: "Creator's Corner" },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#FFF8E6] border-t border-[#FFB6D6]/20" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 w-fit" aria-label="Beyond The Skin Project">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB6D6] to-[#E8B4F0]">
                  <Heart className="h-4 w-4 text-white" fill="white" aria-hidden="true" />
                </div>
                <span className="font-bold text-lg text-[#3A3A3A]">
                  Beyond <span className="text-[#E8B4F0]">The Skin</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm text-[#3A3A3A]/70 leading-relaxed">
                A digital safe space dedicated to teenage girls — helping them share experiences,
                learn, inspire one another, and remember that beauty goes beyond the skin.
              </p>
              <p className="mt-3 text-sm font-medium text-[#E8B4F0] italic">
                &quot;Every girl deserves to be seen beyond her skin.&quot;
              </p>
              {/* Social links */}
              <div className="mt-6 flex gap-3">
                <a
                  href="https://instagram.com"
                  aria-label="Follow us on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE9F1] text-[#3A3A3A]/60 hover:bg-[#FFB6D6] hover:text-[#3A3A3A] transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a
                  href="mailto:hello@beyondtheskin.id"
                  aria-label="Send us an email"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE9F1] text-[#3A3A3A]/60 hover:bg-[#FFB6D6] hover:text-[#3A3A3A] transition-colors"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Explore links */}
            <nav aria-label="Explore footer navigation">
              <h3 className="text-sm font-semibold text-[#3A3A3A] uppercase tracking-wide">
                Explore
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                {footerLinks.explore.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#3A3A3A]/60 hover:text-[#3A3A3A] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Participate links */}
            <nav aria-label="Participate footer navigation">
              <h3 className="text-sm font-semibold text-[#3A3A3A] uppercase tracking-wide">
                Participate
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                {footerLinks.participate.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#3A3A3A]/60 hover:text-[#3A3A3A] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#FFB6D6]/20 py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-[#3A3A3A]/50">
              &copy; {currentYear} Beyond The Skin Project. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-1 text-xs text-[#3A3A3A]/50">
                Made with <Heart className="h-3 w-3 text-[#FFB6D6]" fill="#FFB6D6" aria-hidden="true" /> for every girl
              </p>
              <Link
                href="/admin/login"
                className="flex items-center gap-1 text-xs text-[#3A3A3A]/40 hover:text-[#FFB6D6] transition-colors"
                aria-label="Admin login"
              >
                <Lock className="h-3 w-3" aria-hidden="true" />
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
