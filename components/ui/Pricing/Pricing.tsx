'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'brand_dash' | 'creator_dash'>('home');
  const [authModal, setAuthModal] = useState<'brand' | 'creator' | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Active User Sessions
  const [activeBrand, setActiveBrand] = useState<any>(null);
  const [activeCreator, setActiveCreator] = useState<any>(null);

  // Admin Auth
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminError, setAdminError] = useState(false);

  // Admin Data State
  const [companies, setCompanies] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Admin Form State
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCreator, setSelectedCreator] = useState('');
  const [refCode, setRefCode] = useState('');
  const [companyCommOverride, setCompanyCommOverride] = useState('');
  const [creatorCommOverride, setCreatorCommOverride] = useState('');

  // Brand Dashboard Form State
  const [brandWallet, setBrandWallet] = useState('');
  const [brandWebhook, setBrandWebhook] = useState('');
  const [brandComm, setBrandComm] = useState('');

  // Creator Dashboard Form State
  const [creatorWallet, setCreatorWallet] = useState('');

  useEffect(() => {
    const adminSession = sessionStorage.getItem('admin_authenticated');
    if (adminSession === 'true') setIsAdminAuth(true);

    const savedBrand = localStorage.getItem('brand_user');
    if (savedBrand) setActiveBrand(JSON.parse(savedBrand));

    const savedCreator = localStorage.getItem('creator_user');
    if (savedCreator) setActiveCreator(JSON.parse(savedCreator));
  }, []);

  const fetchAdminData = async () => {
    const { data: compData } = await supabase.from('companies').select('*');
    const { data: creatData } = await supabase.from('creators').select('*');
    const { data: matchData } = await supabase.from('matches').select('*, companies(*), creators(*)');
    const { data: txData } = await supabase.from('transactions').select('*, matches(*, companies(*), creators(*))');

    if (compData) setCompanies(compData);
    if (creatData) setCreators(creatData);
    if (matchData) setMatches(matchData);
    if (txData) setTransactions(txData);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Levent05/*+-.?!-#';
    if (adminPassword === correctPass) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAdminAuth(true);
      setAdminError(false);
      fetchAdminData();
    } else {
      setAdminError(true);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const table = authModal === 'brand' ? 'companies' : 'creators';

    if (isSignUp) {
      const { data, error } = await supabase
        .from(table)
        .insert([{ name, email, password }])
        .select()
        .single();

      if (error) {
        setAuthError(error.message.includes('unique') ? 'Email already registered.' : error.message);
      } else {
        loginUser(data, authModal!);
      }
    } else {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        setAuthError('Invalid email or password.');
      } else {
        loginUser(data, authModal!);
      }
    }
  };

  const loginUser = (userData: any, role: 'brand' | 'creator') => {
    if (role === 'brand') {
      setActiveBrand(userData);
      localStorage.setItem('brand_user', JSON.stringify(userData));
      setBrandWallet(userData.wallet_address || '');
      setBrandWebhook(userData.webhook_url || '');
      setBrandComm(userData.commission_per_sale || '');
      setCurrentView('brand_dash');
    } else {
      setActiveCreator(userData);
      localStorage.setItem('creator_user', JSON.stringify(userData));
      setCreatorWallet(userData.wallet_address || '');
      setCurrentView('creator_dash');
    }
    setAuthModal(null);
    setEmail(''); setPassword(''); setName('');
  };

  const logoutUser = (role: 'brand' | 'creator') => {
    if (role === 'brand') {
      setActiveBrand(null);
      localStorage.removeItem('brand_user');
    } else {
      setActiveCreator(null);
      localStorage.removeItem('creator_user');
    }
    setCurrentView('home');
  };

  // Brand Settings Update
  const handleUpdateBrandSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase
      .from('companies')
      .update({
        wallet_address: brandWallet,
        webhook_url: brandWebhook,
        commission_per_sale: Number(brandComm)
      })
      .eq('id', activeBrand.id)
      .select()
      .single();

    if (data) {
      setActiveBrand(data);
      localStorage.setItem('brand_user', JSON.stringify(data));
      alert('Brand settings updated successfully!');
    }
  };

  // Creator Settings Update
  const handleUpdateCreatorSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase
      .from('creators')
      .update({ wallet_address: creatorWallet })
      .eq('id', activeCreator.id)
      .select()
      .single();

    if (data) {
      setActiveCreator(data);
      localStorage.setItem('creator_user', JSON.stringify(data));
      alert('Wallet address saved successfully!');
    }
  };

  // Admin Single-Click Match Creation
  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !selectedCreator || !refCode) return;

    if (companyCommOverride) {
      await supabase.from('companies').update({ commission_per_sale: Number(companyCommOverride) }).eq('id', selectedCompany);
    }
    if (creatorCommOverride) {
      await supabase.from('creators').update({ commission_per_sale: Number(creatorCommOverride) }).eq('id', selectedCreator);
    }

    await supabase.from('matches').insert([
      { company_id: selectedCompany, creator_id: selectedCreator, ref_code: refCode.trim() }
    ]);

    setRefCode(''); setCompanyCommOverride(''); setCreatorCommOverride('');
    fetchAdminData();
  };

  const handleStatusChange = async (txId: string, newStatus: string) => {
    await supabase.from('transactions').update({ status: newStatus }).eq('id', txId);
    fetchAdminData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased">
      {/* NAVIGATION BAR */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black">A</div>
          <span className="font-bold text-xl tracking-wide">AffiliateHub</span>
        </div>

        <div className="flex items-center space-x-4">
          {activeBrand ? (
            <button onClick={() => setCurrentView('brand_dash')} className="text-sm font-semibold text-emerald-400 hover:underline">
              Brand Portal ({activeBrand.name})
            </button>
          ) : activeCreator ? (
            <button onClick={() => setCurrentView('creator_dash')} className="text-sm font-semibold text-blue-400 hover:underline">
              Creator Portal ({activeCreator.name})
            </button>
          ) : (
            <>
              <button onClick={() => { setAuthModal('brand'); setIsSignUp(false); }} className="text-sm font-medium hover:text-emerald-400 transition">
                Brand Login
              </button>
              <button onClick={() => { setAuthModal('creator'); setIsSignUp(false); }} className="text-sm font-medium hover:text-blue-400 transition">
                Creator Login
              </button>
            </>
          )}

          <button 
            onClick={() => { setCurrentView('admin'); if(isAdminAuth) fetchAdminData(); }} 
            className="bg-zinc-800 hover:bg-zinc-700 text-xs px-3 py-2 rounded-lg text-zinc-300 font-mono"
          >
            🔒 Admin Portal
          </button>
        </div>
      </nav>

      {/* 1. LANDING PAGE (ENGLISH) */}
      {currentView === 'home' && (
        <main className="max-w-6xl mx-auto px-6 py-20 space-y-24">
          <section className="text-center space-y-6">
            <span className="bg-emerald-950 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-800">
              Automated Performance Marketing Network
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              Scale Your Web3 & Tech SaaS with Verified Creators
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Automated USDT commission tracking, custom referral codes, and instant Webhook integrations for brands and content creators.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => { setAuthModal('brand'); setIsSignUp(true); }}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-xl transition text-sm"
              >
                Join as Brand / Company
              </button>
              <button
                onClick={() => { setAuthModal('creator'); setIsSignUp(true); }}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold px-8 py-4 rounded-xl transition text-sm"
              >
                Join as Creator
              </button>
            </div>
          </section>

          {/* FEATURES GRID */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="text-emerald-400 text-2xl font-bold">01</div>
              <h3 className="font-bold text-lg">Instant Webhook API</h3>
              <p className="text-zinc-400 text-sm">Plug your Checkout or SaaS backend directly into our automated Webhook endpoint for zero-delay commission logging.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="text-emerald-400 text-2xl font-bold">02</div>
              <h3 className="font-bold text-lg">USDT Crypto Settlements</h3>
              <p className="text-zinc-400 text-sm">Direct wallet-to-wallet USDT accounting. Transparent payout tracking with clear due dates.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="text-emerald-400 text-2xl font-bold">03</div>
              <h3 className="font-bold text-lg">Custom Referral Links</h3>
              <p className="text-zinc-400 text-sm">Creators get unique branded ref links to attach to videos, articles, or social campaigns.</p>
            </div>
          </section>
        </main>
      )}

      {/* 2. BRAND DASHBOARD (ENGLISH) */}
      {currentView === 'brand_dash' && activeBrand && (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-emerald-400">{activeBrand.name} — Brand Portal</h1>
              <p className="text-zinc-400 text-sm">Manage your USDT settlement wallet and Webhook API integrations.</p>
            </div>
            <button onClick={() => logoutUser('brand')} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-lg text-xs">
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* BRAND SETTINGS */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h2 className="text-xl font-bold text-zinc-200">Account & API Settings</h2>
              <form onSubmit={handleUpdateBrandSettings} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">USDT Wallet Address (For Commission Payouts)</label>
                  <input type="text" value={brandWallet} onChange={e=>setBrandWallet(e.target.value)} placeholder="0x... or T..." className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white font-mono" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">Webhook URL (Your System Endpoint)</label>
                  <input type="url" value={brandWebhook} onChange={e=>setBrandWebhook(e.target.value)} placeholder="https://yourdomain.com/api/webhook" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white font-mono" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">Commission Offered Per Sale (USDT)</label>
                  <input type="number" value={brandComm} onChange={e=>setBrandComm(e.target.value)} placeholder="e.g. 100" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg font-bold text-sm">
                  Save Brand Settings
                </button>
              </form>
            </div>

            {/* API KEY & INSTRUCTIONS */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h2 className="text-xl font-bold text-zinc-200">Your Webhook API Key</h2>
              <p className="text-zinc-400 text-xs">Use this API Key to authenticate sales callbacks sent from your checkout system.</p>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 break-all">
                {activeBrand.api_key || 'Generate Key by saving settings'}
              </div>
              <div className="text-xs text-zinc-500 space-y-1">
                <p>• Send POST request when a user converts via ref code.</p>
                <p>• Payload structure: <code className="text-zinc-300">{`{ ref_code: "code", amount: 100 }`}</code></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CREATOR DASHBOARD (ENGLISH) */}
      {currentView === 'creator_dash' && activeCreator && (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-400">{activeCreator.name} — Creator Portal</h1>
              <p className="text-zinc-400 text-sm">Track your custom referral link, active rate, and USDT payouts.</p>
            </div>
            <button onClick={() => logoutUser('creator')} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-lg text-xs">
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* WALLET SETTINGS */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h2 className="text-xl font-bold text-zinc-200">Payout Wallet Address</h2>
              <form onSubmit={handleUpdateCreatorSettings} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">Your USDT Receiver Wallet Address</label>
                  <input type="text" value={creatorWallet} onChange={e=>setCreatorWallet(e.target.value)} placeholder="0x... or T..." className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white font-mono" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold text-sm">
                  Save Wallet Address
                </button>
              </form>
            </div>

            {/* COMMISSION OVERVIEW */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h2 className="text-xl font-bold text-zinc-200">Your Rate & Payout Terms</h2>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <p className="text-xs text-zinc-400">Commission Per Conversion:</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {activeCreator.commission_per_sale ? `${activeCreator.commission_per_sale} USDT` : 'Pending Match Assignment'}
                </p>
              </div>
              <p className="text-xs text-zinc-500">Payouts are settled directly to your wallet upon confirmation by the agency administrator.</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TÜRKÇE ADMIN PANELİ (SENİN YÖNETİM MERKEZİN) */}
      {currentView === 'admin' && (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
          {!isAdminAuth ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <form onSubmit={handleAdminLogin} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-emerald-400 text-center">Yönetici Girişi</h1>
                <input
                  type="password"
                  placeholder="Yönetici Şifresi"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white text-sm"
                  required
                />
                {adminError && <p className="text-red-500 text-xs text-center">Hatalı şifre!</p>}
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg text-sm font-bold">Giriş Yap</button>
              </form>
            </div>
          ) : (
            <div className="space-y-10">
              <header className="border-b border-zinc-800 pb-4 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-emerald-400">Ana Yönetim Paneli (Admin)</h1>
                  <p className="text-zinc-400 text-sm mt-1">Şirket/Üretici Eşleştirme, Marj Tanımlama ve Net Ajans Kâr Takibi</p>
                </div>
                <button onClick={() => setCurrentView('home')} className="bg-zinc-800 hover:bg-zinc-700 text-xs px-4 py-2 rounded-lg">Ana Sayfaya Dön</button>
              </header>

              {/* TEK TIKLA EŞLEŞTİRME FORMU */}
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
                <h2 className="text-lg font-bold text-emerald-400">Tek Tıkla Şirket & İçerik Üreticisi Eşleştir</h2>
                <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <select value={selectedCompany} onChange={e=>setSelectedCompany(e.target.value)} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white" required>
                    <option value="">Şirket Seç</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email || 'Kaydolmuş'})</option>)}
                  </select>

                  <select value={selectedCreator} onChange={e=>setSelectedCreator(e.target.value)} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white" required>
                    <option value="">Üretici Seç</option>
                    {creators.map(cr => <option key={cr.id} value={cr.id}>{cr.name} ({cr.email || 'Kaydolmuş'})</option>)}
                  </select>

                  <input type="text" placeholder="Ref Kodu (ör: ahmet10)" value={refCode} onChange={e=>setRefCode(e.target.value)} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white" required />
                  <input type="number" placeholder="Şirketten Alınacak USDT" value={companyCommOverride} onChange={e=>setCompanyCommOverride(e.target.value)} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white" />
                  <input type="number" placeholder="Üreticiye Verilecek USDT" value={creatorCommOverride} onChange={e=>setCreatorCommOverride(e.target.value)} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white" />

                  <button type="submit" className="md:col-span-5 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg font-bold text-sm">
                    Eşleştirmeyi Onayla ve Yayınla
                  </button>
                </form>
              </div>

              {/* AKTİF EŞLEŞMELER */}
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h2 className="text-xl font-bold mb-4 text-emerald-400">Aktif Eşleşmeler ve Marjlar</h2>
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs">
                    <tr>
                      <th className="p-3">Ref Kodu</th>
                      <th className="p-3">Şirket</th>
                      <th className="p-3">Üretici</th>
                      <th className="p-3">Şirketten Gelen</th>
                      <th className="p-3">Üreticiye Giden</th>
                      <th className="p-3 text-emerald-400">Net Ajans Kârı</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {matches.map(m => {
                      const compComm = m.companies?.commission_per_sale || 0;
                      const creatComm = m.creators?.commission_per_sale || 0;
                      return (
                        <tr key={m.id}>
                          <td className="p-3 font-mono text-blue-400 font-bold">?ref={m.ref_code}</td>
                          <td className="p-3">{m.companies?.name}</td>
                          <td className="p-3">{m.creators?.name}</td>
                          <td className="p-3">{compComm} USDT</td>
                          <td className="p-3">{creatComm} USDT</td>
                          <td className="p-3 text-emerald-400 font-bold">+{compComm - creatComm} USDT</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AUTH MODAL (BRAND & CREATOR LOGIN/SIGNUP) */}
      {authModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md space-y-6 relative">
            <button onClick={() => setAuthModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-zinc-400 capitalize">
                {authModal === 'brand' ? 'Brand / Company Portal' : 'Content Creator Portal'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Company / Name</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white" />
                </div>
              )}
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-white" />
              </div>

              {authError && <p className="text-red-500 text-xs text-center">{authError}</p>}

              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-lg text-sm transition">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-xs text-zinc-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-emerald-400 underline font-semibold">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
