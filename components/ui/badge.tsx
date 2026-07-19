import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#FFB6D6] text-[#3A3A3A]',
        pink: 'bg-[#FFB6D6] text-[#3A3A3A]',
        lilac: 'bg-[#E8B4F0] text-[#3A3A3A]',
        blue: 'bg-[#BDE1FF] text-[#3A3A3A]',
        mint: 'bg-[#C6F4E9] text-[#3A3A3A]',
        yellow: 'bg-[#FFF3B0] text-[#3A3A3A]',
        outline: 'border border-[#FFB6D6] text-[#3A3A3A] bg-transparent',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-red-100 text-red-700',
        gray: 'bg-gray-100 text-gray-600',
        spotlight: 'bg-gradient-to-r from-[#FFF3B0] to-[#FFB6D6] text-[#3A3A3A]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
