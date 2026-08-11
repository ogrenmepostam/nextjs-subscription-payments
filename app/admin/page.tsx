'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  // 1. ŞİFRE KORUMASI (Auth State)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Admin Şifresi (Gerekirse değiştirebilirsin)
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'fladnag2026';

  // Sayfa yüklendiğinde oturum kontrolü
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  // 2. FORM & EŞLEŞTİRME STATE'LERİ
  const [adminUsdtAddress, setAdminUsdtAddress] = useState('T9yD14Nj9j7xAB4... (Örnek Admin TRC20)');
  const [isWalletSaved, setIsWalletSaved] = useState(false);

  // Şirket ↔ Creator Eşleştirme Form State
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCreator, setSelectedCreator] = useState('');
  const [brandCommissionRate, setBrandCommissionRate] = useState('10'); // Şirketten alınacak komisyon %
  const [creatorShareRate, setCreatorShareRate] = useState('5'); // Creator'a verilecek %
  const [matchSuccess, setMatchSuccess] = useState(false);

  // ŞİFRE EKRANI (Giriş Yapılmadıysa Bu Görünür)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-emerald-500 text-black font-extrabold rounded p-1.5 text-sm">F</div>
            <span className="font-bold text-xl tracking-wide">fladnag Admin</span>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">Yönetim Paneli Girişi</h2>
          <p className="text-xs text-gray-400 text-center mb-6">
            Bu alana sadece yetkili yönetici erişebilir. Lütfen admin şifrenizi giriniz.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Admin Şifresi"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-500 text-center font-medium">
                Hatalı şifre! Lütfen tekrar deneyin.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-lg text-sm transition"
            >
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // PANEL EKRANI (Giriş Yapıldıysa Görünür)
  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Üst Bar */}
      <header className="max-w-7xl mx-auto flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500 text-black font-extrabold px-2.5 py-1 rounded text-xs">F</span>
          <h1 className="text-xl font-bold text-white tracking-wide">fladnag Yönetim Paneli</h1>
          <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] px-2.5 py-0.5 rounded-full font-mono">
            GİZLİ ADMIN
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            Ana Sayfaya Dön
          </Link>
          <button
            onClick={handleLogout}
            className="bg-zinc-900 hover:bg-zinc-800 text-red-400 border border-zinc-800 px-3 py-1.5 rounded transition"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* 1. FİNANSAL VE GENEL ÖZET METRİKLERİ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Net Admin Geliri (Komisyon)</p>
            <p className="text-2xl font-bold text-emerald-400">$0.00 USDT</p>
            <span className="text-[10px] text-gray-500 mt-1 block">%5 Platform kârı</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Şirketlerden Alacak Tutarı</p>
            <p className="text-2xl font-bold text-amber-400">$0.00 USDT</p>
            <span className="text-[10px] text-gray-500 mt-1 block">Şirketlerin ödemesi gereken</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Creator'lara Ödenecek Borç</p>
            <p className="text-2xl font-bold text-blue-400">$0.00 USDT</p>
            <span className="text-[10px] text-gray-500 mt-1 block">Creator hakedişleri</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Aktif Şirket / Creator</p>
            <p className="text-2xl font-bold text-white">0 / 0</p>
            <span className="text-[10px] text-gray-500 mt-1 block">Sistemdeki toplam kayıt</span>
          </div>
        </div>

        {/* 2. ADMIN USDT CÜZDAN ADRESİ BÖLÜMÜ */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-base font-bold text-white mb-1">Admin USDT Cüzdan Adresi (Ödeme Alma Adresi)</h2>
          <p className="text-xs text-gray-400 mb-4">
            Şirket panellerinde görünecek olan USDT cüzdan adresinizdir. Şirketler ödemeyi bu adrese gönderecektir.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={adminUsdtAddress}
              onChange={(e) => setAdminUsdtAddress(e.target.value)}
              className="flex-1 bg-black border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              placeholder="TRC20 / ERC20 USDT Adresinizi giriniz"
            />
            <button
              onClick={() => {
                setIsWalletSaved(true);
                setTimeout(() => setIsWalletSaved(false), 3000);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-lg text-xs transition"
            >
              Adresi Kaydet
            </button>
          </div>
          {isWalletSaved && <p className="text-xs text-emerald-400 mt-2">✓ USDT Adresiniz güncellendi.</p>}
        </div>

        {/* 3. ŞİRKET ↔ CREATOR EŞLEŞTİRME PANELİ (PROJECT.md Madde 8.6) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-base font-bold text-white mb-1">Şirket ↔ Creator Manuel Eşleştirme</h2>
            <p className="text-xs text-gray-400 mb-6">
              Gelir modeli eşleştirmesi buradan yapılır. Creator bağımsız şirket seçemez.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMatchSuccess(true);
                setTimeout(() => setMatchSuccess(false), 3000);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs text-gray-400 block mb-1">Şirket (Brand) Seç</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Şirket Seçiniz --</option>
                  <option value="brand_1">Acme SaaS Inc. (Affiliate Yok)</option>
                  <option value="brand_2">TechProduct Ltd.</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">İçerik Üretici (Creator) Seç</label>
                <select
                  value={selectedCreator}
                  onChange={(e) => setSelectedCreator(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Creator Seçiniz --</option>
                  <option value="creator_1">Alex Rivers (Tech Reviewer)</option>
                  <option value="creator_2">Sarah Jenkins (Design & SaaS)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Şirket Toplam Komisyonu (%)</label>
                  <input
                    type="number"
                    value={brandCommissionRate}
                    onChange={(e) => setBrandCommissionRate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-white"
                    placeholder="Örn: 10"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Creator Payı (%)</label>
                  <input
                    type="number"
                    value={creatorShareRate}
                    onChange={(e) => setCreatorShareRate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-white"
                    placeholder="Örn: 5"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-lg text-xs transition"
              >
                Eşleştirmeyi Onayla ve Kaydet
              </button>

              {matchSuccess && (
                <p className="text-xs text-emerald-400 text-center font-medium">
                  ✓ Şirket ve Creator başarıyla eşleştirildi!
                </p>
              )}
            </form>
          </div>

          {/* 4. WEBHOOK VE SİPARİŞ TAKİP ALANI */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-base font-bold text-white mb-1">Gelen Webhook Verileri & Siparişler</h2>
            <p className="text-xs text-gray-400 mb-6">
              Şirketlerin API/Webhook sisteminden otomatik düşen sipariş verileri.
            </p>

            <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center text-xs text-gray-500">
              Henüz tetiklenen bir webhook isteği veya gelen sipariş bulunmuyor.
            </div>
          </div>
        </div>

        {/* 5. ÖDEME ONAY LİSTESİ (MANUEL ÖDENDİ İŞARETLEME - PROJECT.md Madde 8.7) */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-base font-bold text-white mb-1">Borç / Alacak ve Ödeme Takip Tablosu</h2>
          <p className="text-xs text-gray-400 mb-6">
            Blockchain üzerinden USDT transferini kontrol ettikten sonra manuel olarak "Ödendi" durumuna getirebilirsiniz.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-zinc-900 text-gray-300 border-b border-zinc-800">
                <tr>
                  <th className="p-3">Tür</th>
                  <th className="p-3">Taraf / Kullanıcı</th>
                  <th className="p-3">Tutar</th>
                  <th className="p-3">USDT Cüzdan Adresi</th>
                  <th className="p-3">Son Ödeme Tarihi</th>
                  <th className="p-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr>
                  <td className="p-3 text-emerald-400 font-medium">Alacak (Şirket)</td>
                  <td className="p-3 text-white">Acme SaaS Inc.</td>
                  <td className="p-3 text-white">$150.00 USDT</td>
                  <td className="p-3 text-gray-500 font-mono">Admin Adresi Gösterildi</td>
                  <td className="p-3">2026-09-01</td>
                  <td className="p-3 text-right">
                    <button className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded text-[11px] transition">
                      "Şirket Ödedi" İşaretle
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-blue-400 font-medium">Ödeme (Creator)</td>
                  <td className="p-3 text-white">Alex Rivers</td>
                  <td className="p-3 text-white">$75.00 USDT</td>
                  <td className="p-3 text-gray-500 font-mono">T9yD14Nj9j7x...</td>
                  <td className="p-3">2026-09-15</td>
                  <td className="p-3 text-right">
                    <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded text-[11px] transition">
                      "Creator'a Ödendi" İşaretle
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
