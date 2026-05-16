'use client'

import { Phone, Mail, MapPin, ChevronRight, Shield, Bell, LogOut, Edit2 } from 'lucide-react'

const child = {
  name: 'Nur Alia bt Hafiz',
  noMyKid: '210112-14-0234',
  dob: '12 Januari 2021',
  umur: '3 Tahun',
  jantina: 'Perempuan',
  kelas: 'Kelas Ceria',
  tarikh_daftar: '1 Februari 2024',
  alahan: 'Tiada',
  avatar: 'N',
  color: 'bg-pink-500',
}

const penjaga = {
  name: 'Puan Hafizah bt Rahman',
  hubungan: 'Ibu',
  phone: '013-456 7890',
  email: 'hafizah@gmail.com',
  alamat: 'No. 12, Jalan Mawar 3, Taman Setia, Ampang',
  avatar: 'H',
}

export default function ParentProfilPage() {
  return (
    <div className="p-4 space-y-4">
      {/* Penjaga card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
            {penjaga.avatar}
          </div>
          <div>
            <p className="font-bold text-base">{penjaga.name}</p>
            <p className="text-blue-200 text-xs">{penjaga.hubungan} · Portal Penjaga</p>
          </div>
          <button className="ml-auto w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Edit2 size={13} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {[
            { icon: Phone,  val: penjaga.phone },
            { icon: Mail,   val: penjaga.email },
            { icon: MapPin, val: penjaga.alamat },
          ].map(({ icon: Icon, val }) => (
            <div key={val} className="flex items-center gap-2 text-xs text-blue-100">
              <Icon size={12} className="flex-shrink-0" />
              <span>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profil anak */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-700">Profil Anak</p>
          <button className="text-[10px] text-blue-600 font-semibold">Edit</button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl ${child.color} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
            {child.avatar}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{child.name}</p>
            <p className="text-xs text-slate-400">{child.kelas} · {child.umur}</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: 'No. MyKid',       val: child.noMyKid },
            { label: 'Tarikh Lahir',    val: child.dob },
            { label: 'Jantina',         val: child.jantina },
            { label: 'Tarikh Daftar',   val: child.tarikh_daftar },
            { label: 'Alahan',          val: child.alahan },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-[11px] text-slate-400">{label}</span>
              <span className="text-xs font-semibold text-slate-700">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {[
          { icon: Bell,   label: 'Tetapan Notifikasi',   sub: 'Urus notifikasi yang diterima' },
          { icon: Shield, label: 'Privasi & Keselamatan', sub: 'Tukar kata laluan, 2FA' },
        ].map(({ icon: Icon, label, sub }) => (
          <button key={label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-[10px] text-slate-400">{sub}</p>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </button>
        ))}
      </div>

      {/* Pakej */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-blue-800">Pakej Semasa</p>
          <span className="text-[10px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">Standard</span>
        </div>
        <p className="text-[10px] text-blue-600">Taska Nur Kasih · RM 350/bulan</p>
        <div className="mt-2 text-[10px] text-blue-500 space-y-0.5">
          <p>✓ Portal penjaga & laporan harian</p>
          <p>✓ Rekod yuran & resit</p>
          <p>✓ Pengumuman taska</p>
        </div>
      </div>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-red-500 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors">
        <LogOut size={15} />
        Log Keluar
      </button>
    </div>
  )
}
