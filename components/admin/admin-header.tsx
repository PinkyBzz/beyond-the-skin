'use client'

import React from 'react'
import { Bell } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#FFB6D6]/20 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      <div className="lg:hidden" aria-hidden="true" />

      <div className="flex items-center gap-3 ml-auto">
        <button
          aria-label="View notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#3A3A3A]/50 hover:bg-[#FFE9F1] hover:text-[#3A3A3A] transition-colors"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FFB6D6] to-[#E8B4F0] flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
          A
        </div>
      </div>
    </header>
  )
}
