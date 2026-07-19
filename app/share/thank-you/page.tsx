import type { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Your story has been submitted successfully.',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4"
      style={{ background: 'linear-gradient(135deg, #FFF3B0 0%, #FFE9F1 50%, #F3EDFF 100%)' }}
    >
      <div className="mx-auto max-w-lg text-center">
        {/* Animated heart */}
        <div className="mb-8 flex items-center justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-white/80 shadow-xl flex items-center justify-center">
              <Heart
                className="h-12 w-12 text-[#FFB6D6]"
                fill="#FFB6D6"
                aria-hidden="true"
              />
            </div>
            <div className="absolute -right-1 -top-1 text-2xl animate-bounce">🌸</div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-[#3A3A3A] sm:text-4xl">
          Thank You for Sharing 💕
        </h1>

        <p className="mt-4 text-base text-[#3A3A3A]/70 leading-relaxed">
          Your story has been received and is now in the care of our review team. We will
          read it thoughtfully and with great respect for your experience.
        </p>

        <div className="mt-6 rounded-2xl bg-white/70 p-5 text-left space-y-3">
          <h2 className="text-sm font-bold text-[#3A3A3A]">What happens next?</h2>
          <ol className="space-y-2 text-sm text-[#3A3A3A]/70" role="list">
            <li className="flex gap-2">
              <span className="text-[#FFB6D6] font-bold">1.</span>
              Our team reviews your story with care and sensitivity.
            </li>
            <li className="flex gap-2">
              <span className="text-[#FFB6D6] font-bold">2.</span>
              If approved, your story will be published beautifully — without your personal details.
            </li>
            <li className="flex gap-2">
              <span className="text-[#FFB6D6] font-bold">3.</span>
              Girls around the world will read it and feel less alone. 🌍
            </li>
          </ol>
        </div>

        <p className="mt-6 text-sm font-semibold italic text-[#E8B4F0]">
          &ldquo;Your courage to share is someone else&apos;s reason to stay strong.&rdquo;
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/stories">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              Read Other Stories
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
