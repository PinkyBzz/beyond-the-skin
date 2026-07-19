import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#3A3A3A]"
          >
            {label}
            {props.required && <span className="ml-1 text-[#FFB6D6]" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-[#FFB6D6]/50 bg-white px-4 py-2 text-sm text-[#3A3A3A] shadow-sm transition-all',
            'placeholder:text-[#3A3A3A]/40',
            'focus:border-[#E8B4F0] focus:outline-none focus:ring-2 focus:ring-[#E8B4F0]/30',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-200',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[#3A3A3A]/60">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
