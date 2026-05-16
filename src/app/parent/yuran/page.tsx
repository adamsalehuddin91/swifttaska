'use client'

import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, ChevronRight, Download } from 'lucide-react'

const yuranList = [
  { id: 1,  bulan: 'Mei 2024',   jumlah: 350, status: 'Tertunggak', tarikh: '-',           resit: '-',        kaedah: '-' },
  { id: 2,  bulan: 'Apr 2024',   jumlah: 350, status: 'Dibayar',    tarikh: '2 Apr 2024',  resit: 'RCP-0892', kaedah: 'DuitNow' },
  { id: 3,  bulan: 'Mac 2024',   jumlah: 350, status: 'Dibayar',    tarikh: '3 Mac 2024',  resit: 'RCP-0741', kaedah: 'Tunai' },
  { id: 4,  bulan: 'Feb 2024',   jumlah: 350, status: 'Dibayar',    tarikh: '1 Feb 2024',  resit: 'RCP-0612', kaedah: 'Online Banking' },
  { id: 5,  bulan: 'Jan 2024',   jumlah: 350, status: 'Dibayar',    tarikh: '2 Jan 2024',  resit: 'RCP-0511', kaedah: 'DuitNow' },
  { id: 6,  bulan: 'Dis 2023',   jumlah: 350, status: 'Dibayar',    tarikh: '5 Dis 2023',  resit: 'RCP-0422', kaedah: 'Tunai' },
]

type Filter = 'semua' | 'tertunggak' | 'dibayar'

const statusStyle: Record<string, string> = {
  Dibayar:    'bg-emerald-50 text-emerald-700',
  Tertunggak: 'bg-red-50 text-red-700',
}

const statusIcon: Record<string, React.ElementType> = {
  Dibayar:    CheckCircle,
  Tertunggak: AlertCircle,
}

export default function ParentYuranPage() {
  const [filter, setFilter] = useState<Filter>('semua')

  const tertunggak = yuranList.filter(y => y.status === 'Tertunggak')
  const dibayar    = yuranList.filter(y => y.status === 'Dibayar')
  const totalBayar = dibayar.reduce((s, y) => s + y.jumlah, 0)
  const totalDijana = yuranList.reduce((s, y) => s + y.jumlah, 0)

  const filtered = filter === 'semua' ? yuranList
    : filter === 'tertunggak' ? tertunggak
    : dibayar

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-slate-900">Yuran & Resit</h1>
        <p className="text-xs text-slate-400">Nur Alia bt Hafiz · Kelas Ceria</p>
      </div>

      {/* Tertunggak alert */}
      {tertunggak.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700">Yuran Tertunggak</p>
              <p className="text-xs text-red-600 mt-0.5">{tertunggak[0].bulan} · RM {tertunggak[0].jumlah}.00</p>
            </div>
            <span className="text-sm font-bold text-red-700">RM {tertunggak.reduce((s, y) => s + y.jumlah, 0)}.00</span>
          </div>
          <button className="w-full mt-3 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
            Hubungi Taska untuk Bayar
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={13} className="text-emerald-500" />
            <p className="text-[10px] font-semibold text-slate-500">Sudah Bayar</p>
          </div>
          <p className="text-lg font-bold text-emerald-600">RM {totalBayar.toLocaleString()}.00</p>
          <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(totalBayar / totalDijana) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={13} className="text-orange-500" />
            <p className="text-[10px] font-semibold text-slate-500">Tertunggak</p>
          </div>
          <p className="text-lg font-bold text-red-600">RM {tertunggak.reduce((s, y) => s + y.jumlah, 0)}.00</p>
          <p className="text-[10px] text-slate-400 mt-1.5">{tertunggak.length} bulan belum dijelaskan</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {(['semua', 'tertunggak', 'dibayar'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
              filter === f ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
            }`}>
            {f === 'semua' ? 'Semua' : f === 'tertunggak' ? 'Tertunggak' : 'Dibayar'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {filtered.map(y => {
            const Icon = statusIcon[y.status]
            return (
              <div key={y.id} className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{y.bulan}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {y.status === 'Dibayar' ? `${y.kaedah} · ${y.tarikh}` : 'Belum dibayar'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">RM {y.jumlah}.00</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${statusStyle[y.status]}`}>
                      <Icon size={9} />
                      {y.status}
                    </span>
                  </div>
                </div>
                {y.status === 'Dibayar' && y.resit !== '-' && (
                  <button className="flex items-center gap-1.5 mt-2 text-[10px] text-blue-600 font-semibold">
                    <Download size={11} />
                    Muat Turun Resit {y.resit}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Contact note */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 text-center">
        <p className="text-xs text-slate-500">Ada soalan mengenai yuran?</p>
        <button className="mt-2 text-xs font-semibold text-blue-600">Hubungi Taska Nur Kasih →</button>
      </div>
    </div>
  )
}
