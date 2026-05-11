'use client'

import { useState } from 'react'
import { QrCode, Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { QRCodeSVG } from 'qrcode.react'

const weekData = [
  { hari: 'Isnin',  hadir: 38, absent: 4 },
  { hari: 'Selasa', hadir: 40, absent: 2 },
  { hari: 'Rabu',   hadir: 35, absent: 7 },
  { hari: 'Khamis', hadir: 42, absent: 0 },
  { hari: 'Jumaat', hadir: 39, absent: 3 },
]

const attendance = [
  { id: 1, name: 'Nur Alia bt Hafiz',        kelas: 'Kelas Ceria',    masuk: '08:12 AM', keluar: '05:30 PM', penjemput: 'Puan Hafizah', status: 'Hadir',   avatar: 'N', color: 'bg-pink-500' },
  { id: 2, name: 'Muhammad Harif bin Azri',   kelas: 'Kelas Pelangi', masuk: '07:55 AM', keluar: '05:15 PM', penjemput: 'En. Azri',      status: 'Hadir',   avatar: 'M', color: 'bg-blue-500' },
  { id: 3, name: 'Qaisara Insyirah bt Farid', kelas: 'Kelas Matahari',masuk: '08:30 AM', keluar: '-',         penjemput: '-',             status: 'Belum Keluar', avatar: 'Q', color: 'bg-purple-500' },
  { id: 4, name: 'Arif Danial bin Shahril',   kelas: 'Kelas Ceria',   masuk: '-',         keluar: '-',         penjemput: '-',             status: 'Tidak Hadir', avatar: 'A', color: 'bg-emerald-500' },
  { id: 5, name: 'Sara Safiyya bt Kamal',     kelas: 'Kelas Pelangi', masuk: '08:05 AM', keluar: '04:50 PM', penjemput: 'Puan Kamaliah', status: 'Hadir',   avatar: 'S', color: 'bg-orange-500' },
  { id: 6, name: 'Danish Irfan bin Zulkifli', kelas: 'Kelas Matahari',masuk: '08:20 AM', keluar: '-',         penjemput: '-',             status: 'Belum Keluar', avatar: 'D', color: 'bg-teal-500' },
]

const statusStyle: Record<string, string> = {
  'Hadir':        'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Tidak Hadir':  'bg-red-50 text-red-700 border border-red-200',
  'Belum Keluar': 'bg-orange-50 text-orange-700 border border-orange-200',
  'Cuti':         'bg-blue-50 text-blue-700 border border-blue-200',
}

export default function KehadiranPage() {
  const [showQR, setShowQR] = useState(true)
  const [date, setDate] = useState('2024-05-21')
  const [kelas, setKelas] = useState('Semua Kelas')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Kehadiran</h1>
          <p className="text-sm text-slate-500 mt-0.5">Rekod masuk dan keluar pelajar</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" />
          <select value={kelas} onChange={e => setKelas(e.target.value)}
            className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option>Semua Kelas</option>
            <option>Kelas Ceria</option>
            <option>Kelas Pelangi</option>
            <option>Kelas Matahari</option>
          </select>
          <button
            onClick={() => setShowQR(!showQR)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors shadow-sm ${
              showQR ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <QrCode size={15} />
            {showQR ? 'Sembunyikan QR' : 'Tunjuk QR'}
          </button>
        </div>
      </div>

      {/* Top Grid: QR + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* QR Code */}
        {showQR && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center">
            <p className="text-sm font-semibold text-slate-700 mb-4">Imbas Kod QR untuk Check-In</p>
            <div className="p-4 bg-white border-2 border-blue-100 rounded-2xl shadow-inner">
              <QRCodeSVG value="https://taska-demo.swiftapps.my/checkin" size={180} level="M" />
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">Tunjukkan kod ini kepada penjaga untuk<br />check-in dan check-out pelajar</p>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 text-xs font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">Jana QR Baharu</button>
              <button className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cetak QR</button>
            </div>
          </div>
        )}

        {/* Weekly Chart */}
        <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm ${!showQR ? 'col-span-2' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Ringkasan Kehadiran Mingguan</h3>
            <p className="text-xs text-slate-400">21–25 Mei 2024 (Semua Kelas)</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="hari" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="hadir" name="Hadir" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Tidak Hadir" fill="#FCA5A5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Log */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <h3 className="text-sm font-semibold text-slate-900">Senarai Kehadiran Terkini</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Cari pelajar..." className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none w-48 placeholder:text-slate-400" />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> Hadir: 34</span>
              <span className="flex items-center gap-1"><XCircle size={12} className="text-red-400" /> Tidak: 4</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-orange-400" /> Belum Keluar: 4</span>
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              {['Nama Pelajar', 'Kelas', 'Masa Check-In', 'Masa Check-Out', 'Penjemput', 'Status', 'Tindakan'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {attendance.map(a => (
              <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {a.avatar}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{a.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{a.kelas}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700 font-medium">{a.masuk}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{a.keluar}</td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{a.penjemput}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button className="text-xs text-blue-600 font-medium hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
