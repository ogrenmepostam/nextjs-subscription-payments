'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Supabase İstemcisi
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    usdtToDistribute: 0,
    activeBrands: 0,
    totalCreators: 0,
  });
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    setLoading(true);
    try {
      // 1. Marka ve İçerik Üreticisi Sayılarını Çek (profiles veya users tablosu)
      const { count: brandCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'brand');

      const { count: creatorCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'creator');

      // 2. Aktif Kampanyaları Çek
      const { data: campaignData } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      // 3. Bekleyen Ödemeleri ve Satışları Çek (conversions tablosu)
      const { data: conversionData } = await supabase
        .from('conversions')
        .select('*');

      if (conversionData) {
        // Onaylanan toplam satış cirosu
        const totalSalesVal = conversionData
          .filter((c) => c.status === 'approved' || c.status === 'completed')
          .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

        // Dağıtılacak USDT (İade süresi dolmuş ama henüz ödenmemiş %10'luk kısımlar)
        const pendingUsdtVal = conversionData
          .filter((c) => c.status === 'approved' && !c.is_paid)
          .reduce((sum, c) => sum + (Number(c.creator_commission) || 0), 0);

        setStats({
          totalSales: totalSalesVal,
          usdtToDistribute: pendingUsdtVal,
          activeBrands: brandCount || 0,
          totalCreators: creatorCount || 0,
        });

        // Bekleyen çekimler listesi
        setPendingPayouts(conversionData.filter((c) => !c.is_paid));
      }

      if (campaignData) setCampaigns(campaignData);
    } catch (error) {
      console.error('Admin verisi çekilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  }

  // Ödeme Onaylama Fonksiyonu (USDT Gönderildi İşareti)
  async function handleApprovePayout(conversionId: string) {
    const { error } = await supabase
      .from('conversions')
      .update({ is_paid: true, status: 'completed' })
      .eq('id', conversionId);

    if (!error) {
      fetchAdminData(); // Verileri tazele
    } else {
      alert('Ödeme güncellenirken hata oluştu.');
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Üst Bar */}
      <header className="max-w-7xl mx-auto flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500 text-black font-extrabold px-2.5 py-1 rounded text-xs">F</span>
          <h1 className="text-xl font-bold text-white tracking-wide">fladnag Yönetim Paneli</h1>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button 
            onClick={fetchAdminData}
            className="text-emerald-400 font-medium hover:underline cursor-pointer"
          >
            ● Yenile {loading && '(Yükleniyor...)'}
          </button>
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
            <p className="text-2xl font-bold text-white">${stats.totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Dağıtılacak USDT Komisyonu</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.usdtToDistribute.toFixed(2)} USDT</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Aktif Marka / Kampanya</p>
            <p className="text-2xl font-bold text-white">{stats.activeBrands}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Kayıtlı İçerik Üreticisi</p>
            <p className="text-2xl font-bold text-white">{stats.totalCreators}</p>
          </div>
        </div>

        {/* Hızlı İşlem & Takip Alanı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon: Son Kampanyalar */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-base font-bold text-white mb-4">Aktif Kampanyalar ve Bütçeler</h2>
            {campaigns.length === 0 ? (
              <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center text-xs text-gray-500">
                Henüz eklenmiş bir marka veya kampanya bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{camp.title || camp.name}</p>
                      <p className="text-gray-400">Komisyon: %{camp.commission_rate || 20}</p>
                    </div>
                    <span className="text-emerald-400 font-mono">Aktif</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Kolon: Onay Bekleyen USDT Ödemeleri */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-base font-bold text-white mb-4">Bekleyen USDT Çekimleri</h2>
            {pendingPayouts.length === 0 ? (
              <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center text-xs text-gray-500">
                Onay bekleyen çekim talebi yok.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPayouts.map((item) => (
                  <div key={item.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tutar:</span>
                      <span className="text-emerald-400 font-bold">{item.creator_commission || 0} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cüzdan:</span>
                      <span className="font-mono text-[10px] text-gray-300 truncate max-w-[120px]">{item.usdt_address || 'Tanımsız'}</span>
                    </div>
                    <button
                      onClick={() => handleApprovePayout(item.id)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-1 rounded transition-colors"
                    >
                      Ödendi İşaretle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
