'use client'

import { useState } from 'react'
import { Save, Building2, Users, BookOpen, Bell, Shield, Palette, Upload, Plus, Trash2 } from 'lucide-react'

type Section = 'profil' | 'kelas' | 'pengguna' | 'notifikasi' | 'keselamatan'

const sections: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: 'profil',       label: 'Profil Taska',   icon: Building2 },
  { key: 'kelas',        label: 'Kelas',           icon: BookOpen },
  { key: 'pengguna',     label: 'Pengguna',        icon: Users },
  { key: 'notifikasi',   label: 'Notifikasi',      icon: Bell },
  { key: 'keselamatan',  label: 'Keselamatan',     icon: Shield },
]

const kelasData = [
  { id: 1, nama: 'Kelas Ceria',    ageGroup: '1-2 tahun', kapasiti: 15, guru: 'Cikgu Aina',    pelajar: 12, color: 'bg-blue-500' },
  { id: 2, nama: 'Kelas Pelangi',  ageGroup: '2-3 tahun', kapasiti: 15, guru: 'Cikgu Sarah',   pelajar: 14, color: 'bg-violet-500' },
  { id: 3, nama: 'Kelas Matahari', ageGroup: '3-4 tahun', kapasiti: 15, guru: 'Cikgu Hidayah', pelajar: 16, color: 'bg-amber-500' },
]

const penggunaData = [
  { id: 1, nama: 'Puan Ramlah',   email: 'ramlah@taska.my',  role: 'Admin',  status: 'Aktif', avatar: 'R', color: 'bg-blue-500' },
  { id: 2, nama: 'Cikgu Aina',    email: 'aina@taska.my',    role: 'Guru',   status: 'Aktif', avatar: 'A', color: 'bg-pink-500' },
  { id: 3, nama: 'Cikgu Sarah',   email: 'sarah@taska.my',   role: 'Guru',   status: 'Aktif', avatar: 'S', color: 'bg-orange-500' },
  { id: 4, nama: 'Cikgu Hidayah', email: 'hidayah@taska.my', role: 'Guru',   status: 'Aktif', avatar: 'H', color: 'bg-emerald-500' },
]

export default function TetapanPage() {
  const [section, setSection] = useState<Section>('profil')
  const [saved, setSaved] = useState(false)
  const [profil, setProfil] = useState({
    nama: 'Taska Nur Kasih',
    no_daftar: 'TK-2024-0123',
    phone: '03-1234 5678',
    email: 'admin@taskanurkaish.com',
    alamat: 'No. 45, Jalan Mawar 3, Taman Setia, 68000 Ampang, Selangor',
    kapasiti: '50',
    waktu_buka: '07:30',
    waktu_tutup: '18:30',
  })

  const set = (k: string, v: string) => setProfil(f => ({ ...f, [k]: v }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tetapan</h1>
          <p className="text-sm text-slate-500 mt-0.5">Urus profil taska, kelas, dan pengguna</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-sm font-semibold">
            ✓ Tetapan disimpan!
          </div>
        )}
      </div>

      <div className="flex gap-5">
        {/* Left nav */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                section === key
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon size={16} className={section === key ? 'text-blue-600' : 'text-slate-400'} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">

          {/* Profil Taska */}
          {section === 'profil' && (
            <>
              {/* Logo */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-50 mb-4">
                  <Palette size={14} className="text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">Logo & Jenama</p>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    NK
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Logo Taska</p>
                    <p className="text-xs text-slate-400 mb-3">PNG atau JPG. Maksimum 2MB. Cadangan: 200×200px</p>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                      <Upload size={13} />
                      Muat naik logo
                    </button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                  <Building2 size={14} className="text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">Maklumat Taska</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Nama Taska</label>
                    <input value={profil.nama} onChange={e => set('nama', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">No. Pendaftaran</label>
                    <input value={profil.no_daftar} onChange={e => set('no_daftar', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">No. Telefon</label>
                    <input value={profil.phone} onChange={e => set('phone', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">E-mel</label>
                    <input value={profil.email} onChange={e => set('email', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Waktu Buka</label>
                    <input type="time" value={profil.waktu_buka} onChange={e => set('waktu_buka', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Waktu Tutup</label>
                    <input type="time" value={profil.waktu_tutup} onChange={e => set('waktu_tutup', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Alamat</label>
                    <textarea value={profil.alamat} onChange={e => set('alamat', e.target.value)} rows={2}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                    <Save size={14} />
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Kelas */}
          {section === 'kelas' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                <p className="text-sm font-bold text-slate-700">Senarai Kelas</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={12} />
                  Tambah Kelas
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {kelasData.map(k => (
                  <div key={k.id} className="flex items-center gap-4 px-5 py-4">
                    <div className={`w-9 h-9 rounded-xl ${k.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {k.nama.charAt(6)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{k.nama}</p>
                      <p className="text-xs text-slate-400">{k.ageGroup} · {k.guru}</p>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-slate-700">{k.pelajar}/{k.kapasiti}</p>
                      <p className="text-[10px] text-slate-400">Pelajar</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Edit</button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pengguna */}
          {section === 'pengguna' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                <p className="text-sm font-bold text-slate-700">Pengguna Sistem</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={12} />
                  Jemput Pengguna
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {penggunaData.map(p => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {p.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{p.nama}</p>
                      <p className="text-xs text-slate-400">{p.email}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      p.role === 'Admin' ? 'bg-violet-50 text-violet-700 border border-violet-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>{p.role}</span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{p.status}</span>
                    <button className="text-xs text-slate-500 hover:text-red-500 transition-colors">Buang</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifikasi */}
          {section === 'notifikasi' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tetapan Notifikasi</p>
              {[
                { label: 'Peringatan yuran tertunggak',    sub: 'Hantar peringatan automatik kepada ibu bapa' },
                { label: 'Notifikasi kehadiran',           sub: 'Alert bila pelajar belum check-in pada waktu tertentu' },
                { label: 'Pengumuman baru',                sub: 'Notifikasi bila pengumuman baru diterbitkan' },
                { label: 'Laporan mingguan',               sub: 'Ringkasan kehadiran dan yuran setiap Jumaat' },
              ].map(({ label, sub }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
              <div className="flex justify-end">
                <button onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                  <Save size={14} />
                  Simpan
                </button>
              </div>
            </div>
          )}

          {/* Keselamatan */}
          {section === 'keselamatan' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tukar Kata Laluan</p>
                {['Kata Laluan Semasa', 'Kata Laluan Baru', 'Sahkan Kata Laluan Baru'].map(label => (
                  <div key={label} className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">{label}</label>
                    <input type="password" placeholder="••••••••"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300" />
                  </div>
                ))}
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                    <Shield size={14} />
                    Kemaskini Kata Laluan
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
                <p className="text-sm font-bold text-amber-800 mb-1">Zon Berbahaya</p>
                <p className="text-xs text-amber-600 mb-3">Tindakan ini tidak boleh dibatalkan. Sila pastikan anda benar-benar pasti.</p>
                <button className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 bg-white rounded-xl hover:bg-red-50 transition-colors">
                  Padam Akaun Taska
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
