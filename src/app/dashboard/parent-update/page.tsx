'use client'

import { useState } from 'react'
import { Search, Plus, Image, Video, Smile, Send, ChevronRight } from 'lucide-react'

const updates = [
  {
    id: 1, name: 'Aiyah Humami', kelas: 'Kelas Pelangi', masa: '10:30 AM',
    caption: 'Alia sangat seronok hari ini! Dia gembira mewarna dan berkreatif bersama rakan-rakan.',
    tags: ['#Aktiviti', '#Seni & Kraf'],
    media: true, avatar: 'A', color: 'bg-pink-500', liked: true,
  },
  {
    id: 2, name: 'Muhammad Harif', kelas: 'Kelas Pelangi', masa: '10:15 AM',
    caption: 'Harif makan dengan baik hari ini. Habis semua lauk dan minum susu penuh!',
    tags: ['#Makan'],
    media: false, avatar: 'M', color: 'bg-blue-500', liked: false,
  },
  {
    id: 3, name: 'Nur Alia', kelas: 'Kelas Ceria', masa: '09:50 AM',
    caption: 'Tidur petang yang nyenyak. Bangun dengan ceria dan terus main puzzle!',
    tags: ['#Tidur'],
    media: false, avatar: 'N', color: 'bg-purple-500', liked: false,
  },
  {
    id: 4, name: 'Arif Danial', kelas: 'Kelas Ceria', masa: '09:30 AM',
    caption: 'Arif berjaya menyelesaikan aktiviti warna-warni hari ini. Tahniah!',
    tags: ['#Aktiviti'],
    media: true, avatar: 'A', color: 'bg-emerald-500', liked: false,
  },
  {
    id: 5, name: 'Sara Safiyya', kelas: 'Kelas Pelangi', masa: '09:10 AM',
    caption: 'Sara sangat aktif semasa sesi senaman pagi. Semua gerakan dibuat dengan betul.',
    tags: ['#Senaman', '#Perkembangan'],
    media: false, avatar: 'S', color: 'bg-orange-500', liked: false,
  },
]

const statCards = [
  { label: 'Update Hari Ini',           value: 18, color: 'bg-blue-500',   icon: '📋' },
  { label: 'Mesej Sandbox',             value: 6,  color: 'bg-orange-400', icon: '💬' },
  { label: 'Dikongsikan Dengan Waris',  value: 42, color: 'bg-emerald-500',icon: '👥' },
  { label: 'Media Fail',                value: 86, color: 'bg-violet-500', icon: '🖼️' },
]

const detailUpdate = updates[0]

export default function ParentUpdatePage() {
  const [selected, setSelected] = useState(updates[0].id)
  const [search, setSearch] = useState('')
  const [caption, setCaption] = useState('')
  const [kelas, setKelas] = useState('Semua Kelas')

  const selectedUpdate = updates.find(u => u.id === selected) ?? updates[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Parent Update</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kongsi aktiviti pelajar dengan ibu bapa</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={15} />
          Buat Update Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {statCards.map(({ label, value, color, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-lg flex-shrink-0`}>
              {icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama pelajar..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
          />
        </div>
        <select value={kelas} onChange={e => setKelas(e.target.value)}
          className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
          <option>Semua Kelas</option>
          <option>Kelas Ceria</option>
          <option>Kelas Pelangi</option>
          <option>Kelas Matahari</option>
        </select>
        <input type="date" defaultValue="2024-05-21"
          className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none" />
        <select className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
          <option>Semua Guru</option>
        </select>
      </div>

      {/* Main: Feed + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Feed List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
            <h3 className="text-sm font-semibold text-slate-900">Senarai Update Terkini</h3>
            <button className="text-xs text-blue-600 font-medium">Lihat Lebih Banyak</button>
          </div>
          <div className="divide-y divide-slate-50">
            {updates.map(u => (
              <div
                key={u.id}
                onClick={() => setSelected(u.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selected === u.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
              >
                <div className={`w-9 h-9 rounded-full ${u.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {u.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{u.masa}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{u.caption}</p>
                  <div className="flex gap-1 mt-1">
                    {u.tags.map(t => (
                      <span key={t} className="text-[10px] bg-blue-50 text-blue-600 font-medium px-1.5 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                {selected === u.id && <ChevronRight size={14} className="text-blue-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Update Detail */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <h3 className="text-sm font-semibold text-slate-900">Perincian Update</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
                <button className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Hantar ke Waris</button>
              </div>
            </div>
            <div className="p-5">
              {/* Student header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${selectedUpdate.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {selectedUpdate.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedUpdate.name}</p>
                  <p className="text-xs text-slate-500">{selectedUpdate.kelas} · {selectedUpdate.masa}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded-full">Dikongsikan</span>
                </div>
              </div>

              {/* Media placeholder */}
              <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                <div className="text-center">
                  <Image size={28} className="mx-auto text-slate-300 mb-1" />
                  <p className="text-xs text-slate-400">Foto Aktiviti</p>
                </div>
              </div>

              {/* Caption */}
              <p className="text-sm text-slate-700 leading-relaxed mb-3">{selectedUpdate.caption}</p>
              <div className="flex gap-1.5 flex-wrap">
                {selectedUpdate.tags.map(t => (
                  <span key={t} className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Compose new update */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-slate-900 mb-3">Tulis Update Baharu</p>
            <div className="flex items-center gap-2 mb-3">
              <select className="text-xs text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none">
                <option>Pilih Pelajar...</option>
                {updates.map(u => <option key={u.id}>{u.name}</option>)}
              </select>
              <select className="text-xs text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none">
                <option>Pilih Tag...</option>
                <option>#Aktiviti</option>
                <option>#Makan</option>
                <option>#Tidur</option>
                <option>#Seni & Kraf</option>
              </select>
            </div>
            <textarea
              rows={3}
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Tulis update untuk ibu bapa..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                  <Image size={14} /> Foto
                </button>
                <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                  <Video size={14} /> Video
                </button>
                <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                  <Smile size={14} /> Emoji
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
                <Send size={12} /> Hantar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
