'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Plus, Upload, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'

const students = [
  { id: 1, name: 'Nur Alia bt Hafiz',          kelas: 'Kelas Ceria',    dob: '12 Jan 2021', penjaga: 'Puan Hafizah',  status: 'Aktif',  hadir: 95, avatar: 'N', color: 'bg-pink-500' },
  { id: 2, name: 'Muhammad Harif bin Azri',     kelas: 'Kelas Pelangi', dob: '3 Mac 2020',  penjaga: 'En. Azri',      status: 'Aktif',  hadir: 88, avatar: 'M', color: 'bg-blue-500' },
  { id: 3, name: 'Qaisara Insyirah bt Farid',   kelas: 'Kelas Matahari',dob: '28 Jul 2019', penjaga: 'Puan Faridah',  status: 'Aktif',  hadir: 100,avatar: 'Q', color: 'bg-purple-500' },
  { id: 4, name: 'Arif Danial bin Shahril',     kelas: 'Kelas Ceria',   dob: '15 Okt 2021', penjaga: 'En. Shahril',   status: 'Aktif',  hadir: 72, avatar: 'A', color: 'bg-emerald-500' },
  { id: 5, name: 'Sara Safiyya bt Kamal',       kelas: 'Kelas Pelangi', dob: '2 Feb 2020',  penjaga: 'Puan Kamaliah', status: 'Aktif',  hadir: 91, avatar: 'S', color: 'bg-orange-500' },
  { id: 6, name: 'Danish Irfan bin Zulkifli',   kelas: 'Kelas Matahari',dob: '9 Jun 2019',  penjaga: 'En. Zulkifli',  status: 'Aktif',  hadir: 85, avatar: 'D', color: 'bg-teal-500' },
  { id: 7, name: 'Aisyah Maisarah bt Roslan',   kelas: 'Kelas Ceria',   dob: '20 Apr 2021', penjaga: 'Puan Rosnah',   status: 'Trial',  hadir: 60, avatar: 'A', color: 'bg-rose-500' },
  { id: 8, name: 'Irfan Hakimi bin Nasrul',     kelas: 'Kelas Pelangi', dob: '11 Sep 2020', penjaga: 'En. Nasrul',    status: 'Aktif',  hadir: 97, avatar: 'I', color: 'bg-indigo-500' },
  { id: 9, name: 'Sofea Qurratu bt Amirul',     kelas: 'Kelas Matahari',dob: '5 Dec 2019',  penjaga: 'Puan Amira',    status: 'Aktif',  hadir: 89, avatar: 'S', color: 'bg-violet-500' },
  { id: 10, name: 'Rayyan Yusuf bin Helmi',     kelas: 'Kelas Ceria',   dob: '18 Mar 2021', penjaga: 'En. Helmi',     status: 'Aktif',  hadir: 93, avatar: 'R', color: 'bg-amber-500' },
]

const statusStyle: Record<string, string> = {
  Aktif:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Trial:   'bg-orange-50  text-orange-700  border border-orange-200',
  Alumni:  'bg-slate-50   text-slate-500   border border-slate-200',
  Tidak:   'bg-red-50     text-red-700     border border-red-200',
}

export default function PelajarPage() {
  const [search, setSearch] = useState('')
  const [kelasFilter, setKelasFilter] = useState('')

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (kelasFilter === '' || s.kelas === kelasFilter)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pelajar</h1>
          <p className="text-sm text-slate-500 mt-0.5">Urus rekod dan profil pelajar</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Upload size={15} />
            Import Data
          </button>
          <Link href="/dashboard/pelajar/tambah">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              <Plus size={15} />
              Tambah Pelajar
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Jumlah Pelajar', count: 42, icon: '👥', color: 'bg-blue-50 text-blue-700' },
          { label: 'Aktif',          count: 36, icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Trial',          count: 4,  icon: '⏳', color: 'bg-orange-50 text-orange-700' },
          { label: 'Alumni',         count: 2,  icon: '🎓', color: 'bg-slate-50 text-slate-600' },
        ].map(({ label, count, icon, color }) => (
          <div key={label} className={`rounded-xl p-4 ${color} border border-current/10`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Main Table */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama atau no. pelajar..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
              />
            </div>
            <select
              value={kelasFilter}
              onChange={e => setKelasFilter(e.target.value)}
              className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Semua Kelas</option>
              <option value="Kelas Ceria">Kelas Ceria</option>
              <option value="Kelas Pelangi">Kelas Pelangi</option>
              <option value="Kelas Matahari">Kelas Matahari</option>
            </select>
            <select className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Trial</option>
            </select>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                {['Nama', 'Kelas', 'Tarikh Lahir', 'Penjaga', 'Kehadiran', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => window.location.href = `/dashboard/pelajar/${s.id}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {s.avatar}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{s.kelas}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{s.dob}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{s.penjaga}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.hadir}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{s.hadir}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50">
            <p className="text-xs text-slate-400">Menunjukkan {filtered.length} daripada {students.length} pelajar</p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400"><ChevronLeft size={14} /></button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-600 text-white text-xs font-semibold">1</button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500 text-xs">2</button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 space-y-3 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Perlu Tindakan</p>
            <div className="space-y-2">
              {[
                { text: 'Profil tidak lengkap', count: 3, color: 'text-orange-600 bg-orange-50' },
                { text: 'Tiada penjaga dikaitkan', count: 2, color: 'text-red-600 bg-red-50' },
                { text: 'Bayaran tertunggak', count: 5, color: 'text-rose-600 bg-rose-50' },
              ].map(({ text, count, color }) => (
                <div key={text} className="flex items-center justify-between">
                  <p className="text-xs text-slate-600">{text}</p>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${color}`}>{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Pemakluman</p>
            <div className="space-y-2">
              {[
                { text: 'Naik taraf ke Premium untuk multi-kelas lebih', color: 'text-blue-600 bg-blue-50' },
                { text: 'Eksport data pelajar ke Excel', color: 'text-violet-600 bg-violet-50' },
              ].map(({ text, color }) => (
                <div key={text} className={`text-xs p-2.5 rounded-xl ${color} font-medium leading-snug`}>{text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
