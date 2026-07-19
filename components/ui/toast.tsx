'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitive.Provider
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border-[#FFB6D6]/30 bg-white text-[#3A3A3A]',
        success: 'border-green-200 bg-green-50 text-green-800',
        error: 'border-red-200 bg-red-50 text-red-800',
        info: 'border-[#BDE1FF] bg-[#E6F3FF] text-[#3A3A3A]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitive.Root.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-full p-1 text-[#3A3A3A]/40 hover:text-[#3A3A3A] focus:outline-none focus:ring-1 focus:ring-[#FFB6D6]',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
    <span className="sr-only">Close</span>
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-xs opacity-80', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastPrimitive.Action>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
}

// Icons for variants
export const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  default: Info,
}
