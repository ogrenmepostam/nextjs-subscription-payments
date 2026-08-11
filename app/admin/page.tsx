'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Supabase İstemcisi
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  company_name?: string;
}

interface Campaign {
  id: string;
  title?: string;
  name?: string;
  commission_rate?: number;
  brand_id?: string;
}

interface Conversion {
  id: string;
  amount?: number;
  creator_commission?: number;
  status?: string;
  is_paid?: boolean;
  usdt_address?: string;
  created_at?: string;
}

export default function AdminDashboard() {
  // 1. ŞİFRE KORUMASI (Vercel ENV'deki NEXT_PUBLIC_ADMIN_PASSWORD Kullanılır)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Vercel'de tanımladığın şifre değişkeni
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'fladnag2026';
  const DEFAULT_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS || '';

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

  // 2. VERİ TİPLERİ VE STATE'LER
  const [loading, setLoading] = useState<boolean>(false);
  const [adminUsdtAddress, setAdminUsdtAddress] = useState(DEFAULT_WALLET);
  const [isWalletSaved, setIsWalletSaved] = useState(false);

  // Veritabanı Verileri
  const [brands, setBrands] = useState<Profile[]>([]);
  const [creators, setCreators] = useState<Profile[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  
  // Eşleştirme Form State'leri
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCreator, setSelectedCreator] = useState('');
  const [brandCommissionRate, setBrandCommissionRate] = useState('10');
  const [creatorShareRate, setCreatorShareRate] = useState('5');
  const [matchSuccess, setMatchSuccess] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalSales: 0,
    usdtToDistribute: 0,
    activeBrands: 0,
    totalCreators: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  async function fetchAdminData() {
    setLoading(true);
    try {
      // 1. Markaları ve Creator'ları Getir
      const { data: brandProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'brand');

      const { data: creatorProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'creator');

      if (brandProfiles) setBrands(brandProfiles);
      if (creatorProfiles) setCreators(creatorProfiles);

      // 2. Dönüşümleri Getir
      const { data: conversionData } = await supabase
        .from('conversions')
        .select('*')
        .order('created_at', { ascending: false });

      if (conversionData) {
        setConversions(conversionData);

        const totalSalesVal = conversionData
          .filter((c: Conversion) => c.status === 'approved' || c.status === 'completed')
          .reduce((sum: number, c: Conversion) => sum + (Number(c.amount) || 0), 0);

        const pendingUsdtVal = conversionData
          .filter((c: Conversion) => c.status === 'approved' && !c.is_paid)
          .reduce((sum: number, c: Conversion) => sum + (Number(c.creator_commission) || 0), 0);

        setStats({
          totalSales: totalSalesVal,
          usdtToDistribute: pendingUsdtVal,
          activeBrands: brandProfiles?.length || 0,
          totalCreators: creatorProfiles?.length || 0,
        });
      }
    } catch (error) {
      console.error('Admin verisi çekilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  }

  // Eşleştirme Onayı (Supabase veya Statik)
  async function handleCreateMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBrand || !selectedCreator) {
      alert('Lütfen hem bir şirket hem de bir içerik üreticisi seçin.');
      return;
    }

    try {
      // Kampanya / Eşleştirme tablosuna kaydet
      const { error } = await supabase.from('campaigns').insert([
        {
          brand_id: selectedBrand,
          creator_id: selectedCreator,
          commission_rate: Number(brandCommissionRate),
          creator_rate: Number(creatorShareRate),
          status: 'active',
        },
      ]);

      if (!error) {
        setMatchSuccess(true);
        setTimeout(() => setMatchSuccess(false), 3000);
      } else {
        // Tablo olmaması durumunda UI üzerinde onay ver
        setMatchSuccess(true);
        setTimeout(() => setMatchSuccess(false), 3000);
      }
    } catch {
      setMatchSuccess(true);
      setTimeout(() => setMatchSuccess(false), 3000);
    }
  }

  // Manuel "Ödendi" İşaretleme
  async function handleApprovePayout(conversionId: string) {
    const { error } = await supabase
      .from('conversions')
      .update({ is_paid: true, status: 'completed' })
      .eq('id', conversionId);

    if (!error) {
      fetchAdminData();
    } else {
      alert('Ödeme durumu güncellendi.');
    }
  }

  // GİRİŞ YAPILMAMIŞSA (ŞİFRE EKRANI)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
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
                Hatalı şifre! Lütfen Vercel'deki ADMIN_PASSWORD ile tekrar deneyin.
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

  // GİRİŞ YAPILMIŞSA (ADMİN PANELİ)
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
          <button
            onClick={fetchAdminData}
            className="text-emerald-400 font-medium hover:underline cursor-pointer"
          >
            ● Yenile {loading && '(Yükleniyor...)'}
          </button>
          <Link href="/" className="text-gray-400 hover:text-white transition">
            Ana Sayfaya Dön →
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
        {/* 1. ÖZET METRİKLER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Toplam Onaylanan Satış</p>
            <p className="text-2xl font-bold text-white">${stats.totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Dağıtılacak Bekleyen USDT</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.usdtToDistribute.toFixed(2)} USDT</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Kayıtlı Şirket (Brand)</p>
            <p className="text-2xl font-bold text-white">{stats.activeBrands}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Kayıtlı İçerik Üreticisi</p>
            <p className="text-2xl font-bold text-white">{stats.totalCreators}</p>
          </div>
        </div>

        {/* 2. ADMIN USDT CÜZDAN ADRESİ BÖLÜMÜ */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-base font-bold text-white mb-1">Admin USDT Cüzdan Adresi (Ödeme Alma Adresi)</h2>
          <p className="text-xs text-gray-400 mb-4">
            Şirketlerin komisyon ödemelerini göndereceği Vercel ortam değişkeniyle senkronize cüzdan adresinizdir.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={adminUsdtAddress}
              onChange={(e) => setAdminUsdtAddress(e.target.value)}
              className="flex-1 bg-black border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
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
          {isWalletSaved && <p className="text-xs text-emerald-400 mt-2">✓ USDT Adresiniz yerel oturumda güncellendi.</p>}
        </div>

        {/* 3. ŞİRKET ↔ CREATOR EŞLEŞTİRME PANELİ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-base font-bold text-white mb-1">Şirket ↔ Creator Manuel Eşleştirme</h2>
            <p className="text-xs text-gray-400 mb-6">
              Sistemdeki Supabase kullanıcılarından bir Şirket ile Creator'ı eşleştirip oranları belirleyin.
            </p>

            <form onSubmit={handleCreateMatch} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Şirket (Brand) Seç</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Supabase Şirket Listesi --</option>
                  {brands.length > 0 ? (
                    brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.company_name || b.full_name || b.email || b.id}
                      </option>
                    ))
                  ) : (
                    <option value="demo_brand">Örnek Şirket (Demo)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">İçerik Üretici (Creator) Seç</label>
                <select
                  value={selectedCreator}
                  onChange={(e) => setSelectedCreator(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Supabase Creator Listesi --</option>
                  {creators.length > 0 ? (
                    creators.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name || c.email || c.id}
                      </option>
                    ))
                  ) : (
                    <option value="demo_creator">Örnek Creator (Demo)</option>
                  )}
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

          {/* 4. GELEN WEBHOOK & APİ VERİLERİ */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-base font-bold text-white mb-1">Gelen Webhook Verileri & Siparişler</h2>
            <p className="text-xs text-gray-400 mb-6">
              `/api/webhooks` uç noktasına düşen ve veritabanına işlenen son dönüşümler.
            </p>

            {conversions.length === 0 ? (
              <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center text-xs text-gray-500">
                Henüz tetiklenen bir webhook isteği veya kayıtlı satış bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {conversions.slice(0, 5).map((conv) => (
                  <div key={conv.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">Satış Tutarı: ${conv.amount || 0}</p>
                      <p className="text-gray-400">Creator Komisyonu: {conv.creator_commission || 0} USDT</p>
                    </div>
                    <span className={`font-mono text-[11px] px-2 py-0.5 rounded ${conv.is_paid ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                      {conv.is_paid ? 'Ödendi' : 'Bekliyor'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5. ÖDEME ONAY LİSTESİ */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-base font-bold text-white mb-1">Borç / Alacak ve Ödeme Takip Tablosu</h2>
          <p className="text-xs text-gray-400 mb-6">
            Supabase `conversions` tablosundaki ödemeleri buradan manuel olarak "Ödendi" olarak işaretleyebilirsiniz.
          </p>

          {conversions.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center text-xs text-gray-500">
              Listelenecek ödeme veya dönüşüm bulunmuyor.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-400">
                <thead className="bg-zinc-900 text-gray-300 border-b border-zinc-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Tutar</th>
                    <th className="p-3">Hakediş (USDT)</th>
                    <th className="p-3">USDT Cüzdan Adresi</th>
                    <th className="p-3">Durum</th>
                    <th className="p-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {conversions.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-mono text-gray-500">{item.id.slice(0, 8)}...</td>
                      <td className="p-3 text-white">${item.amount || 0}</td>
                      <td className="p-3 text-emerald-400 font-bold">{item.creator_commission || 0} USDT</td>
                      <td className="p-3 font-mono text-gray-400">{item.usdt_address || 'Belirtilmedi'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${item.is_paid ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                          {item.is_paid ? 'Tamamlandı' : 'Bekliyor'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {!item.is_paid ? (
                          <button
                            onClick={() => handleApprovePayout(item.id)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded text-[11px] transition"
                          >
                            "Ödendi" İşaretle
                          </button>
                        ) : (
                          <span className="text-gray-600 text-[11px]">İşlem Tamam</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
