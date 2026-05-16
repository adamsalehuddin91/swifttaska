'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Users } from 'lucide-react'

export default function TambahPenjagaPage() {
  const [form, setForm] = useState({
    nama: '',
    hubungan: '',
    phone: '',
    email: '',
    alamat: '',
    anak: '',
    utama: true,
    status: 'Aktif',
  })

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/penjaga" className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} className="text-slate-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tambah Penjaga</h1>
            <p className="text-sm text-slate-500 mt-0.5">Daftarkan ibu bapa atau penjaga pelajar</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Save size={14} />
          Simpan Penjaga
        </button>
      </div>

      {/* Section 1: Maklumat Peribadi */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <User size={14} className="text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-700">1. Maklumat Peribadi</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-600">Nama Penuh *</label>
            <input
              value={form.nama}
              onChange={e => set('nama', e.target.value)}
              placeholder="Contoh: Puan Hafizah bt Rahman"
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Hubungan *</label>
            <select
              value={form.hubungan}
              onChange={e => set('hubungan', e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700"
            >
              <option value="">Pilih hubungan</option>
              <option value="Ibu">Ibu</option>
              <option value="Bapa">Bapa</option>
              <option value="Datuk">Datuk</option>
              <option value="Nenek">Nenek</option>
              <option value="Penjaga">Penjaga Sah</option>
              <option value="Lain">Lain-lain</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Status</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
          <input
            type="checkbox"
            id="utama"
            checked={form.utama}
            onChange={e => set('utama', e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <label htmlFor="utama" className="text-sm text-blue-700 font-medium cursor-pointer">
            Tetapkan sebagai penjaga utama
          </label>
        </div>
      </div>

      {/* Section 2: Maklumat Hubungi */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Phone size={14} className="text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-slate-700">2. Maklumat Hubungi</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">No. Telefon *</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="Contoh: 013-456 7890"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">E-mel</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="Contoh: hafizah@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-600">Alamat</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
              <textarea
                value={form.alamat}
                onChange={e => set('alamat', e.target.value)}
                placeholder="Alamat kediaman penjaga"
                rows={2}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Kaitkan Pelajar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
            <Users size={14} className="text-violet-600" />
          </div>
          <p className="text-sm font-bold text-slate-700">3. Kaitkan dengan Pelajar</p>
          <span className="text-[10px] text-slate-400 font-medium">(pilihan)</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Cari Nama Pelajar</label>
          <input
            placeholder="Taip nama pelajar untuk cari..."
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          {[
            { id: 1, name: 'Nur Alia bt Hafiz',       kelas: 'Kelas Ceria',    avatar: 'N', color: 'bg-pink-500' },
            { id: 2, name: 'Muhammad Harif bin Azri',  kelas: 'Kelas Pelangi',  avatar: 'M', color: 'bg-blue-500' },
          ].map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <input type="checkbox" className="w-4 h-4 rounded accent-blue-600" />
              <div className={`w-7 h-7 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {s.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-400">{s.kelas}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Link href="/dashboard/penjaga">
          <button className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Batal
          </button>
        </Link>
        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Save size={14} />
          Simpan Penjaga
        </button>
      </div>
    </div>
  )
}
