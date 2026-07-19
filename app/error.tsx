'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #FFF3B0 0%, #FFE9F1 50%, #F3EDFF 100%)' }}
    >
      <div className="text-center max-w-md">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
          <AlertCircle className="h-8 w-8 text-[#FFB6D6]" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Something went wrong</h1>
        <p className="mt-3 text-[#3A3A3A]/65 leading-relaxed">
          We ran into an unexpected error. Please try again or return home.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} variant="default" size="lg" className="gap-2">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
