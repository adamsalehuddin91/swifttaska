'use client'

import { Search, Bell } from 'lucide-react'

interface TopBarProps {
  title?: string
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <div className="flex items-center gap-4 h-16 px-6 bg-white border-b border-slate-100 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pelajar, penjaga, dan lain-lain..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">Admin Taska</p>
            <p className="text-xs text-slate-400 leading-tight">Portal Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
