'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const cleanUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabase = createClient(cleanUrl, supabaseAnonKey);

export default function CreatorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin');
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xs text-zinc-500">Loading Creator Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Üst Başlık ve Çıkış Butonu */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Creator Dashboard</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Welcome back, <span className="text-emerald-400">{user?.user_metadata?.full_name || user?.email}</span>
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="self-start md:self-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs px-4 py-2 rounded-lg transition-colors text-zinc-300"
          >
            Sign Out
          </button>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs font-medium text-zinc-400">Total Earnings</p>
            <p className="text-2xl font-bold text-emerald-400 mt-2">$0.00</p>
            <p className="text-[10px] text-zinc-500 mt-1">Updated just now</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs font-medium text-zinc-400">Active Campaigns</p>
            <p className="text-2xl font-bold text-white mt-2">0</p>
            <p className="text-[10px] text-zinc-500 mt-1">Ongoing partnerships</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs font-medium text-zinc-400">Total Clicks</p>
            <p className="text-2xl font-bold text-white mt-2">0</p>
            <p className="text-[10px] text-zinc-500 mt-1">Link engagement</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <p className="text-xs font-medium text-zinc-400">Pending Approvals</p>
            <p className="text-2xl font-bold text-amber-400 mt-2">0</p>
            <p className="text-[10px] text-zinc-500 mt-1">Awaiting brand review</p>
          </div>
        </div>

        {/* İçerik Alanı: Kampanyalar ve Hızlı Aksiyonlar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sol/Orta Alan: Aktif Kampanyalar Listesi */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Available Brand Opportunities</h2>
            <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center">
              <p className="text-xs text-zinc-500">No active campaigns available at the moment.</p>
              <button className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-xs px-4 py-2 rounded-lg transition-colors">
                Explore Marketplace
              </button>
            </div>
          </div>

          {/* Sağ Alan: Kullanıcı Profil Özeti */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Profile Overview</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-zinc-900">
                <span className="text-zinc-500">Account Type</span>
                <span className="text-emerald-400 font-medium capitalize">{user?.user_metadata?.role || 'Creator'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-900">
                <span className="text-zinc-500">Email</span>
                <span className="text-zinc-300 truncate max-w-[180px]">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-900">
                <span className="text-zinc-500">Status</span>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
