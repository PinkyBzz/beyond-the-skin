'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Heart,
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  Sparkles,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/stories', label: 'Stories', icon: BookOpen },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { href: '/admin/spotlight', label: 'Spotlight', icon: Sparkles },
  { href: '/admin/changemaker', label: 'Changemaker', icon: Trophy },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function NavItem({
  item,
  pathname,
  onClick,
}: {
  item: (typeof navItems)[0]
  pathname: string
  onClick?: () => void
}) {
  const Icon = item.icon
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          isActive
            ? 'bg-[#FFB6D6] text-[#3A3A3A] shadow-sm'
            : 'text-[#3A3A3A]/60 hover:bg-[#FFE9F1] hover:text-[#3A3A3A]'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {item.label}
      </Link>
    </li>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <nav className="flex h-full flex-col" aria-label="Admin navigation">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB6D6] to-[#E8B4F0]">
          <Heart className="h-4 w-4 text-white" fill="white" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-black text-sm text-[#3A3A3A] leading-tight truncate">Beyond The Skin</p>
          <p className="text-[10px] text-[#3A3A3A]/50 leading-tight">Admin Panel</p>
        </div>
      </div>

      <div className="mx-4 h-px bg-[#FFB6D6]/20 mb-4" />

      {/* Nav links */}
      <ul className="flex-1 space-y-1 px-3 overflow-y-auto" role="list">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </ul>

      {/* Logout */}
      <div className="p-3 border-t border-[#FFB6D6]/20">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#3A3A3A]/60 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-[#FFB6D6]/20 bg-white shadow-sm lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-[#FFB6D6]/20 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5 text-[#3A3A3A]" aria-hidden="true" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl lg:hidden"
              aria-label="Mobile navigation"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-[#FFE9F1]"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
