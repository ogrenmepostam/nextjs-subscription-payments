import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* Orijinal Hero Alanı */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center">
        
        {/* Üst Rozet (Badge) */}
        <div className="mb-6">
          <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-xs px-3 py-1.5 rounded-full font-medium">
            Performance Marketing & Affiliate Network
          </span>
        </div>

        {/* Dev Başlık */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Scale Your Sales on Pure Performance
        </h1>

        {/* Alt Açıklama */}
        <p className="mt-6 text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed">
          Connecting growing digital brands with content creators. Pay only for verified sales, earn guaranteed USDT commissions on assigned campaigns.
        </p>

        {/* Butonlar */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link
            href="/brand-login"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg text-sm transition-colors text-center"
          >
            Join as Brand / Company
          </Link>
          <Link
            href="/creator-login"
            className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-medium px-6 py-3 rounded-lg text-sm transition-colors text-center"
          >
            Join as Creator
          </Link>
        </div>

        {/* 3'lü Özellik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-16 text-left">
          
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-6">
            <span className="text-emerald-500 font-mono text-lg font-bold">01</span>
            <h2 className="text-lg font-bold text-white mt-3 mb-2">For Brands & SaaS</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Set your bounty per sale. Integrate via Webhook and only pay commission when actual revenue is generated through fladnag.
            </p>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-6">
            <span className="text-emerald-500 font-mono text-lg font-bold">02</span>
            <h2 className="text-lg font-bold text-white mt-3 mb-2">For Creators & Affiliates</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Get assigned to converting campaigns on fladnag network. Share your custom tracking link and withdraw earnings directly in USDT.
            </p>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-6">
            <span className="text-emerald-500 font-mono text-lg font-bold">03</span>
            <h2 className="text-lg font-bold text-white mt-3 mb-2">Automated Tracking</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Real-time attribution system powered by fladnag ensures every sale is accurately tracked and transparently credited.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
