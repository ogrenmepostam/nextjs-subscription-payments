'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const cleanUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

const supabase = createClient(cleanUrl, supabaseAnonKey);

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) throw error;

        setMessage({
          text: 'Registration successful! You can now sign in.',
          type: 'success',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage({
          text: 'Login successful! Redirecting to creator panel...',
          type: 'success',
        });

        // Giriş yapıldıktan sonra Creator paneline yönlendirir ve oturumu yeniler
        setTimeout(() => {
          window.location.href = '/creator';
        }, 800);
      }
    } catch (err: any) {
      // Hata detaylarını dışarıya kapatıp genel ve güvenli mesaj gösteriyoruz
      setMessage({
        text: isSignUp 
          ? 'An error occurred during registration. Please check your information.' 
          : 'Invalid login credentials. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-2">
            <span className="bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded text-xs">F</span>
            <span>fladnag</span>
          </Link>
        </div>

        {/* Sekmeler */}
        <div className="flex bg-zinc-900 p-1 rounded-xl mb-6 border border-zinc-800">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setMessage(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isSignUp ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setMessage(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isSignUp ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Mesaj Kutusu */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-xs font-medium border ${
            message.type === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleAuth}>
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Onay Kutusu (Sadece Kayıt Olunurken Görünür) */}
          {isSignUp && (
            <div className="flex items-start gap-2 my-4 text-xs text-gray-400">
              <input 
                type="checkbox" 
                id="terms-check" 
                required 
                className="mt-0.5 w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="terms-check" className="cursor-pointer select-none leading-tight">
                I agree to the <a href="/terms" target="_blank" className="underline text-white hover:text-emerald-400">Terms of Service</a> and <a href="/privacy" target="_blank" className="underline text-white hover:text-emerald-400">Privacy Policy</a> of <strong>fladnag</strong>.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          {/* Giriş Yap Sekmesindeki Pasif Bilgilendirme Metni */}
          {!isSignUp && (
            <p className="mt-4 text-center text-[11px] text-gray-500">
              By signing in, you agree to our{' '}
              <a href="/terms" target="_blank" className="underline text-gray-400 hover:text-white">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" className="underline text-gray-400 hover:text-white">
                Privacy Policy
              </a>.
            </p>
          )}
        </form>

      </div>
    </div>
  );
}
