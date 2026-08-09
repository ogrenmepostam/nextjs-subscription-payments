import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Üst Bar */}
      <header className="max-w-7xl mx-auto flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500 text-black font-extrabold px-2.5 py-1 rounded text-xs">F</span>
          <h1 className="text-xl font-bold text-white tracking-wide">fladnag Yönetim Paneli</h1>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-emerald-400 font-medium">● Sistem Aktif</span>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Ana Sayfaya Dön →
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* İstatistik Özet Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Toplam Onaylanan Satış</p>
            <p className="text-2xl font-bold text-white">$0.00</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Dağıtılacak USDT Komisyonu</p>
            <p className="text-2xl font-bold text-emerald-400">0.00 USDT</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Aktif Marka / Kampanya</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Kayıtlı İçerik Üreticisi</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
        </div>

        {/* Hızlı İşlem & Takip Alanı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon: Son Kampanyalar */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-base font-bold text-white mb-4">Aktif Kampanyalar ve Bütçeler</h2>
            <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center text-xs text-gray-500">
              Henüz eklenmiş bir marka veya kampanya bulunmuyor.
            </div>
          </div>

          {/* Sağ Kolon: Onay Bekleyen USDT Ödemeleri */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-base font-bold text-white mb-4">Bekleyen USDT Çekimleri</h2>
            <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center text-xs text-gray-500">
              Onay bekleyen çekim talebi yok.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
