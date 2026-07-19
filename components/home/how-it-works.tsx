'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PenLine, Shield, Globe, MessageCircle } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: PenLine,
    title: 'Write Your Story',
    description:
      'Fill out the story form honestly. Share what you felt, what you learned, and who inspired you.',
    color: '#FFB6D6',
  },
  {
    step: '02',
    icon: Shield,
    title: 'Reviewed with Care',
    description:
      'Our team reviews every story with sensitivity. Your personal information stays private.',
    color: '#E8B4F0',
  },
  {
    step: '03',
    icon: Globe,
    title: 'Published & Celebrated',
    description:
      'Approved stories are beautifully published. You remain anonymous — only your courage shows.',
    color: '#BDE1FF',
  },
  {
    step: '04',
    icon: MessageCircle,
    title: 'Community Responds',
    description:
      'People leave supportive messages. Your story creates ripples of comfort and connection.',
    color: '#C6F4E9',
  },
]

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="py-20 lg:py-28 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #FFF8E6 0%, #FFE9F1 100%)' }}
    >
      {/* Top Wave Divider (from dark to light) */}
      <div className="absolute top-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20 lg:h-28">
          <path 
            d="M0,30 C400,110 800,-10 1200,30 L1200,0 L0,0 Z" 
            fill="#161616"
          />
        </svg>
      </div>
      
      {/* Bottom Wave Divider */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20 lg:h-28">
          <path 
            d="M0,90 C400,130 800,10 1200,90 L1200,120 L0,120 Z" 
            fill="#FFE9F1"
          />
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="how-it-works-heading"
            className="text-3xl font-black text-[#3A3A3A] sm:text-4xl"
          >
            How It{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FFB6D6, #E8B4F0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Works
            </span>
          </h2>
          <p className="mt-4 text-base text-[#3A3A3A]/70 leading-relaxed">
            Sharing your story is simple, safe, and meaningful.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: index * 0.12 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-[calc(50%+2rem)] top-6 hidden h-0.5 w-[calc(100%-4rem)] bg-gradient-to-r from-[#FFB6D6]/40 to-[#E8B4F0]/40 lg:block"
                  />
                )}

                {/* Step number */}
                <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{ backgroundColor: step.color }}
                    aria-hidden="true"
                  />
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: step.color + '40' }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: step.color }}
                      aria-hidden="true"
                    />
                  </div>
                  <span
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-black shadow-sm"
                    style={{ color: step.color }}
                  >
                    {step.step}
                  </span>
                </div>

                <h3 className="font-bold text-[#3A3A3A]">{step.title}</h3>
                <p className="mt-2 text-sm text-[#3A3A3A]/65 leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
