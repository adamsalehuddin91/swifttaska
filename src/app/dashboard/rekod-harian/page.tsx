'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Save, Send, CheckCircle2, Circle } from 'lucide-react'

const students = [
  { id: 1, name: 'Muhammad Harif bin Azri', kelas: 'Kelas Pelangi', umur: '4 Tahun', avatar: 'M', color: 'bg-blue-500',   doneToday: true  },
  { id: 2, name: 'Nur Alia bt Hafiz',        kelas: 'Kelas Ceria',   umur: '3 Tahun', avatar: 'N', color: 'bg-pink-500',   doneToday: false },
  { id: 3, name: 'Qaisara Insyirah bt Farid',kelas: 'Kelas Matahari',umur: '5 Tahun', avatar: 'Q', color: 'bg-purple-500', doneToday: false },
]

const moods = [
  { label: 'Gembira',   emoji: '😄', value: 'gembira' },
  { label: 'Aktif',     emoji: '⚡', value: 'aktif' },
  { label: 'Biasa',     emoji: '😐', value: 'biasa' },
  { label: 'Mengantuk', emoji: '😴', value: 'mengantuk' },
  { label: 'Tidak Sihat', emoji: '🤒', value: 'tidak-sihat' },
]

const makanOptions = ['Habis Semua', 'Separuh', 'Sedikit', 'Tidak Makan']
const minumOptions = ['Baik (3+ kali)', 'Sederhana', 'Kurang']

export default function RekodHarianPage() {
  const [studentIdx, setStudentIdx] = useState(0)
  const [date] = useState('21 Mac 2024 (Selasa)')
  const [tidur, setTidur] = useState(true)
  const [tidurMula, setTidurMula] = useState('01:30 PM')
  const [tidurTamat, setTidurTamat] = useState('03:10 PM')
  const [makan, setMakan] = useState('Habis Semua')
  const [minum, setMinum] = useState('Baik (3+ kali)')
  const [susuKali, setSusuKali] = useState(2)
  const [mood, setMood] = useState('gembira')
  const [statusKesihatan, setStatusKesihatan] = useState('Sihat')
  const [catatan, setCatatan] = useState('')
  const [doneList, setDoneList] = useState<number[]>(students.filter(s => s.doneToday).map(s => s.id))

  const student = students[studentIdx]
  const isStudentDone = doneList.includes(student.id)
  const doneCount = doneList.length

  const handleSimpan = () => {
    if (!doneList.includes(student.id)) setDoneList(prev => [...prev, student.id])
    const next = students.findIndex((_, i) => i > studentIdx && !doneList.includes(students[i].id))
    if (next !== -1) setStudentIdx(next)
  }

  const tidurDurasi = () => {
    const [mh, mm] = tidurMula.split(':').map(Number)
    const [th, tm] = tidurTamat.split(':').map(Number)
    const mins = (th * 60 + tm) - (mh * 60 + mm)
    if (mins <= 0) return '-'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h} jam ${m} min` : `${m} min`
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Rekod Harian Anak</h1>
          <p className="text-sm text-slate-500 mt-0.5">Catat aktiviti, tidur, makan dan kesihatan pelajar</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl">{date}</span>
          <button onClick={handleSimpan} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Send size={14} />
            Simpan Rekod
          </button>
        </div>
      </div>

      {/* Progress Hari Ini */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700">Rekod Hari Ini</p>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${doneCount === students.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-600'}`}>
            {doneCount}/{students.length} selesai
          </span>
        </div>
        <div className="flex gap-2">
          {students.map((s, i) => (
            <button key={s.id} onClick={() => setStudentIdx(i)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                i === studentIdx ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}>
              {doneList.includes(s.id)
                ? <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                : <Circle size={13} className="text-slate-300 shrink-0" />}
              {s.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Student Selector */}
      <div className={`bg-white rounded-2xl border-2 p-4 shadow-sm transition-colors ${isStudentDone ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setStudentIdx(Math.max(0, studentIdx - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500">
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full ${student.color} flex items-center justify-center text-white font-bold text-lg`}>
                {student.avatar}
              </div>
              {isStudentDone && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle2 size={11} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{student.name}</p>
                {isStudentDone && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Dah Rekod</span>}
              </div>
              <p className="text-sm text-slate-500">{student.kelas} · {student.umur}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{studentIdx + 1}</span><span>/</span><span>{students.length}</span>
          </div>
          <button onClick={() => setStudentIdx(Math.min(students.length - 1, studentIdx + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tidur & Rehat */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">😴</span>
              <h3 className="text-sm font-bold text-slate-900">Tidur / Rehat</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={tidur} onChange={e => setTidur(e.target.checked)} className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-500 transition-colors" />
              <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${tidur ? 'translate-x-5' : 'translate-x-0'}`} />
            </label>
          </div>
          {tidur && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Mula Tidur</label>
                  <input type="time" value={tidurMula.replace(' PM','').replace(' AM','')}
                    onChange={e => setTidurMula(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Bangun</label>
                  <input type="time" value={tidurTamat.replace(' PM','').replace(' AM','')}
                    onChange={e => setTidurTamat(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Tempoh Tidur</label>
                  <div className="px-2.5 py-1.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg">{tidurDurasi()}</div>
                </div>
              </div>
            </div>
          )}
          {!tidur && (
            <p className="text-sm text-slate-400 text-center py-2">Tidak tidur hari ini</p>
          )}
        </div>

        {/* Makan & Minum */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🍽️</span>
            <h3 className="text-sm font-bold text-slate-900">Makan & Minum</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sarapan / Makan Tengah Hari</label>
              <div className="flex gap-2 flex-wrap">
                {makanOptions.map(o => (
                  <button key={o} onClick={() => setMakan(o)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${makan === o ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Minum Air</label>
              <div className="flex gap-2 flex-wrap">
                {minumOptions.map(o => (
                  <button key={o} onClick={() => setMinum(o)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${minum === o ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Susu / Lumpkin</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setSusuKali(Math.max(0, susuKali - 1))}
                  className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">−</button>
                <span className="text-sm font-bold text-slate-900 w-8 text-center">{susuKali} kali</span>
                <button onClick={() => setSusuKali(susuKali + 1)}
                  className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Hari Ini */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">😊</span>
            <h3 className="text-sm font-bold text-slate-900">Mood Hari Ini</h3>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {moods.map(m => (
              <button key={m.value} onClick={() => setMood(m.value)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${mood === m.value ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Kesihatan */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏥</span>
            <h3 className="text-sm font-bold text-slate-900">Status Kesihatan</h3>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {['Sihat', 'Demam Ringan', 'Batuk', 'Selsema', 'Tidak Hadir'].map(s => (
                <button key={s} onClick={() => setStatusKesihatan(s)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${statusKesihatan === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Suhu Badan (°C)</label>
              <input type="number" step="0.1" defaultValue={36.5} min={35} max={42}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
        </div>

        {/* Catatan Guru */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📝</span>
            <h3 className="text-sm font-bold text-slate-900">Catatan Guru & Media Hari Ini</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <textarea
              rows={4}
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              placeholder="Tulis catatan mengenai aktiviti, tingkah laku, atau perkembangan pelajar hari ini..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 resize-none"
            />
            <div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors">
                    <span className="text-slate-300 text-xs">+ Foto</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          Batal
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors">
          <Save size={14} /> Simpan Draf
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Send size={14} /> Simpan Rekod
        </button>
      </div>
    </div>
  )
}
