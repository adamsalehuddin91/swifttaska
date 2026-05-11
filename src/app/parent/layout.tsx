import type { ReactNode } from 'react'
import Link from 'next/link'
import { Home, CalendarCheck, MessageSquare, Receipt, User } from 'lucide-react'

const navItems = [
  { href: '/parent',               label: 'Utama',     icon: Home },
  { href: '/parent/kehadiran',     label: 'Kehadiran', icon: CalendarCheck },
  { href: '/parent/aktiviti',      label: 'Aktiviti',  icon: MessageSquare },
  { href: '/parent/yuran',         label: 'Yuran',     icon: Receipt },
  { href: '/parent/profil',        label: 'Profil',    icon: User },
]

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-sm mx-auto relative">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-sm font-bold text-slate-900">SwiftApps</span>
          <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">Taska Standard Package</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-800">Haj, Puan Aisyah</p>
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
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5">
            <Icon size={20} className="text-slate-400" />
            <span className="text-[10px] text-slate-400 font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
