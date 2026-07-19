'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toastIcons,
} from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant = 'default', ...props }) => {
        const Icon = toastIcons[variant]
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="flex-1 space-y-0.5">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
