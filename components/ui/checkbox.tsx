'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded-md border-2 border-[#FFB6D6] bg-white shadow-sm',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B4F0]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-[#FFB6D6] data-[state=checked]:border-[#FFB6D6]',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-white')}>
      <Check className="h-3 w-3 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
