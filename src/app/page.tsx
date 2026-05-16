import Link from "next/link";
import { Check, Star, Zap, Shield, Users, Phone } from "lucide-react";

const features = [
  { icon: "👨‍👩‍👧", title: "Pengurusan Pelajar", desc: "Profil lengkap kanak-kanak, biodata, rekod kesihatan dan maklumat penjaga dalam satu tempat." },
  { icon: "📋", title: "Kehadiran QR Digital", desc: "Imbas QR, kehadiran terus direkod. Laporan bulanan auto-generate untuk pihak JKM." },
  { icon: "💰", title: "Pengurusan Yuran", desc: "Rekod bayaran, jana resit digital, notifikasi tertunggak — tiada lagi Microsoft Excel." },
  { icon: "📱", title: "Parent PWA", desc: "Ibu bapa boleh tengok kehadiran, aktiviti & rekod harian anak terus dari telefon — tanpa install app." },
  { icon: "📢", title: "Pengumuman & Aktiviti", desc: "Hantar notifikasi kepada semua ibu bapa serentak. Jadual aktiviti, cuti umum & event taska." },
  { icon: "📊", title: "Laporan & Analitik", desc: "Dashboard statistik kehadiran, kutipan yuran, rekod harian — semua dalam satu pandangan." },
];

const plans = [
  {
    name: "Basic",
    tagline: "Taska kecil, permulaan digital",
    setup: "RM 3,000",
    monthly: "RM 200",
    color: "border-slate-200",
    badge: null,
    features: [
      "Sehingga 30 pelajar",
      "Pengurusan pelajar & penjaga",
      "Kehadiran QR digital",
      "Parent PWA (baca sahaja)",
      "1 akaun pengguna",
      "Sokongan via WhatsApp",
    ],
  },
  {
    name: "Standard",
    tagline: "Paling popular untuk taska aktif",
    setup: "RM 5,000",
    monthly: "RM 300",
    color: "border-blue-500",
    badge: "Paling Popular",
    features: [
      "Sehingga 80 pelajar",
      "Semua ciri Basic",
      "Pengurusan yuran & resit digital",
      "Rekod harian (makan/tidur/mood)",
      "Pengumuman & aktiviti",
      "3 akaun pengguna",
      "Laporan bulanan PDF",
      "Sokongan prioriti",
    ],
  },
  {
    name: "Premium",
    tagline: "Multi-kelas, operasi penuh",
    setup: "RM 8,000",
    monthly: "RM 450",
    color: "border-indigo-400",
    badge: null,
    features: [
      "Pelajar tidak terhad",
      "Semua ciri Standard",
      "Multi-kelas & multi-cawangan",
      "Pengurusan guru & jadual",
      "HR asas (slip gaji, cuti)",
      "Laporan advanced & eksport",
      "Akaun pengguna tidak terhad",
      "Sokongan dedicated + onsite setup",
    ],
  },
];

const paymentSteps = [
  { step: "50%", label: "Deposit", desc: "Bayar separuh sebelum kerja mula — untuk confirm tempahan." },
  { step: "30%", label: "Demo Siap", desc: "Bayar selepas anda setuju dengan demo sistem." },
  { step: "20%", label: "Go-Live", desc: "Bayar baki selepas sistem live dan anda berpuas hati." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900">SwiftTaska</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/60XXXXXXXXX" className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
              <Phone size={15} /> Hubungi Kami
            </a>
            <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Cuba Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Sistem Pengurusan Taska #1 Malaysia
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight mb-5">
            Uruskan Taska Anda<br />
            <span className="text-blue-600">Lebih Mudah & Professional</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 mb-8 max-w-2xl mx-auto">
            Dari kehadiran QR, rekod harian, yuran hingga parent app — semua dalam satu sistem.
            Ibu bapa pun boleh pantau anak dari telefon tanpa download app.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Cuba Demo Percuma →
            </Link>
            <a href="#pricing" className="border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-slate-50 transition-colors">
              Lihat Harga
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-4">Tiada kontrak jangka panjang · Setup dalam 3-5 hari bekerja</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Semua Yang Taska Anda Perlukan</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Direka khas untuk taska swasta Malaysia — bukan sistem generik dari luar negara.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Pilih Pakej Yang Sesuai</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Harga telus, tanpa caj tersembunyi. Setup sekali, langganan bulanan yang berbaloi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl border-2 ${plan.color} p-7 flex flex-col ${plan.badge ? "shadow-xl shadow-blue-100 scale-[1.02]" : "shadow-sm"}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                      ⭐ {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-400">{plan.tagline}</p>
                </div>

                <div className="mb-2">
                  <p className="text-sm text-slate-500 mb-0.5">Setup (sekali bayar)</p>
                  <p className="text-2xl font-extrabold text-slate-900">{plan.setup}</p>
                </div>
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <p className="text-sm text-slate-500 mb-0.5">Langganan bulanan</p>
                  <p className="text-3xl font-extrabold text-blue-600">{plan.monthly}<span className="text-base font-normal text-slate-400">/bln</span></p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/60XXXXXXXXX"
                  className={`block text-center py-3 rounded-xl font-bold text-sm transition-colors ${
                    plan.badge
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Dapatkan Pakej {plan.name}
                </a>
              </div>
            ))}
          </div>

          {/* Payment terms */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-1.5 text-center">Cara Bayaran Setup Fee</h3>
            <p className="text-sm text-slate-400 text-center mb-8">Bayaran dibahagi 3 fasa — ringan untuk cash flow taska anda.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {paymentSteps.map((s, i) => (
                <div key={s.step} className="text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-700 font-extrabold text-lg">{s.step}</span>
                  </div>
                  <p className="font-bold text-slate-900 mb-1">{s.label}</p>
                  <p className="text-sm text-slate-500">{s.desc}</p>
                  {i < 2 && (
                    <div className="hidden sm:block absolute right-0 top-1/2 text-slate-300 text-2xl">→</div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-slate-400 mt-6">
              Pakej Premium: boleh bayar setup dalam 3 ansuran bulanan (RM2,700 → RM2,700 → RM2,600)
            </p>
          </div>
        </div>
      </section>

      {/* Social proof / Why SwiftTaska */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Kenapa Pilih SwiftTaska?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Shield size={26} className="text-emerald-600" />
              </div>
              <p className="font-bold text-slate-900">Dibina untuk Malaysia</p>
              <p className="text-sm text-slate-500">UI penuh Bahasa Malaysia. Sesuai dengan workflow taska tempatan dan keperluan JKM.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Users size={26} className="text-blue-600" />
              </div>
              <p className="font-bold text-slate-900">Parent App Percuma</p>
              <p className="text-sm text-slate-500">Ibu bapa pantau anak dari telefon — kehadiran, aktiviti, yuran. Tak perlu install apa-apa.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center">
                <Zap size={26} className="text-violet-600" />
              </div>
              <p className="font-bold text-slate-900">Go-Live dalam 5 Hari</p>
              <p className="text-sm text-slate-500">Setup cepat, training included, sokongan WhatsApp terus dengan developer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Sedia Untuk Mulakan?</h2>
          <p className="text-blue-100 mb-8">Cuba demo percuma dulu — lihat sendiri macam mana sistem ni boleh bantu taska anda.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Cuba Demo Sekarang
            </Link>
            <a href="https://wa.me/60XXXXXXXXX" className="border border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              WhatsApp Kami
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-white font-bold">SwiftTaska</span>
          </div>
          <p className="text-sm">© 2025 SwiftTaska by SwiftApps · Sistem Pengurusan Taska Malaysia</p>
          <div className="flex gap-4 text-sm">
            <Link href="/dashboard" className="hover:text-white transition-colors">Demo</Link>
            <a href="#pricing" className="hover:text-white transition-colors">Harga</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
