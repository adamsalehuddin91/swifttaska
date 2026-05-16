'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, UserCheck, CalendarCheck,
  MessageSquare, ClipboardList, CreditCard, Megaphone,
  Settings, HelpCircle, TrendingUp, ChevronRight
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',      href: '/dashboard',             icon: LayoutDashboard },
  { label: 'Pelajar',        href: '/dashboard/pelajar',     icon: Users },
  { label: 'Penjaga',        href: '/dashboard/penjaga',     icon: UserCheck },
  { label: 'Kehadiran',      href: '/dashboard/kehadiran',   icon: CalendarCheck },
  { label: 'Parent Update',  href: '/dashboard/parent-update', icon: MessageSquare },
  { label: 'Rekod Harian',   href: '/dashboard/rekod-harian', icon: ClipboardList },
  { label: 'Yuran & Resit',  href: '/dashboard/yuran',       icon: CreditCard },
  { label: 'Pengumuman',     href: '/dashboard/pengumuman',  icon: Megaphone },
  { label: 'Tetapan',        href: '/dashboard/tetapan',     icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M16 3c2.5 1 4.5 3.5 5 6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M8 8l4 4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-slate-900 font-bold text-base leading-tight">SwiftApps</p>
          <p className="text-slate-400 text-[10px] leading-tight">Taska Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
              {label}
              {isActive && <ChevronRight size={14} className="ml-auto text-blue-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Package Card */}
      <div className="px-3 pb-3 space-y-2">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-blue-200" />
            <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">Pakej Semasa</p>
          </div>
          <p className="font-bold text-sm mb-0.5">Pakej Standard</p>
          <p className="text-blue-200 text-[10px] mb-3">RM 300/bulan · Aktif</p>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
            Naik Taraf Plan
          </button>
        </div>

        <div className="rounded-xl border border-slate-100 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <HelpCircle size={14} className="text-slate-400" />
            <p className="text-xs font-semibold text-slate-700">Perlu Bantuan?</p>
          </div>
          <button className="w-full text-blue-600 hover:text-blue-700 text-xs font-medium py-1.5 px-3 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors">
            Hubungi Sokongan
          </button>
        </div>
      </div>
    </div>
  )
}
