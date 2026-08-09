import Link from 'next/link';

export default function CreatorLogin() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        
        {/* Logo / Başlık */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
            <span className="bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded text-xs">F</span>
            <span>fladnag</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Creator Portal</h1>
          
          {/* ANA SAYFADAN ALDIĞIMIZ CÜMLE BURAYA YERLEŞTİRİLDİ */}
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-400 text-xs leading-relaxed">
            Earn guaranteed USDT commissions on assigned campaigns.
          </div>
        </div>

        {/* Form Alanı */}
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="creator@example.com"
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">USDT Wallet Address (TRC20)</label>
            <input
              type="text"
              placeholder="T..."
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2"
          >
            Access Creator Dashboard
          </button>
        </form>

      </div>
    </div>
  );
}
