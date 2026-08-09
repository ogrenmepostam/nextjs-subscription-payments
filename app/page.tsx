import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      
      {/* Üst Menü (Navbar) - Temizlendi */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded text-xs">F</span>
            <span>fladnag</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/signin" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 px-4 py-2 rounded-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Ana Bölüm (Hero) */}
      <main className="max-w-5xl mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-6">
          Performance Marketing & Affiliate Network
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight mb-6">
          Scale Your Sales on Pure Performance
        </h1>
        
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
          Connecting growing digital brands with content creators. Pay only for verified sales.
        </p>

        {/* Ortadaki Giriş / Üye Olma Butonları */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-sm">
          <Link 
            href="/signin" 
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg text-sm transition-all shadow-lg shadow-emerald-500/10 text-center"
          >
            Join as Brand / Company
          </Link>
          <Link 
            href="/signin" 
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-6 py-3 rounded-lg text-sm border border-zinc-800 transition-all text-center"
          >
            Join as Creator
          </Link>
        </div>

        {/* Bilgi Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <div className="text-emerald-500 text-xs font-bold tracking-wider mb-2">01</div>
            <h3 className="text-lg font-bold text-white mb-2">For Brands & SaaS</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Set your bounty per sale. Integrate via Webhook and only pay commission when actual revenue is generated through fladnag.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <div className="text-emerald-500 text-xs font-bold tracking-wider mb-2">02</div>
            <h3 className="text-lg font-bold text-white mb-2">For Creators & Affiliates</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get assigned to converting campaigns on fladnag network. Share your custom tracking link and withdraw earnings directly in USDT.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <div className="text-emerald-500 text-xs font-bold tracking-wider mb-2">03</div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Tracking</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Real-time attribution system powered by fladnag ensures every sale is accurately tracked and transparently credited.
            </p>
          </div>
        </div>
      </main>

      {/* Alt Menü (Footer) */}
      <footer className="border-t border-zinc-900 bg-black py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 fladnag. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
