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
      'Girls leave supportive messages. Your story creates ripples of comfort and connection.',
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
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-28 lg:h-36">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C347.52,33.8,400,59.55,457.3,72.87c52.6,12,103.73,10.85,157.35-1.14C669.15,60.09,723.82,41,783.55,34.13c59.73-6.87,119.47,3.44,168.89,23.62,49.42,20.18,98.84,48.39,166.78,57.48,67.94,9.09,144.52-9.87,200.32-43.23C1165.51,51.75,1182.75,26,1200,0V0H0Z" 
            fill="#161616"
          />
        </svg>
      </div>
      
      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-28 lg:h-36">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#FFE9F1"
          />
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
