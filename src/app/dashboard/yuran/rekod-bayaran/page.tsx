'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Search, CreditCard, Calendar, CheckCircle, Receipt } from 'lucide-react'

const students = [
  { id: 4,  name: 'Arif Danial bin Shahril',     kelas: 'Kelas Ceria',    bulan: 'Mei 2024', jumlah: 350, avatar: 'A', color: 'bg-emerald-500' },
  { id: 6,  name: 'Danish Irfan bin Zulkifli',   kelas: 'Kelas Matahari', bulan: 'Mei 2024', jumlah: 350, avatar: 'D', color: 'bg-teal-500' },
  { id: 7,  name: 'Aisyah Maisarah bt Roslan',   kelas: 'Kelas Ceria',    bulan: 'Mei 2024', jumlah: 250, avatar: 'A', color: 'bg-rose-500' },
  { id: 10, name: 'Rayyan Yusuf bin Helmi',       kelas: 'Kelas Ceria',    bulan: 'Mei 2024', jumlah: 350, avatar: 'R', color: 'bg-amber-500' },
]

const kaedahList = ['Online Banking', 'DuitNow', 'Tunai', 'Cek', 'Pindahan Bank']

export default function RekodBayaranPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const [kaedah, setKaedah] = useState('Online Banking')
  const [tarikh, setTarikh] = useState('2024-05-12')
  const [nota, setNota] = useState('')
  const [saved, setSaved] = useState(false)

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
  const student = students.find(s => s.id === selected)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/yuran" className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} className="text-slate-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Rekod Bayaran</h1>
            <p className="text-sm text-slate-500 mt-0.5">Rekodkan pembayaran yuran pelajar</p>
          </div>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-sm font-semibold">
            <CheckCircle size={14} />
            Bayaran berjaya direkodkan!
          </div>
        )}
      </div>

      {/* Stat summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tertunggak Bulan Ini', value: '4 pelajar',    color: 'bg-red-50 text-red-700' },
          { label: 'Jumlah Tertunggak',    value: 'RM 1,300.00',  color: 'bg-orange-50 text-orange-700' },
          { label: 'Resit Dikeluarkan',    value: '38 resit',     color: 'bg-blue-50 text-blue-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-4 ${color} border border-current/10`}>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left: Pick student */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">1. Pilih Pelajar</p>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama pelajar..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
            {filtered.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors text-left ${selected === s.id ? 'bg-blue-50' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.kelas} · {s.bulan}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-red-600">RM {s.jumlah}</p>
                  {selected === s.id && <CheckCircle size={14} className="text-blue-600 ml-auto mt-0.5" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Payment form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">2. Butiran Bayaran</p>

          {student ? (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <div className={`w-8 h-8 rounded-full ${student.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {student.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{student.name}</p>
                <p className="text-xs text-slate-500">{student.bulan} · RM {student.jumlah}.00</p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl text-center text-sm text-slate-400">
              Pilih pelajar di sebelah kiri
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Kaedah Bayaran</label>
            <div className="relative">
              <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={kaedah}
                onChange={e => setKaedah(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700"
              >
                {kaedahList.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Tarikh Bayar</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={tarikh}
                onChange={e => setTarikh(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Nota <span className="text-slate-400 font-normal">(pilihan)</span></label>
            <textarea
              value={nota}
              onChange={e => setNota(e.target.value)}
              placeholder="Contoh: Bayar tunai kepada Cikgu Sarah"
              rows={2}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 resize-none"
            />
          </div>

          {student && (
            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Yuran {student.bulan}</span>
                <span>RM {student.jumlah}.00</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-800">
                <span>Jumlah Bayar</span>
                <span className="text-blue-600">RM {student.jumlah}.00</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!selected}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Receipt size={14} />
            Rekod & Jana Resit
          </button>
        </div>
      </div>
    </div>
  )
}
