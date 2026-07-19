'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section aria-label="Hero" className="relative min-h-screen bg-[#FDF9F3] pt-16 overflow-hidden">
      {/* Organic Blob Backgrounds */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -right-24 h-96 w-96 blob-shape-1 bg-gradient-to-br from-[#E85D75]/20 to-[#B16FB5]/20 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          rotate: [0, -2, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] blob-shape-2 bg-gradient-to-tr from-[#F4C244]/20 to-[#63A8E0]/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Decorative elements */}
      <div
        className="absolute right-8 top-40 select-none pointer-events-none"
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: 'clamp(180px, 32vw, 480px)',
          fontWeight: 900,
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '2px rgba(232, 93, 117, 0.12)',
          letterSpacing: '-0.05em',
        }}
      >
        ❤
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-64px)]">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="py-20 lg:py-0"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-12 bg-gradient-to-r from-[#E85D75] to-[#B16FB5]" aria-hidden="true" />
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-xs font-bold tracking-[0.2em] uppercase text-[#E85D75]"
              >
                A safe space for everyone
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="text-[clamp(3.2rem,7vw,6rem)] font-black leading-[0.98] tracking-tighter text-[#161616] text-shadow-soft"
            >
              Beyond
              <br />
              <em className="not-italic text-gradient-primary">The Skin</em>
              <br />
              Project
            </h1>

            {/* Tagline */}
            <p
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="mt-10 text-xl text-[#3F3F3F] leading-relaxed max-w-lg"
            >
              Everyone deserves to be seen beyond their skin. Share your story,
              find strength in others, and discover that real beauty lives within.
            </p>

            {/* CTA row */}
            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Link
                href="/share"
                className="group inline-flex items-center gap-3 rounded-full bg-[#161616] px-9 py-4.5 text-sm font-bold text-white hover:bg-[#E85D75] transition-all duration-300 organic-shadow"
              >
                Share Your Story
                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/stories"
                className="inline-flex items-center gap-3 text-sm font-bold text-[#161616] border-b-3 border-[#161616] pb-1 hover:border-[#E85D75] hover:text-[#E85D75] transition-all duration-300"
              >
                Read Stories
              </Link>
            </div>
          </motion.div>

          {/* Right — editorial visual */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            {/* Main card */}
            <div className="relative w-80 xl:w-[26rem]">
              {/* Big card */}
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="blob-shape-1 bg-gradient-to-br from-[#E85D75] to-[#B16FB5] p-10 text-white organic-shadow"
              >
                <div className="text-xs font-bold tracking-[0.2em] uppercase opacity-80 mb-5 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Story of the Week
                </div>
                <h2
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  className="text-3xl font-extrabold leading-tight mb-6"
                >
                  &ldquo;I learned that my skin
                  does not define my worth.&rdquo;
                </h2>
                <div className="h-px bg-white/40 my-5" />
                <div className="flex items-center justify-between text-xs opacity-80">
                  <span className="font-semibold">Personal Growth</span>
                  <span className="font-semibold">3 min read</span>
                </div>
              </motion.div>

              {/* Floating tag */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-8 bg-white rounded-2xl shadow-xl px-5 py-4 border border-black/5"
              >
                <div className="text-xs font-bold text-[#161616] flex items-center gap-2">
                  Self Confidence
                  <Sparkles className="h-4 w-4 text-[#F4C244]" />
                </div>
              </motion.div>

              {/* Bottom card */}
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                className="absolute -bottom-8 -left-10 bg-white rounded-2xl shadow-xl p-5 w-52 border border-black/5"
              >
                <div className="text-[10px] font-bold text-[#787878] uppercase tracking-[0.15em] mb-2">
                  Community
                </div>
                <div className="text-base font-bold text-[#161616]">
                  1,200+ girls have read this
                </div>
              </motion.div>

              {/* Decorative blobs */}
              <div className="absolute -z-10 -bottom-16 -right-16 h-48 w-48 blob-shape-3 bg-gradient-to-tr from-[#F4C244]/30 to-[#4BBF9D]/30 blur-xl" />
              <div className="absolute -z-10 top-10 -left-12 h-32 w-32 blob-shape-2 bg-gradient-to-br from-[#63A8E0]/30 to-[#B16FB5]/30 blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Admin login — bottom right */}
      <div className="absolute bottom-6 right-6">
        <a
          href="/admin/login"
          className="flex items-center gap-2 rounded-full border border-[#161616]/10 bg-white/90 backdrop-blur-md px-4 py-2 text-[11px] font-semibold text-[#787878] hover:text-[#161616] hover:border-[#E85D75]/30 transition-all"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Admin
        </a>
      </div>
    </section>
  )
}
