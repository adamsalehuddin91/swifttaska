'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarCheck, MessageSquare, Receipt, User, ChevronDown, Check } from 'lucide-react'
import { ChildProvider, useChild } from './child-context'

const navItems = [
  { href: '/parent',           label: 'Utama',     icon: Home,          exact: true },
  { href: '/parent/kehadiran', label: 'Kehadiran', icon: CalendarCheck, exact: false },
  { href: '/parent/aktiviti',  label: 'Aktiviti',  icon: MessageSquare, exact: false },
  { href: '/parent/yuran',     label: 'Yuran',     icon: Receipt,       exact: false },
  { href: '/parent/profil',    label: 'Profil',    icon: User,          exact: false },
]

function ChildSwitcher() {
  const { children, activeChild, setActiveChild } = useChild()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => children.length > 1 && setOpen(o => !o)}
        className="flex items-center gap-2"
      >
        <div className={`w-7 h-7 rounded-full ${activeChild.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {activeChild.avatar}
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
            {activeChild.name}
            {children.length > 1 && (
              <ChevronDown size={11} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            )}
          </p>
          <p className="text-[10px] text-slate-400 leading-tight">Portal Penjaga</p>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-30 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden w-52">
            <p className="text-[10px] font-bold text-slate-400 px-4 pt-3 pb-1 tracking-wide">TUKAR ANAK</p>
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => { setActiveChild(child); setOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${child.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {child.avatar}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{child.name}</p>
                  <p className="text-[10px] text-slate-400">{child.kelas} · {child.umur}</p>
                </div>
                {activeChild.id === child.id && <Check size={14} className="text-blue-600 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ParentLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full relative">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">SwiftApps</span>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-semibold ml-1.5">Taska Standard</span>
          </div>
        </div>
        <ChildSwitcher />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-slate-100 flex z-10">
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

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <ChildProvider>
      <ParentLayoutInner>{children}</ParentLayoutInner>
    </ChildProvider>
  )
}
