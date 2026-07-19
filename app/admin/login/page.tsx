import type { Metadata } from 'next'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #FFF3B0 0%, #FFE9F1 50%, #F3EDFF 100%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB6D6] to-[#E8B4F0] shadow-lg mb-4">
            <Heart className="h-7 w-7 text-white" fill="white" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-black text-[#3A3A3A]">Beyond The Skin</h1>
          <p className="text-sm text-[#3A3A3A]/50 mt-1">Admin Dashboard</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl border border-[#FFB6D6]/20">
          <h2 className="text-lg font-bold text-[#3A3A3A] mb-6">Sign In</h2>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}
