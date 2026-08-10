'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const cleanUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabase = createClient(cleanUrl, supabaseAnonKey);

export default function CreatorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/signin';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-emerald-500 font-medium text-sm">Loading Creator Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Üst Bar */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded text-xs">F</span>
            <span>fladnag</span>
          </Link>
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
            CREATOR PORTAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Üst Karşılama */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
          <div>
            <h1 className="text-xl font-bold">Welcome back, {user?.user_metadata?.full_name || 'Creator'} 👋</h1>
            <p className="text-xs text-zinc-400 mt-1">Manage your campaigns, track earnings, and review offers.</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">
            + Explore Opportunities
          </button>
        </div>

        {/* Metrikler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <span className="text-xs text-zinc-400 font-medium">Total Earnings</span>
            <div className="text-2xl font-bold mt-2 text-white">$0.00</div>
            <span className="text-[10px] text-zinc-500">Updated just now</span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <span className="text-xs text-zinc-400 font-medium">Active Campaigns</span>
            <div className="text-2xl font-bold mt-2 text-emerald-400">0</div>
            <span className="text-[10px] text-zinc-500">In progress</span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <span className="text-xs text-zinc-400 font-medium">Pending Offers</span>
            <div className="text-2xl font-bold mt-2 text-amber-400">0</div>
            <span className="text-[10px] text-zinc-500">Awaiting your review</span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
            <span className="text-xs text-zinc-400 font-medium">Media Kit Status</span>
            <div className="text-sm font-bold mt-2 text-emerald-500">Active</div>
            <span className="text-[10px] text-zinc-500">Visible to brands</span>
          </div>
        </div>

        {/* Kampanya / Fırsatlar Listesi */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold mb-4">Active & Incoming Opportunities</h2>
          
          <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-xs text-zinc-400">No active campaigns or pending requests yet.</p>
            <p className="text-[11px] text-zinc-600 mt-1">When brands match with your profile, opportunities will appear here.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
