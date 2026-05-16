'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Edit2, Phone, Mail, MapPin, Calendar, Hash,
  Users, CreditCard, FileText, CheckCircle, XCircle, Clock, Download
} from 'lucide-react'

const student = {
  id: 1,
  name: 'Nur Alia bt Hafiz',
  noMyKid: '210112-14-0234',
  dob: '12 Jan 2021',
  umur: '3 Tahun',
  jantina: 'Perempuan',
  kelas: 'Kelas Ceria',
  status: 'Aktif',
  tarikh_daftar: '1 Feb 2024',
  alahan: 'Tiada',
  catatan: 'Suka melukis dan bermain blok',
  avatar: 'N',
  color: 'bg-pink-500',
  hadir: 95,
}

const penjaga = [
  { id: 1, name: 'Puan Hafizah bt Rahman', hubungan: 'Ibu', phone: '013-456 7890', email: 'hafizah@gmail.com', utama: true,  avatar: 'H', color: 'bg-pink-500' },
  { id: 2, name: 'En. Ahmad Fadzil',       hubungan: 'Bapa', phone: '012-789 0123', email: 'fadzil@gmail.com', utama: false, avatar: 'A', color: 'bg-blue-500' },
]

const yuranList = [
  { id: 1, bulan: 'Mei 2024',   jumlah: 350, status: 'Dibayar',    tarikh: '1 Mei 2024',   resit: 'RCP-0001', kaedah: 'Online Banking' },
  { id: 2, bulan: 'Apr 2024',   jumlah: 350, status: 'Dibayar',    tarikh: '2 Apr 2024',   resit: 'RCP-0892', kaedah: 'DuitNow' },
  { id: 3, bulan: 'Mac 2024',   jumlah: 350, status: 'Dibayar',    tarikh: '3 Mac 2024',   resit: 'RCP-0741', kaedah: 'Tunai' },
  { id: 4, bulan: 'Feb 2024',   jumlah: 350, status: 'Tertunggak', tarikh: '-',            resit: '-',        kaedah: '-' },
  { id: 5, bulan: 'Jan 2024',   jumlah: 350, status: 'Dibayar',    tarikh: '2 Jan 2024',   resit: 'RCP-0612', kaedah: 'Online Banking' },
]

const statusYuran: Record<string, string> = {
  Dibayar:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Tertunggak: 'bg-red-50 text-red-700 border border-red-200',
}

type Tab = 'profil' | 'penjaga' | 'yuran'

export default function StudentDetailPage() {
  const [tab, setTab] = useState<Tab>('profil')

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profil',  label: 'Profil',  icon: FileText },
    { key: 'penjaga', label: 'Penjaga', icon: Users },
    { key: 'yuran',   label: 'Yuran',   icon: CreditCard },
  ]

  const dibayar    = yuranList.filter(y => y.status === 'Dibayar').length * 350
  const tertunggak = yuranList.filter(y => y.status === 'Tertunggak').length * 350
  const dijana     = yuranList.length * 350

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/pelajar" className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} className="text-slate-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{student.kelas} · Daftar {student.tarikh_daftar}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Edit2 size={14} />
          Edit Profil
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl ${student.color} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
            {student.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {student.status}
              </span>
            </div>
            <p className="text-sm text-slate-500">{student.kelas} · {student.umur} · {student.jantina}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Kehadiran</p>
            <p className="text-2xl font-bold text-blue-600">{student.hadir}%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Profil */}
      {tab === 'profil' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Maklumat Peribadi</p>
            {[
              { label: 'No. MyKid / IC',    value: student.noMyKid,      icon: Hash },
              { label: 'Tarikh Lahir',       value: student.dob,          icon: Calendar },
              { label: 'Umur',              value: student.umur,          icon: Calendar },
              { label: 'Jantina',           value: student.jantina,       icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Maklumat Taska</p>
              {[
                { label: 'Kelas',          value: student.kelas,          icon: Hash },
                { label: 'Tarikh Daftar',  value: student.tarikh_daftar,  icon: Calendar },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Alahan & Catatan</p>
              <div className="space-y-2">
                <div>
                  <p className="text-[11px] text-slate-400">Alahan</p>
                  <p className="text-sm font-medium text-slate-800">{student.alahan}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Catatan Guru</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{student.catatan}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Dokumen</p>
              <div className="space-y-2">
                {['Sijil Lahir', 'Kad MyKid'].map(doc => (
                  <div key={doc} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">{doc}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Penjaga */}
      {tab === 'penjaga' && (
        <div className="space-y-4">
          {penjaga.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {p.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">{p.name}</p>
                      {p.utama && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Utama</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{p.hubungan}</p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Edit</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Phone,   value: p.phone },
                  { icon: Mail,    value: p.email },
                  { icon: MapPin,  value: 'No. 12, Jalan Setia' },
                ].map(({ icon: Icon, value }) => (
                  <div key={value} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <Icon size={13} className="text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-colors font-medium">
            + Tambah Penjaga
          </button>
        </div>
      )}

      {/* Tab: Yuran */}
      {tab === 'yuran' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Jumlah Dijana',   value: `RM ${dijana.toLocaleString()}.00`,    icon: CreditCard,   color: 'bg-blue-50 text-blue-700' },
              { label: 'Sudah Bayar',     value: `RM ${dibayar.toLocaleString()}.00`,   icon: CheckCircle,  color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Tertunggak',      value: `RM ${tertunggak.toLocaleString()}.00`,icon: XCircle,      color: 'bg-red-50 text-red-700' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`rounded-xl p-4 ${color} border border-current/10`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={15} />
                  <p className="text-xs font-semibold opacity-80">{label}</p>
                </div>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <p className="text-sm font-semibold text-slate-700">Rekod Yuran</p>
              <Link href="/dashboard/yuran/rekod-bayaran">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  <CreditCard size={12} />
                  Rekod Bayaran
                </button>
              </Link>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  {['Bulan', 'Jumlah', 'Tarikh Bayar', 'Kaedah', 'No. Resit', 'Status'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {yuranList.map(y => (
                  <tr key={y.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{y.bulan}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">RM {y.jumlah}.00</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{y.tarikh}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{y.kaedah}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{y.resit}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusYuran[y.status]}`}>
                        {y.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
