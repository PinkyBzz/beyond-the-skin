'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { adminLoginSchema, type AdminLoginSchema } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginSchema>({
    resolver: zodResolver(adminLoginSchema),
  })

  const onSubmit = async (data: AdminLoginSchema) => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast({
        variant: 'error',
        title: 'Login failed',
        description: 'Invalid email or password.',
      })
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Email"
        type="email"
        required
        placeholder="admin@beyondtheskin.id"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          placeholder="••••••••"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-[#3A3A3A]/40 hover:text-[#3A3A3A] transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <Button
        type="submit"
        variant="default"
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
}
