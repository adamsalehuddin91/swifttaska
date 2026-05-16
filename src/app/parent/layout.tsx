'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarCheck, MessageSquare, Receipt, User } from 'lucide-react'

const navItems = [
  { href: '/parent',           label: 'Utama',     icon: Home,          exact: true },
  { href: '/parent/kehadiran', label: 'Kehadiran', icon: CalendarCheck, exact: false },
  { href: '/parent/aktiviti',  label: 'Aktiviti',  icon: MessageSquare, exact: false },
  { href: '/parent/yuran',     label: 'Yuran',     icon: Receipt,       exact: false },
  { href: '/parent/profil',    label: 'Profil',    icon: User,          exact: false },
]

export default function ParentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-sm mx-auto relative">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-sm font-bold text-slate-900">SwiftApps</span>
          <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">Taska Standard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold">H</div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-800">Haj, Puan Hafizah</p>
            <p className="text-[10px] text-slate-400">Portal Penjaga</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-slate-100 flex z-10">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5">
              <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-blue-600" />}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
