import Link from 'next/link';

export default function SignIn() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        
        {/* Logo / Başlık */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-2">
            <span className="bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded text-xs">F</span>
            <span>fladnag</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Sign In</h1>
        </div>

        {/* Form Alanı */}
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Hukuki Onay Kutucuğu */}
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

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
}
