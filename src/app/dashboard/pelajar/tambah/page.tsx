'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, Upload, UserPlus } from 'lucide-react'

export default function TambahPelajarPage() {
  const [step] = useState(1)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/pelajar">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors">
              <ChevronLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tambah Pelajar</h1>
            <p className="text-sm text-slate-500">Lengkapkan maklumat pelajar baharu</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/pelajar">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Batal
            </button>
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <UserPlus size={15} />
            Simpan Pelajar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Section 1 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">1</div>
            <h2 className="text-sm font-bold text-slate-900">Maklumat Pelajar</h2>
            <p className="text-xs text-slate-400">Maklumat peribadi dan akademik pelajar</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Penuh *</label>
              <input className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder:text-slate-400" placeholder="Contoh: Nur Alia bt Hafiz" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jantina *</label>
              <div className="flex gap-3">
                {['Lelaki', 'Perempuan'].map(j => (
                  <label key={j} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="jantina" value={j} className="text-blue-600" />
                    <span className="text-sm text-slate-700">{j}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tarikh Lahir *</label>
              <input type="date" className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">No. Kad Pengenalan / MyKid</label>
              <input className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400" placeholder="Contoh: 210112-14-5678" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kelas *</label>
              <select className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-600 bg-white">
                <option value="">Pilih kelas...</option>
                <option>Kelas Ceria (2-3 tahun)</option>
                <option>Kelas Pelangi (3-4 tahun)</option>
                <option>Kelas Matahari (5-6 tahun)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status Pelajar</label>
              <select className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-600 bg-white">
                <option>Aktif</option>
                <option>Trial</option>
                <option>Tidak Aktif</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alahan / Nota Perubatan</label>
              <textarea rows={2} className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 resize-none" placeholder="Contoh: Alahan kacang, asma..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Foto Pelajar</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Upload size={20} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">Klik untuk muat naik foto</p>
                <p className="text-[11px] text-slate-300 mt-1">JPG, PNG - Maks 2MB</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dokumen Sokongan</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Upload size={20} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">Sijil lahir, MyKid, etc.</p>
                <p className="text-[11px] text-slate-300 mt-1">PDF, JPG - Maks 5MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">2</div>
            <h2 className="text-sm font-bold text-slate-900">Maklumat Penjaga Utama</h2>
            <p className="text-xs text-slate-400">Ibu bapa atau penjaga utama pelajar</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama *</label>
              <input className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400" placeholder="Contoh: Puan Hafizah bt Rahman" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hubungan *</label>
              <select className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-600 bg-white">
                <option>Ibu</option>
                <option>Bapa</option>
                <option>Penjaga</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">No. Telefon *</label>
              <input className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400" placeholder="Contoh: 013-456 7890" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">E-mel</label>
              <input type="email" className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400" placeholder="Contoh: puan@email.com" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat</label>
              <textarea rows={2} className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 resize-none" placeholder="No. Rumah, Jalan, Taman, Poskod, Negeri" />
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">3</div>
            <h2 className="text-sm font-bold text-slate-900">Penjaga Kedua / Kecemasan</h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Opsional</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama</label>
              <input className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400" placeholder="Contoh: En. Ahmad bin Salleh" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">No. Telefon</label>
              <input className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400" placeholder="Contoh: 012-345 6789" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
