'use client'

import { useState } from 'react'
import { Search, Plus, Download, Receipt } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const fees = [
  { id: 1,  name: 'Nur Alia bt Hafiz',          kelas: 'Kelas Ceria',    bulan: 'Mei 2024',   jumlah: 350,  bayar: 'RM 350.00', tarikh: '1 Mei 2024',   kaedah: 'Online Banking', status: 'Dibayar',    resit: 'RCP-0001' },
  { id: 2,  name: 'Muhammad Harif bin Azri',     kelas: 'Kelas Pelangi',  bulan: 'Mei 2024',   jumlah: 350,  bayar: 'RM 350.00', tarikh: '2 Mei 2024',   kaedah: 'DuitNow',        status: 'Dibayar',    resit: 'RCP-0002' },
  { id: 3,  name: 'Qaisara Insyirah bt Farid',   kelas: 'Kelas Matahari', bulan: 'Mei 2024',   jumlah: 350,  bayar: 'RM 350.00', tarikh: '3 Mei 2024',   kaedah: 'Tunai',          status: 'Dibayar',    resit: 'RCP-0003' },
  { id: 4,  name: 'Arif Danial bin Shahril',     kelas: 'Kelas Ceria',    bulan: 'Mei 2024',   jumlah: 350,  bayar: '-',         tarikh: '-',            kaedah: '-',              status: 'Tertunggak', resit: '-' },
  { id: 5,  name: 'Sara Safiyya bt Kamal',       kelas: 'Kelas Pelangi',  bulan: 'Mei 2024',   jumlah: 350,  bayar: 'RM 350.00', tarikh: '5 Mei 2024',   kaedah: 'Online Banking', status: 'Dibayar',    resit: 'RCP-0004' },
  { id: 6,  name: 'Danish Irfan bin Zulkifli',   kelas: 'Kelas Matahari', bulan: 'Mei 2024',   jumlah: 350,  bayar: '-',         tarikh: '-',            kaedah: '-',              status: 'Tertunggak', resit: '-' },
  { id: 7,  name: 'Aisyah Maisarah bt Roslan',   kelas: 'Kelas Ceria',    bulan: 'Mei 2024',   jumlah: 250,  bayar: '-',         tarikh: '-',            kaedah: '-',              status: 'Tertunggak', resit: '-' },
  { id: 8,  name: 'Irfan Hakimi bin Nasrul',     kelas: 'Kelas Pelangi',  bulan: 'Mei 2024',   jumlah: 350,  bayar: 'RM 350.00', tarikh: '1 Mei 2024',   kaedah: 'DuitNow',        status: 'Dibayar',    resit: 'RCP-0005' },
  { id: 9,  name: 'Sofea Qurratu bt Amirul',     kelas: 'Kelas Matahari', bulan: 'Mei 2024',   jumlah: 350,  bayar: 'RM 350.00', tarikh: '2 Mei 2024',   kaedah: 'Online Banking', status: 'Dibayar',    resit: 'RCP-0006' },
  { id: 10, name: 'Rayyan Yusuf bin Helmi',      kelas: 'Kelas Ceria',    bulan: 'Mei 2024',   jumlah: 350,  bayar: '-',         tarikh: '-',            kaedah: '-',              status: 'Tertunggak', resit: '-' },
]

const statusStyle: Record<string, string> = {
  'Dibayar':    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Tertunggak': 'bg-red-50 text-red-700 border border-red-200',
  'Dijadual':   'bg-blue-50 text-blue-700 border border-blue-200',
}

const pieData = [
  { name: 'Dibayar', value: 48, color: '#10B981' },
  { name: 'Tertunggak', value: 16, color: '#F87171' },
  { name: 'Belum Tiba', value: 26, color: '#E2E8F0' },
]

const ringkasan = [
  { label: 'Kelas Ceria',    amount: 'RM 4,900.00', pct: '70%', color: 'bg-blue-500' },
  { label: 'Kelas Pelangi',  amount: 'RM 7,350.00', pct: '84%', color: 'bg-emerald-500' },
  { label: 'Kelas Matahari', amount: 'RM 6,494.00', pct: '92%', color: 'bg-violet-500' },
]

const suggestions = [
  { name: 'Arif Danial bin Shahril',   kelas: 'Kelas Ceria',    tertunggak: 'RM 350.00',  bulan: 'Mei 2024',  avatar: 'A', color: 'bg-emerald-500' },
  { name: 'Danish Irfan bin Zulkifli', kelas: 'Kelas Matahari', tertunggak: 'RM 350.00',  bulan: 'Mei 2024',  avatar: 'D', color: 'bg-teal-500' },
  { name: 'Rayyan Yusuf bin Helmi',    kelas: 'Kelas Ceria',    tertunggak: 'RM 350.00',  bulan: 'Mei 2024',  avatar: 'R', color: 'bg-amber-500' },
]

export default function YuranPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua Status')

  const filtered = fees.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'Semua Status' || f.status === statusFilter)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Yuran & Resit</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pengurusan yuran pelajar dan resit pembayaran</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Download size={14} /> Eksport
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={15} /> Cipta Bil / Rekod Bayaran
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Jumlah Kutipan Bulan Ini',  value: 'RM 18,745.05', color: 'bg-blue-600',    sub: '↑ 5.2% berbanding bulan lalu' },
          { label: 'Tertunggak',                 value: 'RM 5,660.00',  color: 'bg-red-500',     sub: '16 pelajar belum bayar' },
          { label: 'Bil Dibayar',                value: '48',           color: 'bg-emerald-500', sub: 'daripada 64 pelajar' },
          { label: 'Resit Dicetak',              value: '48',           color: 'bg-violet-500',  sub: 'resit bulan ini' },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${color} mb-2`}>
              <Receipt size={14} className="text-white" />
            </div>
            <p className="text-xl font-bold text-slate-900 leading-tight">{value}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama pelajar..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
              />
            </div>
            <select className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
              <option>Semua Kelas</option>
              <option>Kelas Ceria</option>
              <option>Kelas Pelangi</option>
              <option>Kelas Matahari</option>
            </select>
            <select className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
              <option>Bulan Ini</option>
              <option>April 2024</option>
              <option>Mac 2024</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
              <option>Semua Status</option>
              <option>Dibayar</option>
              <option>Tertunggak</option>
            </select>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                {['Nama Pelajar', 'Kelas', 'Bulan', 'Amaun', 'Tgl Bayar', 'Kaedah', 'Status', 'Tindakan'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">{f.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.kelas}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.bulan}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${f.status === 'Tertunggak' ? 'text-red-600' : 'text-slate-900'}`}>
                      RM {f.jumlah.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{f.tarikh}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{f.kaedah}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[f.status]}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {f.status === 'Dibayar' ? (
                      <button className="text-xs text-blue-600 font-medium hover:underline">Resit</button>
                    ) : (
                      <button className="text-xs text-orange-600 font-medium hover:underline">Peringat</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50">
            <p className="text-xs text-slate-400">Menunjukkan {filtered.length} daripada {fees.length} rekod</p>
            <p className="text-xs text-slate-400">Halaman 1 daripada 7</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ringkasan Bayaran</p>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-slate-600">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan per kelas */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ringkasan Per Kelas</p>
            <div className="space-y-3">
              {ringkasan.map(r => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">{r.label}</span>
                    <span className="font-bold text-slate-800">{r.amount}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${r.color} rounded-full`} style={{ width: r.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tunggakan */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tindakan Perlu</p>
            <div className="space-y-2.5">
              {suggestions.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${s.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                    {s.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{s.name}</p>
                    <p className="text-[10px] text-red-600 font-semibold">{s.tertunggak} tertunggak</p>
                  </div>
                </div>
              ))}
              <button className="w-full text-xs text-blue-600 font-semibold text-center mt-1 hover:underline">
                Hantar Semua Peringatan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
