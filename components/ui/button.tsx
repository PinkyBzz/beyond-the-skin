'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB6D6] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[#FFB6D6] text-[#3A3A3A] shadow-sm hover:bg-[#f9a0c8] hover:shadow-md active:scale-95',
        primary:
          'bg-[#E8B4F0] text-[#3A3A3A] shadow-sm hover:bg-[#dca6e8] hover:shadow-md active:scale-95',
        secondary:
          'bg-[#BDE1FF] text-[#3A3A3A] shadow-sm hover:bg-[#a8d4f5] hover:shadow-md active:scale-95',
        outline:
          'border-2 border-[#FFB6D6] bg-transparent text-[#3A3A3A] hover:bg-[#FFE9F1] active:scale-95',
        ghost: 'text-[#3A3A3A] hover:bg-[#FFE9F1] active:scale-95',
        destructive: 'bg-red-400 text-white hover:bg-red-500 active:scale-95',
        soft: 'bg-[#FFF3B0] text-[#3A3A3A] hover:bg-[#ffeea0] active:scale-95',
        link: 'text-[#E8B4F0] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-4 text-xs',
        default: 'h-10 px-6 py-2',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
