'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const updates = [
  {
    id: 1, masa: '10:30 AM', tajuk: 'Aktiviti Seni & Kraf',
    body: 'Alia sangat seronok hari ini! Dia gembira mewarna dan berkreatif bersama rakan-rakannya di kelas.',
    tags: ['#Aktiviti', '#Seni & Kraf'],
    mood: '😄', hasPhoto: true,
    makan: { pagi: '✅', snek1: '✅', tengahari: '✅', snek2: '⬜', air: '6 gelas' },
    tidur: { masa: '12:30 PM', tempoh: '28 min', kualiti: 'Nyenyak' },
  },
  {
    id: 2, masa: '12:45 PM', tajuk: 'Waktu Makan Tengah Hari',
    body: 'Alia makan dengan baik hari ini. Habis semua lauk dan minum susu penuh. Semoga sihat selalu!',
    tags: ['#Makan', '#Sihat'],
    mood: '😊', hasPhoto: false,
    makan: null, tidur: null,
  },
  {
    id: 3, masa: '2:15 PM', tajuk: 'Masa Bebas & Bermain',
    body: 'Alia aktif bermain di taman permainan. Bergaul dengan rakan-rakan dengan sangat baik.',
    tags: ['#Main', '#Sosial'],
    mood: '🥳', hasPhoto: true,
    makan: null, tidur: null,
  },
]

const days = ['21 Mei', '20 Mei', '17 Mei', '16 Mei', '15 Mei']

export default function ParentAktivitiPage() {
  const [dayIdx, setDayIdx] = useState(0)

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-slate-900">Aktiviti Harian</h1>
        <p className="text-xs text-slate-400">Update harian dari cikgu untuk Nur Alia</p>
      </div>

      {/* Day selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setDayIdx(d => Math.min(days.length - 1, d + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-50">
            <ChevronLeft size={16} className="text-slate-400" />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">{days[dayIdx]} 2024</p>
            <p className="text-[10px] text-slate-400">{dayIdx === 0 ? 'Hari ini' : `${dayIdx} hari lepas`}</p>
          </div>
          <button onClick={() => setDayIdx(d => Math.max(0, d - 1))} disabled={dayIdx === 0} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-50 disabled:opacity-30">
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Ringkasan hari */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: '🍽️', label: 'Makan',  value: 'Baik' },
          { icon: '😴', label: 'Tidur',  value: '28 min' },
          { icon: '😄', label: 'Mood',   value: 'Gembira' },
          { icon: '💪', label: 'Sihat',  value: 'Baik' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-2.5 text-center">
            <span className="text-lg">{icon}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
            <p className="text-[11px] font-bold text-slate-700">{value}</p>
          </div>
        ))}
      </div>

      {/* Rekod Makan */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-700 mb-3">🍽️ Rekod Makan & Minum</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Sarapan Pagi',   val: '✅ Habis' },
            { label: 'Snek Pagi',      val: '✅ Habis' },
            { label: 'Makan Tengahari',val: '✅ Habis' },
            { label: 'Snek Petang',    val: '⬜ Belum' },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500">{label}</span>
              <span className="text-[10px] font-semibold text-slate-700">{val}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 p-2 bg-blue-50 rounded-lg">
          <span className="text-[10px] text-blue-600 font-medium">💧 Air Minum</span>
          <span className="text-[10px] font-bold text-blue-700">6 gelas</span>
        </div>
      </div>

      {/* Rekod Tidur */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-700 mb-3">😴 Tidur / Rehat</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Masa Tidur',  val: '12:30 PM' },
            { label: 'Tempoh',      val: '28 minit' },
            { label: 'Kualiti',     val: '😴 Nyenyak' },
          ].map(({ label, val }) => (
            <div key={label} className="bg-violet-50 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-violet-500">{label}</p>
              <p className="text-[11px] font-bold text-violet-700 mt-0.5">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Updates feed */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50">
          <p className="text-xs font-bold text-slate-900">Update dari Cikgu</p>
        </div>
        <div className="divide-y divide-slate-50">
          {updates.map(u => (
            <div key={u.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{u.mood}</span>
                  <p className="text-xs font-bold text-slate-900">{u.tajuk}</p>
                </div>
                <span className="text-[10px] text-slate-400">{u.masa}</span>
              </div>
              {u.hasPhoto && (
                <div className="w-full h-36 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl mb-3 flex items-center justify-center border border-slate-100">
                  <span className="text-slate-300 text-sm">📷 Foto Aktiviti</span>
                </div>
              )}
              <p className="text-xs text-slate-600 leading-relaxed">{u.body}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {u.tags.map(t => (
                  <span key={t} className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
