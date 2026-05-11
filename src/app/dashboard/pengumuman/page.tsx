'use client'

import { useState } from 'react'
import { Plus, Copy, Bell, Calendar, BookOpen, Activity, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const announcements = [
  {
    id: 1, title: 'Cuti Umum Hari Wesak',
    type: 'Cuti', date: '25 Mei 2024 (Sabtu)',
    body: 'Taska akan ditutup sempena Hari Wesak pada 25 Mei 2024 (Sabtu). Perkhidmatan akan disambung semula pada hari Isnin, 27 Mei 2024.',
    publish: '22 Mei 2024', dibaca: 42, belum: 2, icon: Calendar, color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 2, title: 'Program Pemeriksaan Kesihatan',
    type: 'Aktiviti', date: '28 Mei 2024 (Selasa)',
    body: 'Program pemeriksaan kesihatan tahunan akan diadakan pada 28 Mei 2024. Sila pastikan pelajar hadir dan membawa buku kesihatan.',
    publish: '22 Mei 2024', dibaca: 38, belum: 6, icon: Activity, color: 'bg-green-100 text-green-700',
  },
  {
    id: 3, title: 'Reminder Taska Kena Hadiri 5 hari',
    type: 'Jadual', date: '23 Mei 2024 (Khamis)',
    body: 'Peringatan kepada semua penjaga: kehadiran pelajar sekurang-kurangnya 5 hari seminggu adalah sangat digalakkan untuk perkembangan optimum.',
    publish: '21 Mei 2024', dibaca: 35, belum: 9, icon: Bell, color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 4, title: 'Kamariah Mafiya Dipanah Tahun',
    type: 'Umum', date: '4 Mac 2024 (Rabu)',
    body: 'Majlis sambutan hari jadi pelajar kita pada bulan Mac. Jemput semua ibu bapa hadir bersama!',
    publish: '1 Mac 2024', dibaca: 48, belum: 0, icon: BookOpen, color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 5, title: 'Peringatan Bayaran Yuran Jun',
    type: 'Yuran', date: '30 Mei 2024 (Khamis)',
    body: 'Yuran bagi bulan Jun 2024 perlu dijelaskan sebelum atau pada 5 Jun 2024. Sila hubungi pihak taska sekiranya ada pertanyaan.',
    publish: '20 Mei 2024', dibaca: 29, belum: 15, icon: Bell, color: 'bg-red-100 text-red-700',
  },
  {
    id: 6, title: 'Peraturan Keselamatan Tahun Baharu',
    type: 'Umum', date: '1 Mac 2024 (Jumaat)',
    body: 'Peraturan keselamatan baharu telah dikemaskini. Sila semak buku panduan penjaga yang telah diedarkan.',
    publish: '28 Feb 2024', dibaca: 44, belum: 4, icon: BookOpen, color: 'bg-slate-100 text-slate-700',
  },
]

const readData = [
  { day: 'Isn', dibaca: 42 },
  { day: 'Sel', dibaca: 38 },
  { day: 'Rab', dibaca: 29 },
  { day: 'Kha', dibaca: 35 },
  { day: 'Jum', dibaca: 44 },
]

const cutiMingguIni = [
  { tarikh: '25 Mei 2024 (Sabtu)', nama: 'Hari Wesak', warna: 'bg-orange-50 border-orange-200' },
]

export default function PengumumanPage() {
  const [selected, setSelected] = useState(announcements[0].id)

  const selectedItem = announcements.find(a => a.id === selected) ?? announcements[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pengumuman</h1>
          <p className="text-sm text-slate-500 mt-0.5">Urus dan hantar makluman kepada ibu bapa</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Copy size={14} /> Copy Pengumuman
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={15} /> Jadikan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Pengumuman',  value: 3,  sub: 'aktif bulan ini',  color: 'bg-blue-50 text-blue-700' },
          { label: 'Dijadualkan', value: 5,  sub: 'akan datang',      color: 'bg-violet-50 text-violet-700' },
          { label: 'Sudah Baca',  value: 48, sub: 'penjaga',          color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Belum Baca',  value: 12, sub: 'masih belum dibaca',color: 'bg-orange-50 text-orange-700' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className={`rounded-xl p-4 ${color} border border-current/10`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-90">{label}</p>
            <p className="text-[11px] opacity-70 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Announcement List + Detail */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center border-b border-slate-50 px-5 pt-4">
              {['Semua', 'Jadual', 'Aktiviti', 'Yuran'].map((tab, i) => (
                <button key={tab}
                  className={`mr-4 pb-3 text-sm font-semibold border-b-2 transition-colors ${i === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  {tab}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2 pb-2">
                <select className="text-xs text-slate-600 border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none">
                  <option>Semua Jenis</option>
                  <option>Cuti</option>
                  <option>Aktiviti</option>
                  <option>Yuran</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {announcements.map(a => {
                const Icon = a.icon
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelected(a.id)}
                    className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors ${selected === a.id ? 'bg-blue-50/60' : 'hover:bg-slate-50/60'}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{a.publish}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{a.date}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-emerald-600 font-medium">✓ {a.dibaca} dibaca</span>
                        {a.belum > 0 && <span className="text-[10px] text-orange-600 font-medium">⏳ {a.belum} belum</span>}
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${a.color}`}>{a.type}</span>
                      </div>
                    </div>
                    {selected === a.id && <ChevronRight size={14} className="text-blue-500 flex-shrink-0 mt-1" />}
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50">
              <p className="text-xs text-slate-400">Menunjukkan {announcements.length} pengumuman</p>
              <p className="text-xs text-slate-400">Halaman 1 daripada 1</p>
            </div>
          </div>

          {/* Selected Detail */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${selectedItem.color}`}>
                  {selectedItem.type}
                </span>
                <span className="text-xs text-slate-400">{selectedItem.publish}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Edit</button>
                <button className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Hantar Semula</button>
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">{selectedItem.title}</h3>
            <p className="text-xs text-blue-600 font-medium mb-3">{selectedItem.date}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{selectedItem.body}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
              <span className="text-xs text-slate-500">Statistik bacaan:</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{selectedItem.dibaca} dibaca</span>
              <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">{selectedItem.belum} belum baca</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Cuti minggu ini */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Cuti Umum Hari Ini</p>
            {cutiMingguIni.map(c => (
              <div key={c.tarikh} className={`p-3 rounded-xl border ${c.warna} text-sm`}>
                <p className="font-bold text-orange-800">{c.nama}</p>
                <p className="text-xs text-orange-600 mt-0.5">{c.tarikh}</p>
              </div>
            ))}
            <p className="text-xs text-slate-400 mt-3">Tiada cuti umum yang lain minggu ini.</p>
          </div>

          {/* Bacaan chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Statistik Pengumuman</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={readData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                <Bar dataKey="dibaca" name="Dibaca" fill="#3B82F6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { label: 'Terhantar', value: 125, color: 'text-blue-600' },
                { label: 'Dibaca',   value: 98,  color: 'text-emerald-600' },
                { label: 'Belum',    value: 27,  color: 'text-orange-600' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Templat Pantas</p>
            <div className="space-y-2">
              {['Cuti Umum', 'Peringatan Yuran', 'Program Aktiviti', 'Notis Kecemasan'].map(t => (
                <button key={t} className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  {t}
                  <ChevronRight size={12} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
