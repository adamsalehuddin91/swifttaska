'use client'

import { CheckCircle, ChevronRight, Bell } from 'lucide-react'
import Link from 'next/link'
import { useChild } from './child-context'

const childData = {
  alia: {
    hadir: true,
    todaySummary: [
      { label: 'Parent Update',  value: 18,       sub: 'Dikongsikan', icon: '💬', color: 'bg-blue-50 text-blue-700' },
      { label: 'Makan & Minum',  value: 'Baik',   sub: '3 kali',      icon: '🍽️', color: 'bg-green-50 text-green-700' },
      { label: 'Tidur',          value: '28 min', sub: 'Nyenyak',     icon: '😴', color: 'bg-violet-50 text-violet-700' },
    ],
    yuranPct: 18.5,
    yuranJumlah: 14560,
    kehadiranHadir: 17,
    kehadiranJumlah: 21,
    updates: [
      { id: 1, masa: '10:30 AM', title: 'Aktiviti Seni & Kraf',      body: 'Alia sangat seronok hari ini! Dia gembira mewarna dan berkreatif bersama rakan.',         tags: ['#Aktiviti', '#Seni & Kraf'], hasPhoto: true },
      { id: 2, masa: '12:45 PM', title: 'Waktu Makan Tengah Hari',   body: 'Alia makan dengan baik hari ini. Habis semua lauk dan minum susu penuh!',                  tags: ['#Makan'],                   hasPhoto: false },
    ],
  },
  haziq: {
    hadir: true,
    todaySummary: [
      { label: 'Parent Update',  value: 12,       sub: 'Dikongsikan', icon: '💬', color: 'bg-blue-50 text-blue-700' },
      { label: 'Makan & Minum',  value: 'Sederhana', sub: '2 kali',   icon: '🍽️', color: 'bg-amber-50 text-amber-700' },
      { label: 'Tidur',          value: '45 min', sub: 'Lena',        icon: '😴', color: 'bg-violet-50 text-violet-700' },
    ],
    yuranPct: 10,
    yuranJumlah: 14000,
    kehadiranHadir: 19,
    kehadiranJumlah: 21,
    updates: [
      { id: 1, masa: '9:00 AM',  title: 'Pagi Berbaris & Doa',       body: 'Haziq ikut serta dalam aktiviti pagi dengan bersemangat dan tertib.',                       tags: ['#Aktiviti', '#Rutin'],      hasPhoto: false },
      { id: 2, masa: '10:30 AM', title: 'Snek Pagi',                  body: 'Haziq makan snek pagi dengan baik. Habis biskut dan minum susu.',                           tags: ['#Makan'],                   hasPhoto: false },
    ],
  },
}

export default function ParentHomePage() {
  const { activeChild } = useChild()
  const data = childData[activeChild.id as keyof typeof childData] ?? childData.alia

  return (
    <div className="space-y-4 p-4">
      {/* Child card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
        <div className={`w-14 h-14 rounded-full ${activeChild.color} flex items-center justify-center text-white text-xl font-bold`}>
          {activeChild.avatar}
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900">{activeChild.name}</p>
          <p className="text-sm text-slate-500">{activeChild.kelas} · {activeChild.umur}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <CheckCircle size={12} className="text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600">
              Kehadiran Hari Ini: {data.hadir ? 'Hadir' : 'Tidak Hadir'}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">18 Mei 2025 (Ahad)</span>
          </div>
        </div>
        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center">
          <Bell size={14} className="text-slate-400" />
        </div>
      </div>

      {/* Today summary */}
      <div className="grid grid-cols-3 gap-2">
        {data.todaySummary.map(({ label, value, sub, icon, color }) => (
          <div key={label} className={`rounded-xl p-3 ${color}`}>
            <span className="text-xl">{icon}</span>
            <p className="text-base font-bold mt-1 leading-tight">{value}</p>
            <p className="text-[10px] font-semibold leading-tight">{label}</p>
            <p className="text-[10px] opacity-70">{sub}</p>
          </div>
        ))}
      </div>

      {/* Yuran terkini */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-slate-900">Yuran Terkini</p>
          <Link href="/parent/yuran" className="text-xs text-blue-600 font-medium">Lihat Semua</Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-slate-900">RM {data.yuranJumlah.toLocaleString()}.00</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">✓ {data.yuranPct}% dibayar</p>
          </div>
          <div className="w-16 h-16 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-200 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-600">{Math.round(data.yuranPct)}%</span>
            </div>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.yuranPct}%` }} />
        </div>
        <button className="w-full mt-3 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
          Lihat Butiran Yuran
        </button>
      </div>

      {/* Kehadiran Bulan Ini */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-900">Kehadiran Bulan Ini</p>
          <span className="text-xs text-slate-400">{data.kehadiranHadir} / {data.kehadiranJumlah} Hari Hadir</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: data.kehadiranJumlah }, (_, i) => (
            <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-semibold ${
              i < data.kehadiranHadir ? 'bg-emerald-500 text-white' :
              i === data.kehadiranHadir ? 'bg-red-400 text-white' :
              'bg-slate-100 text-slate-400'
            }`}>
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Hadir</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Tidak Hadir</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200 inline-block" /> Akan Datang</span>
        </div>
      </div>

      {/* Parent Update Hari Ini */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
          <p className="text-sm font-bold text-slate-900">Parent Update Hari Ini</p>
          <Link href="/parent/aktiviti" className="text-xs text-blue-600 font-medium">Lihat Semua</Link>
        </div>
        <div className="divide-y divide-slate-50">
          {data.updates.map(u => (
            <div key={u.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-900">{u.title}</p>
                <span className="text-[10px] text-slate-400">{u.masa}</span>
              </div>
              {u.hasPhoto && (
                <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl mb-2 flex items-center justify-center">
                  <span className="text-slate-300 text-sm">📷 Foto Aktiviti</span>
                </div>
              )}
              <p className="text-xs text-slate-600 leading-relaxed">{u.body}</p>
              <div className="flex gap-1.5 mt-2">
                {u.tags.map(t => (
                  <span key={t} className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pengumuman */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-900">Pengumuman Terkini</p>
        </div>
        <div className="space-y-2">
          {[
            { title: 'Cuti Umum Hari Wesak',           date: '25 Mei 2025', type: 'Cuti',    color: 'bg-orange-100 text-orange-700' },
            { title: 'Program Pemeriksaan Kesihatan',   date: '28 Mei 2025', type: 'Aktiviti', color: 'bg-green-100 text-green-700' },
          ].map(a => (
            <div key={a.title} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${a.color}`}>{a.type}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{a.title}</p>
                <p className="text-[10px] text-slate-400">{a.date}</p>
              </div>
              <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
