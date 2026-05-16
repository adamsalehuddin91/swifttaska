'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, MoreHorizontal } from 'lucide-react'

const guardians = [
  { id: 1,  name: 'Puan Hafizah bt Rahman',    hubungan: 'Ibu',     phone: '013-456 7890', email: 'hafizah@gmail.com',   anak: 2, status: 'Aktif',  avatar: 'H', color: 'bg-pink-500' },
  { id: 2,  name: 'En. Azri bin Sulaiman',      hubungan: 'Bapa',    phone: '012-345 6789', email: 'azri@yahoo.com',      anak: 1, status: 'Aktif',  avatar: 'A', color: 'bg-blue-500' },
  { id: 3,  name: 'Puan Faridah bt Yusuf',      hubungan: 'Ibu',     phone: '011-234 5678', email: 'faridah@email.com',   anak: 2, status: 'Aktif',  avatar: 'F', color: 'bg-purple-500' },
  { id: 4,  name: 'En. Shahril bin Mahmud',     hubungan: 'Bapa',    phone: '019-876 5432', email: 'shahril@gmail.com',   anak: 1, status: 'Aktif',  avatar: 'S', color: 'bg-emerald-500' },
  { id: 5,  name: 'Puan Kamaliah bt Johari',    hubungan: 'Ibu',     phone: '017-654 3210', email: 'kamal@email.com',     anak: 1, status: 'Aktif',  avatar: 'K', color: 'bg-orange-500' },
  { id: 6,  name: 'En. Zulkifli bin Osman',     hubungan: 'Bapa',    phone: '016-543 2109', email: 'zul@yahoo.com',       anak: 2, status: 'Aktif',  avatar: 'Z', color: 'bg-teal-500' },
  { id: 7,  name: 'Puan Rosnah bt Ali',         hubungan: 'Ibu',     phone: '014-432 1098', email: 'rosnah@gmail.com',    anak: 1, status: 'Aktif',  avatar: 'R', color: 'bg-rose-500' },
  { id: 8,  name: 'En. Nasrul bin Hamid',       hubungan: 'Bapa',    phone: '018-321 0987', email: 'nasrul@email.com',    anak: 1, status: 'Aktif',  avatar: 'N', color: 'bg-indigo-500' },
  { id: 9,  name: 'Puan Amira bt Hassan',       hubungan: 'Ibu',     phone: '015-210 9876', email: 'amira@gmail.com',     anak: 1, status: 'Penjaga', avatar: 'A', color: 'bg-violet-500' },
  { id: 10, name: 'En. Helmi bin Razak',        hubungan: 'Bapa',    phone: '013-109 8765', email: 'helmi@yahoo.com',     anak: 2, status: 'Aktif',  avatar: 'H', color: 'bg-amber-500' },
]

const statusStyle: Record<string, string> = {
  Aktif:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Penjaga: 'bg-blue-50 text-blue-700 border border-blue-200',
  Tidak:   'bg-red-50 text-red-700 border border-red-200',
}

export default function PenjagaPage() {
  const [search, setSearch] = useState('')

  const filtered = guardians.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Penjaga</h1>
          <p className="text-sm text-slate-500 mt-0.5">Urus rekod ibu bapa dan penjaga pelajar</p>
        </div>
        <Link href="/dashboard/penjaga/tambah">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={15} />
            Tambah Penjaga
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Jumlah Penjaga',            count: 128, color: 'bg-blue-50 text-blue-700' },
          { label: 'Penjaga Aktif',              count: 112, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Bilangan Penjaga Dikaitkan', count: 164, color: 'bg-violet-50 text-violet-700' },
          { label: 'Perlu Makluman',             count: 16,  color: 'bg-orange-50 text-orange-700' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-xl p-4 ${color} border border-current/10`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama penjaga..."
              className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
            />
          </div>
          <select className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
            <option>Semua Status</option>
            <option>Aktif</option>
          </select>
          <select className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
            <option>Semua Hubungan</option>
            <option>Ibu</option>
            <option>Bapa</option>
            <option>Penjaga</option>
          </select>
          <select className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
            <option>Semua Kelas</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              {['Nama', 'Hubungan', 'No. Telefon', 'E-mel', 'Bilangan Anak', 'Status', 'Tindakan'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(g => (
              <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${g.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {g.avatar}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{g.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{g.hubungan}</td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{g.phone}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{g.email}</td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-semibold text-slate-700">{g.anak}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[g.status]}`}>
                    {g.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50">
          <p className="text-xs text-slate-400">Menunjukkan {filtered.length} daripada {guardians.length} penjaga</p>
          <p className="text-xs text-slate-400">Halaman 1 daripada 13</p>
        </div>
      </div>
    </div>
  )
}
