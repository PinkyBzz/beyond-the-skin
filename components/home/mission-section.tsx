'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock, BookOpen, Users, Sparkles } from 'lucide-react'

const values = [
  { number: '01', title: 'Safe & Confidential', text: 'Every story is reviewed before publishing. Your personal information is never displayed publicly.', icon: <Lock className="h-7 w-7" /> },
  { number: '02', title: 'Curated Storytelling', text: 'Not a social media feed. Every story is thoughtfully read and curated by our team.', icon: <BookOpen className="h-7 w-7" /> },
  { number: '03', title: 'Community Support', text: 'Read supportive messages from the community. Know that you are never alone in your journey.', icon: <Users className="h-7 w-7" /> },
  { number: '04', title: 'Inspire & Be Inspired', text: 'Every story you share could be the light that another girl needs in her darkest moment.', icon: <Sparkles className="h-7 w-7" /> },
]

export function MissionSection() {
  return (
    <section aria-labelledby="mission-heading" className="bg-[#161616] py-28 lg:py-36 overflow-hidden relative">
      {/* Organic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 h-96 w-96 blob-shape-1 bg-gradient-to-br from-[#E85D75]/20 to-[#B16FB5]/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-52 -right-52 h-[24rem] w-[24rem] blob-shape-3 bg-gradient-to-tr from-[#F4C244]/20 to-[#63A8E0]/20 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Top row */}
        <div className="grid lg:grid-cols-2 gap-20 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-[#E85D75] to-[#B16FB5]" aria-hidden="true" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#E85D75]">Our Mission</span>
            </div>
            <h2
              id="mission-heading"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            >
              Beauty goes
              <br />
              <em className="italic text-gradient-primary">beyond the skin.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pt-6"
          >
            <p className="text-[#9F9F9F] text-xl leading-relaxed">
              Beyond The Skin Project exists to remind every teenage girl that her worth
              is not defined by her appearance. We create a space where real stories heal,
              inspire, and connect — one honest voice at a time.
            </p>
            <blockquote className="mt-10 pl-6 border-l-4 border-[#E85D75]">
              <p className="text-white italic text-2xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                &ldquo;When one girl shares her truth, she gives permission to thousands of others to do the same.&rdquo;
              </p>
            </blockquote>
          </motion.div>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-3xl overflow-hidden">
          {values.map((v, i) => (
            <motion.div
              key={v.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ y: -6, backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="bg-[#161616] p-10 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="text-5xl font-extrabold text-white/8" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {v.number}
                </div>
                <div className="text-[#E85D75]">
                  {v.icon}
                </div>
              </div>
              <h3 className="text-white font-bold mb-4 text-xl">{v.title}</h3>
              <p className="text-[#8A8A8A] text-base leading-relaxed">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
