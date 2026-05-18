'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useChild } from '../child-context'

type UpdateType = 'semua' | 'aktiviti' | 'makan' | 'tidur'

interface Update {
  id: number
  masa: string
  tajuk: string
  body: string
  tags: string[]
  mood: string
  hasPhoto: boolean
  type: UpdateType
  makan?: { pagi: string; snek1: string; tengahari: string; snek2: string; air: string } | null
  tidur?: { masa: string; tempoh: string; kualiti: string } | null
}

const allUpdates: Record<string, Update[]> = {
  alia: [
    {
      id: 1, type: 'aktiviti', masa: '10:30 AM', tajuk: 'Aktiviti Seni & Kraf',
      body: 'Alia sangat seronok hari ini! Dia gembira mewarna dan berkreatif bersama rakan-rakannya di kelas.',
      tags: ['#Aktiviti', '#Seni & Kraf'], mood: '😄', hasPhoto: true,
      makan: { pagi: '✅', snek1: '✅', tengahari: '✅', snek2: '⬜', air: '6 gelas' }, tidur: null,
    },
    {
      id: 2, type: 'makan', masa: '12:45 PM', tajuk: 'Waktu Makan Tengah Hari',
      body: 'Alia makan dengan baik hari ini. Habis semua lauk dan minum susu penuh. Semoga sihat selalu!',
      tags: ['#Makan', '#Sihat'], mood: '😊', hasPhoto: false,
      makan: null, tidur: null,
    },
    {
      id: 3, type: 'aktiviti', masa: '2:15 PM', tajuk: 'Masa Bebas & Bermain',
      body: 'Alia aktif bermain di taman permainan. Bergaul dengan rakan-rakan dengan sangat baik.',
      tags: ['#Main', '#Sosial'], mood: '🥳', hasPhoto: true,
      makan: null, tidur: null,
    },
  ],
  haziq: [
    {
      id: 1, type: 'aktiviti', masa: '9:00 AM', tajuk: 'Pagi Berbaris & Doa',
      body: 'Haziq ikut serta dalam aktiviti pagi dengan bersemangat dan tertib. Hafaz doa dengan baik!',
      tags: ['#Aktiviti', '#Rutin'], mood: '😊', hasPhoto: false,
      makan: null, tidur: null,
    },
    {
      id: 2, type: 'makan', masa: '10:30 AM', tajuk: 'Snek Pagi',
      body: 'Haziq makan snek pagi dengan baik. Habis biskut dan minum susu penuh.',
      tags: ['#Makan'], mood: '😄', hasPhoto: false,
      makan: { pagi: '✅', snek1: '✅', tengahari: '⬜', snek2: '⬜', air: '4 gelas' }, tidur: null,
    },
    {
      id: 3, type: 'tidur', masa: '1:00 PM', tajuk: 'Waktu Rehat Tengah Hari',
      body: 'Haziq tidur dengan lena selama 45 minit. Bangun dengan segar dan bersedia untuk aktiviti petang.',
      tags: ['#Tidur', '#Rehat'], mood: '😴', hasPhoto: false,
      makan: null, tidur: { masa: '1:00 PM', tempoh: '45 minit', kualiti: '😴 Lena' },
    },
    {
      id: 4, type: 'aktiviti', masa: '3:00 PM', tajuk: 'Blok Bina & Kreativiti',
      body: 'Haziq sangat fokus membangun rumah dengan blok. Menunjukkan kreativiti yang bagus!',
      tags: ['#Aktiviti', '#Kreativiti'], mood: '🥳', hasPhoto: true,
      makan: null, tidur: null,
    },
  ],
}

const daySelectorData: Record<string, string[]> = {
  alia:  ['18 Mei', '17 Mei', '16 Mei', '15 Mei', '14 Mei'],
  haziq: ['18 Mei', '17 Mei', '16 Mei', '15 Mei', '14 Mei'],
}

const summaryData: Record<string, { icon: string; label: string; value: string }[]> = {
  alia:  [
    { icon: '🍽️', label: 'Makan',  value: 'Baik' },
    { icon: '😴', label: 'Tidur',  value: '28 min' },
    { icon: '😄', label: 'Mood',   value: 'Gembira' },
    { icon: '💪', label: 'Sihat',  value: 'Baik' },
  ],
  haziq: [
    { icon: '🍽️', label: 'Makan',  value: 'Sederhana' },
    { icon: '😴', label: 'Tidur',  value: '45 min' },
    { icon: '😊', label: 'Mood',   value: 'Tenang' },
    { icon: '💪', label: 'Sihat',  value: 'Baik' },
  ],
}

const makanData: Record<string, Record<string, string>> = {
  alia:  { 'Sarapan Pagi': '✅ Habis', 'Snek Pagi': '✅ Habis', 'Makan Tengahari': '✅ Habis', 'Snek Petang': '⬜ Belum' },
  haziq: { 'Sarapan Pagi': '✅ Habis', 'Snek Pagi': '✅ Habis', 'Makan Tengahari': '⬜ Belum', 'Snek Petang': '⬜ Belum' },
}

const airData: Record<string, string> = { alia: '6 gelas', haziq: '4 gelas' }

const tidurData: Record<string, { masa: string; tempoh: string; kualiti: string } | null> = {
  alia:  { masa: '12:30 PM', tempoh: '28 minit', kualiti: '😴 Nyenyak' },
  haziq: { masa: '1:00 PM',  tempoh: '45 minit', kualiti: '😴 Lena' },
}

const filters: { key: UpdateType; label: string }[] = [
  { key: 'semua',    label: 'Semua' },
  { key: 'aktiviti', label: 'Aktiviti' },
  { key: 'makan',    label: 'Makan' },
  { key: 'tidur',    label: 'Tidur' },
]

export default function ParentAktivitiPage() {
  const { activeChild } = useChild()
  const childId = activeChild.id as keyof typeof allUpdates
  const [dayIdx, setDayIdx] = useState(0)
  const [filter, setFilter] = useState<UpdateType>('semua')

  const days = daySelectorData[childId] ?? daySelectorData.alia
  const updates = allUpdates[childId] ?? allUpdates.alia
  const summary = summaryData[childId] ?? summaryData.alia
  const makan = makanData[childId] ?? makanData.alia
  const tidur = tidurData[childId] ?? tidurData.alia

  const filtered = filter === 'semua' ? updates : updates.filter(u => u.type === filter)

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-slate-900">Aktiviti Harian</h1>
        <p className="text-xs text-slate-400">Update harian dari cikgu untuk {activeChild.name}</p>
      </div>

      {/* Day selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setDayIdx(d => Math.min(days.length - 1, d + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-50">
            <ChevronLeft size={16} className="text-slate-400" />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">{days[dayIdx]} 2025</p>
            <p className="text-[10px] text-slate-400">{dayIdx === 0 ? 'Hari ini' : `${dayIdx} hari lepas`}</p>
          </div>
          <button onClick={() => setDayIdx(d => Math.max(0, d - 1))} disabled={dayIdx === 0} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-50 disabled:opacity-30">
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Ringkasan hari */}
      <div className="grid grid-cols-4 gap-2">
        {summary.map(({ icon, label, value }) => (
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
          {Object.entries(makan).map(([label, val]) => (
            <div key={label} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500">{label}</span>
              <span className="text-[10px] font-semibold text-slate-700">{val}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 p-2 bg-blue-50 rounded-lg">
          <span className="text-[10px] text-blue-600 font-medium">💧 Air Minum</span>
          <span className="text-[10px] font-bold text-blue-700">{airData[childId] ?? airData.alia}</span>
        </div>
      </div>

      {/* Rekod Tidur */}
      {tidur && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs font-bold text-slate-700 mb-3">😴 Tidur / Rehat</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Masa Tidur', val: tidur.masa },
              { label: 'Tempoh',     val: tidur.tempoh },
              { label: 'Kualiti',    val: tidur.kualiti },
            ].map(({ label, val }) => (
              <div key={label} className="bg-violet-50 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-violet-500">{label}</p>
                <p className="text-[11px] font-bold text-violet-700 mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-colors ${
              filter === f.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-500 border border-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Updates feed */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-900">Update dari Cikgu</p>
          <span className="text-[10px] text-slate-400">{filtered.length} rekod</span>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-xs text-slate-400">Tiada rekod untuk kategori ini</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(u => (
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
        )}
      </div>
    </div>
  )
}
