import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #FFF3B0 0%, #FFE9F1 50%, #F3EDFF 100%)' }}
    >
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-[#FFB6D6]/40 leading-none mb-2" aria-hidden="true">
          404
        </div>
        <div className="text-5xl mb-6" aria-hidden="true">🌸</div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Page Not Found</h1>
        <p className="mt-3 text-[#3A3A3A]/65 leading-relaxed">
          This page seems to have wandered off. But every story still has a home here.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="default" size="lg">
            <Link href="/">
              <Heart className="h-4 w-4" fill="currentColor" aria-hidden="true" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/stories">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Read Stories
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
