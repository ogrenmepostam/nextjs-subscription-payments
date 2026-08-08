        'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Props {
  user?: any;
  products?: any[];
  subscription?: any;
}

export default function Pricing({ user, products, subscription }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [companies, setCompanies] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [companyWallet, setCompanyWallet] = useState('');
  const [companyComm, setCompanyComm] = useState('');

  const [creatorName, setCreatorName] = useState('');
  const [creatorWallet, setCreatorWallet] = useState('');
  const [creatorComm, setCreatorComm] = useState('');

  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCreator, setSelectedCreator] = useState('');
  const [refCode, setRefCode] = useState('');

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Levent05/*+-.?!-#'; 

    if (inputPassword === adminPass) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setLoginError(false);
      fetchData();
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const { data: compData } = await supabase.from('companies').select('*');
    const { data: creatData } = await supabase.from('creators').select('*');
    const { data: matchData } = await supabase.from('matches').select('*, companies(*), creators(*)');
    const { data: txData } = await supabase.from('transactions').select('*, matches(*, companies(*), creators(*))');

    if (compData) setCompanies(compData);
    if (creatData) setCreators(creatData);
    if (matchData) setMatches(matchData);
    if (txData) setTransactions(txData);
    setLoading(false);
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('companies').insert([
      { name: companyName, wallet_address: companyWallet, commission_per_sale: Number(companyComm) }
    ]);
    setCompanyName(''); setCompanyWallet(''); setCompanyComm('');
    fetchData();
  };

  const handleAddCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('creators').insert([
      { name: creatorName, wallet_address: creatorWallet, commission_per_sale: Number(creatorComm) }
    ]);
    setCreatorName(''); setCreatorWallet(''); setCreatorComm('');
    fetchData();
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !selectedCreator || !refCode) return;
    await supabase.from('matches').insert([
      { company_id: selectedCompany, creator_id: selectedCreator, ref_code: refCode.trim() }
    ]);
    setRefCode('');
    fetchData();
  };

  const handleStatusChange = async (txId: string, newStatus: string) => {
    await supabase.from('transactions').update({ status: newStatus }).eq('id', txId);
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-emerald-400">Yönetici Girişi</h1>
            <p className="text-zinc-400 text-sm">Ajans Komisyon Paneline Erişmek İçin Şifre Giriniz</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Yönetici Şifresi"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-xs text-center">Hatalı şifre girdiniz!</p>}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-sm transition"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalEarnedProfit = transactions
    .filter(t => t.status === 'creator_paid')
    .reduce((acc, t) => acc + ((t.company_amount || 0) - (t.creator_amount || 0)), 0);

  const pendingProfit = transactions
    .filter(t => t.status === 'pending')
    .reduce((acc, t) => acc + ((t.company_amount || 0) - (t.creator_amount || 0)), 0);

  const refundedProfit = transactions
    .filter(t => t.status === 'refunded')
    .reduce((acc, t) => acc + ((t.company_amount || 0) - (t.creator_amount || 0)), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 max-w-7xl mx-auto space-y-10">
      <header className="border-b border-zinc-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400">Ana Yönetim Paneli (Admin)</h1>
          <p className="text-zinc-400 text-sm mt-1">Şirket, İçerik Üreticisi, USDT Hakediş ve Net Ajans Kâr Takibi</p>
        </div>
        <button onClick={handleLogout} className="bg-zinc-800 hover:bg-zinc-700 text-xs px-4 py-2 rounded-lg text-zinc-300">
          Çıkış Yap
        </button>
      </header>

      {/* METRİKLER VE BAKIYELER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase font-bold">Tahsil Edilen Net Kâr</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">+{totalEarnedProfit} USDT</p>
        </div>
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase font-bold">Bekleyen Net Kâr (Havuzda)</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">+{pendingProfit} USDT</p>
        </div>
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase font-bold">İade Edilen / Düşen Kâr</p>
          <p className="text-3xl font-bold text-red-400 mt-2">-{refundedProfit} USDT</p>
        </div>
      </div>

      {/* VERİ GİRİŞ FORMLARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Şirket Ekle */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold mb-3 text-zinc-200">1. Şirket Ekle</h2>
          <form onSubmit={handleAddCompany} className="space-y-3">
            <input type="text" placeholder="Şirket / Marka Adı" value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-sm text-white" required />
            <input type="text" placeholder="Cüzdan Adresi (USDT)" value={companyWallet} onChange={e=>setCompanyWallet(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-sm text-white" />
            <input type="number" placeholder="Sana Ödeyeceği USDT (Satış Başı)" value={companyComm} onChange={e=>setCompanyComm(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-sm text-white" required />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded font-semibold text-sm">Şirketi Kaydet</button>
          </form>
        </div>

        {/* Üretici Ekle */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold mb-3 text-zinc-200">2. İçerik Üreticisi Ekle</h2>
          <form onSubmit={handleAddCreator} className="space-y-3">
            <input type="text" placeholder="Üretici Adı / Kanal" value={creatorName} onChange={e=>setCreatorName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-sm text-white" required />
            <input type="text" placeholder="Üretici USDT Cüzdanı" value={creatorWallet} onChange={e=>setCreatorWallet(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-sm text-white" required />
            <input type="number" placeholder="Üreticiye Ödeyeceğin USDT" value={creatorComm} onChange={e=>setCreatorComm(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-sm text-white" required />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded font-semibold text-sm">Üreticiyi Kaydet</button>
          </form>
        </div>

        {/* Eşleştirme Yap */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold mb-3 text-zinc-200">3. Şirket + Üretici Eşleştir</h2>
          <form onSubmit={handleCreateMatch} className="space-y-3">
            <select value={selectedCompany} onChange={e=>setSelectedCompany(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-sm text-white" required>
              <option value="">Şirket Seç</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.commission_per_sale} USDT)</option>)}
            </select>
            <select value={selectedCreator} onChange={e=>setSelectedCreator(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-sm text-white" required>
              <option value="">Üretici Seç</option>
              {creators.map(cr => <option key={cr.id} value={cr.id}>{cr.name} ({cr.commission_per_sale} USDT)</option>)}
            </select>
            <input type="text" placeholder="Özel Kod (Örn: ahmet10)" value={refCode} onChange={e=>setRefCode(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-sm text-white" required />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold text-sm">Eşleştirmeyi Oluştur</button>
          </form>
        </div>
      </div>

      {/* EŞLEŞTİRME & NET KÂR LİSTESİ */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Aktif Şirket - Üretici Eşleşmeleri & Net Marjlar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="p-3">Referans Kodu</th>
                <th className="p-3">Şirket</th>
                <th className="p-3">İçerik Üreticisi</th>
                <th className="p-3">Şirketten Gelen</th>
                <th className="p-3">Üreticiye Giden</th>
                <th className="p-3 text-emerald-400">Senin Net Kârın</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {matches.map(m => {
                const compComm = m.companies?.commission_per_sale || 0;
                const creatComm = m.creators?.commission_per_sale || 0;
                const netProfit = compComm - creatComm;
                return (
                  <tr key={m.id} className="hover:bg-zinc-950/50">
                    <td className="p-3 font-mono font-bold text-blue-400">?ref={m.ref_code}</td>
                    <td className="p-3">{m.companies?.name}</td>
                    <td className="p-3">{m.creators?.name}</td>
                    <td className="p-3 text-zinc-300">{compComm} USDT</td>
                    <td className="p-3 text-zinc-300">{creatComm} USDT</td>
                    <td className="p-3 font-bold text-emerald-400">+{netProfit} USDT / Satış</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* İŞLEM, İADE VE ÖDEME BİTİŞ TARİHİ TAKİBİ */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">İşlemler, İadeler ve Tahsilat Tarihleri</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="p-3">TxHash</th>
                <th className="p-3">Eşleşme</th>
                <th className="p-3">Net Kâr</th>
                <th className="p-3">Durum</th>
                <th className="p-3">Ödeme / Tahsilat Tarihi</th>
                <th className="p-3">İşlem Yap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {transactions.map(t => {
                const netProfit = (t.company_amount || 0) - (t.creator_amount || 0);
                const payoutDateStr = t.payout_date 
                  ? new Date(t.payout_date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'Bekliyor';

                return (
                  <tr key={t.id}>
                    <td className="p-3 font-mono text-xs">{t.tx_hash || 'Bekliyor'}</td>
                    <td className="p-3">{t.matches?.companies?.name} - {t.matches?.creators?.name}</td>
                    <td className={`p-3 font-bold ${t.status === 'refunded' ? 'text-red-400 line-through' : 'text-emerald-400'}`}>
                      +{netProfit} USDT
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        t.status === 'refunded' ? 'bg-red-950 text-red-400' :
                        t.status === 'creator_paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-yellow-950 text-yellow-400'
                      }`}>
                        {t.status === 'refunded' ? 'İade Edildi' : t.status === 'creator_paid' ? 'Tamamlandı' : 'Beklemede'}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-zinc-400 font-mono">
                      {t.status === 'refunded' ? 'İptal Edildi' : payoutDateStr}
                    </td>
                    <td className="p-3 space-x-2">
                      <button onClick={()=>handleStatusChange(t.id, 'creator_paid')} className="bg-emerald-700 hover:bg-emerald-600 text-xs px-2 py-1 rounded">Ödendi</button>
                      <button onClick={()=>handleStatusChange(t.id, 'refunded')} className="bg-red-700 hover:bg-red-600 text-xs px-2 py-1 rounded">İade / İptal</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
