'use client';
import { useEffect, useState } from 'react';
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Oturum yoksa giriş ekranına yönlendir
        router.push('/signin');
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-zinc-500">Loading Creator Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Creator Dashboard</h1>
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
          <p className="text-emerald-400 font-medium">Welcome back!</p>
          <p className="text-sm text-zinc-400 mt-2">Email: {user?.email}</p>
          <p className="text-sm text-zinc-400">
            Role: {user?.user_metadata?.role || 'Creator'}
          </p>
        </div>
      </div>
    </div>
  );
}
