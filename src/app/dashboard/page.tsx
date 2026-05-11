'use client'

import Link from 'next/link'
import { Users, CalendarCheck, MessageSquare, CreditCard, Plus, ClipboardList, Bell, Receipt, TrendingUp, TrendingDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const attendanceData = [
  { hari: 'Isn', hadir: 38, absent: 4 },
  { hari: 'Sel', hadir: 40, absent: 2 },
  { hari: 'Rab', hadir: 35, absent: 7 },
  { hari: 'Kha', hadir: 42, absent: 0 },
  { hari: 'Jum', hadir: 39, absent: 3 },
]

const recentUpdates = [
  { name: 'Nur Alia bt Hafiz',     kelas: 'Kelas Ceria',    masa: '10:30 AM', avatar: 'N', color: 'bg-pink-500' },
  { name: 'Muhammad Harif',        kelas: 'Kelas Pelangi',  masa: '10:15 AM', avatar: 'M', color: 'bg-blue-500' },
  { name: 'Qaisara Insyirah',      kelas: 'Kelas Matahari', masa: '09:50 AM', avatar: 'Q', color: 'bg-purple-500' },
  { name: 'Arif Danial',           kelas: 'Kelas Ceria',    masa: '09:30 AM', avatar: 'A', color: 'bg-emerald-500' },
  { name: 'Sara Safiyya',          kelas: 'Kelas Pelangi',  masa: '09:10 AM', avatar: 'S', color: 'bg-orange-500' },
]

const announcements = [
  { title: 'Cuti Umum Hari Wesak',          date: '25 Mei 2024',  type: 'Jadual',   color: 'bg-blue-100 text-blue-700' },
  { title: 'Program Pemeriksaan Kesihatan', date: '28 Mei 2024',  type: 'Aktiviti', color: 'bg-green-100 text-green-700' },
  { title: 'Peringatan Bayaran Yuran Jun',  date: '30 Mei 2024',  type: 'Yuran',    color: 'bg-orange-100 text-orange-700' },
]

const statCards = [
  {
    label: 'Jumlah Pelajar',
    value: '42',
    sub: 'Memenuhi kapasiti kelas',
    icon: Users,
    gradient: 'from-blue-500 to-blue-600',
    href: '/dashboard/pelajar',
  },
  {
    label: 'Hadir Hari Ini',
    value: '34',
    sub: '80% kadar kehadiran',
    icon: CalendarCheck,
    gradient: 'from-emerald-400 to-emerald-600',
    href: '/dashboard/kehadiran',
    progress: 80,
  },
  {
    label: 'Parent Update Hari Ini',
    value: '18',
    sub: 'Dikongsikan kepada penjaga',
    icon: MessageSquare,
    gradient: 'from-orange-400 to-orange-500',
    href: '/dashboard/parent-update',
  },
  {
    label: 'Yuran & Resit',
    value: 'RM 14,560.00',
    sub: 'Kutipan bulan ini',
    icon: CreditCard,
    gradient: 'from-violet-500 to-violet-600',
    href: '/dashboard/yuran',
  },
]

const quickActions = [
  { label: 'Tambah Pelajar',   href: '/dashboard/pelajar/tambah', icon: Plus,         color: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { label: 'Rekod Kehadiran',  href: '/dashboard/kehadiran',       icon: CalendarCheck, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  { label: 'Buat Update',      href: '/dashboard/parent-update',   icon: MessageSquare, color: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { label: 'Jana Resit',       href: '/dashboard/yuran',           icon: Receipt,       color: 'bg-violet-600 hover:bg-violet-700 text-white' },
]

const statusHariIni = [
  { label: 'Hadir',       count: 32, color: 'bg-emerald-500', pct: '76%' },
  { label: 'Tidak Hadir', count: 28, color: 'bg-rose-400',    pct: '7%' },
  { label: 'Trial',       count: 30, color: 'bg-blue-400',    pct: '17%' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Ringkasan operasi taska hari ini</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, gradient, href, progress }) => (
          <Link key={label} href={href} className="block group">
            <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <TrendingUp size={14} className="text-white/60 mt-1" />
              </div>
              <p className="text-2xl font-bold leading-tight">{value}</p>
              <p className="text-white/90 text-xs font-semibold mt-1">{label}</p>
              <p className="text-white/60 text-[11px] mt-0.5">{sub}</p>
              {progress !== undefined && (
                <div className="mt-3">
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/70 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tindakan Pantas</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link key={label} href={href}>
              <button className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${color}`}>
                <Icon size={16} />
                {label}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Chart + Status */}
        <div className="lg:col-span-2 space-y-4">
          {/* Attendance Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Ringkasan Kehadiran Mingguan</h3>
                <p className="text-xs text-slate-400">Minggu ini</p>
              </div>
              <select className="text-xs text-slate-500 border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none">
                <option>Minggu ini</option>
                <option>Minggu lepas</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={attendanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hari" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="hadir" stroke="#3B82F6" strokeWidth={2} fill="url(#colorHadir)" dot={{ r: 3, fill: '#3B82F6' }} />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">79.4%</span>
              <span>Purata Kehadiran Mingguan</span>
              <span className="text-emerald-500 ml-1">↑ 2.6% berbanding minggu lalu</span>
            </div>
          </div>

          {/* Status Hari Ini */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Status Hari Ini</h3>
              <Link href="/dashboard/kehadiran" className="text-xs text-blue-600 font-medium">Lihat Semua</Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {statusHariIni.map(({ label, count, color, pct }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-slate-50">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white font-bold text-sm">{count}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{pct}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Updates + Announcements */}
        <div className="space-y-4">
          {/* Parent Update Terkini */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <h3 className="text-sm font-semibold text-slate-900">Parent Update Terkini</h3>
              <Link href="/dashboard/parent-update" className="text-xs text-blue-600 font-medium">Lihat Semua</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentUpdates.map((u, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-8 h-8 rounded-full ${u.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {u.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.kelas}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{u.masa}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pengumuman Terkini */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <h3 className="text-sm font-semibold text-slate-900">Pengumuman Terkini</h3>
              <Link href="/dashboard/pengumuman" className="text-xs text-blue-600 font-medium">Lihat Semua</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {announcements.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${a.color}`}>
                    {a.type}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-snug">{a.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
