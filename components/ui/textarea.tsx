import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[#3A3A3A]"
          >
            {label}
            {props.required && <span className="ml-1 text-[#FFB6D6]" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[120px] w-full rounded-xl border border-[#FFB6D6]/50 bg-white px-4 py-3 text-sm text-[#3A3A3A] shadow-sm transition-all',
            'placeholder:text-[#3A3A3A]/40',
            'focus:border-[#E8B4F0] focus:outline-none focus:ring-2 focus:ring-[#E8B4F0]/30',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            'resize-y',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-200',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-[#3A3A3A]/60">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
