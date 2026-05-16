'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react'

const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogs', 'Sep', 'Okt', 'Nov', 'Dis']

// 1=hadir, 0=tidak hadir, null=cuti/akan datang
const calendarData: Record<number, number | null> = {
  1:1, 2:1, 3:1, 4:null, 5:null, 6:1, 7:1, 8:1, 9:1, 10:1,
  11:null, 12:null, 13:1, 14:1, 15:1, 16:0, 17:1, 18:null, 19:null,
  20:1, 21:1, 22:1, 23:1, 24:1, 25:null, 26:null, 27:1, 28:0, 29:1, 30:1, 31:null
}

const log = [
  { tarikh: '21 Mei 2024', hari: 'Selasa',  masuk: '07:45', keluar: '17:30', pengambil: 'Puan Hafizah', status: 'Hadir' },
  { tarikh: '20 Mei 2024', hari: 'Isnin',   masuk: '08:00', keluar: '17:15', pengambil: 'En. Fadzil',    status: 'Hadir' },
  { tarikh: '17 Mei 2024', hari: 'Jumaat',  masuk: '07:50', keluar: '17:45', pengambil: 'Puan Hafizah', status: 'Hadir' },
  { tarikh: '16 Mei 2024', hari: 'Khamis',  masuk: '-',     keluar: '-',     pengambil: '-',             status: 'Tidak Hadir' },
  { tarikh: '15 Mei 2024', hari: 'Rabu',    masuk: '08:05', keluar: '17:20', pengambil: 'En. Fadzil',    status: 'Hadir' },
]

export default function ParentKehadiranPage() {
  const [month, setMonth] = useState(4) // Mei = index 4

  const hadir     = Object.values(calendarData).filter(v => v === 1).length
  const tidakHadir = Object.values(calendarData).filter(v => v === 0).length
  const jumlahHari = hadir + tidakHadir

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-slate-900">Rekod Kehadiran</h1>
        <p className="text-xs text-slate-400">Nur Alia bt Hafiz · Kelas Ceria</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-emerald-700">{hadir}</p>
          <p className="text-[10px] font-semibold text-emerald-600">Hari Hadir</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-red-600">{tidakHadir}</p>
          <p className="text-[10px] font-semibold text-red-500">Tidak Hadir</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-blue-700">{Math.round((hadir / jumlahHari) * 100)}%</p>
          <p className="text-[10px] font-semibold text-blue-600">Kadar Hadir</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        {/* Month selector */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMonth(m => Math.max(0, m - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ChevronLeft size={16} className="text-slate-400" />
          </button>
          <p className="text-sm font-bold text-slate-800">{months[month]} 2024</p>
          <button onClick={() => setMonth(m => Math.min(11, m + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Ah', 'Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa'].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-slate-400">{d}</div>
          ))}
        </div>

        {/* Calendar grid — May 2024 starts on Wednesday (index 3) */}
        <div className="grid grid-cols-7 gap-1">
          {[0,1,2].map(i => <div key={`e${i}`} />)}
          {Object.entries(calendarData).map(([day, val]) => (
            <div key={day} className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-semibold ${
              val === 1    ? 'bg-emerald-500 text-white' :
              val === 0    ? 'bg-red-400 text-white' :
              val === null ? 'bg-slate-50 text-slate-300' : ''
            }`}>
              {day}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Hadir</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400 inline-block" /> Tidak Hadir</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-slate-100 inline-block" /> Cuti/Akan Datang</span>
        </div>
      </div>

      {/* Log kehadiran */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50">
          <p className="text-sm font-bold text-slate-900">Log Kehadiran Terkini</p>
        </div>
        <div className="divide-y divide-slate-50">
          {log.map((l, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-start justify-between mb-1.5">
                <div>
                  <p className="text-xs font-bold text-slate-800">{l.tarikh} <span className="text-slate-400 font-normal">({l.hari})</span></p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  l.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  {l.status === 'Hadir' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                  {l.status}
                </span>
              </div>
              {l.status === 'Hadir' && (
                <div className="flex items-center gap-4 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Clock size={10} /> Masuk: {l.masuk}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> Keluar: {l.keluar}</span>
                  <span>Diambil: {l.pengambil}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
