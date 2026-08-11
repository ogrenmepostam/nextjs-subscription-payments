import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-8">
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 text-black font-bold rounded p-1 text-sm">F</div>
          <span className="font-bold text-xl tracking-wide">fladnag</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center my-auto max-w-4xl mx-auto px-4">
        <span className="text-xs uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full mb-6 border border-emerald-800/50">
          Performance Marketing & Affiliate Network
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Scale Your Sales on Pure Performance
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Connecting growing digital brands with content creators. Pay only for verified sales.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/signin?role=company"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-md transition duration-200 text-center"
          >
            Join as Brand / Company
          </Link>
          <Link
            href="/signin?role=creator"
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-md border border-zinc-700 transition duration-200 text-center"
          >
            Join as Creator
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-xl">
            <span className="text-emerald-500 font-mono text-sm mb-2 block">01</span>
            <h3 className="font-bold text-lg mb-2">For Brands & SaaS</h3>
            <p className="text-gray-400 text-sm">
              Set your bounty per sale. Integrate via Webhook and only pay commission when actual revenue is generated through fladnag.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-xl">
            <span className="text-emerald-500 font-mono text-sm mb-2 block">02</span>
            <h3 className="font-bold text-lg mb-2">For Creators & Affiliates</h3>
            <p className="text-gray-400 text-sm">
              Get assigned to converting campaigns on fladnag network. Share your custom tracking link and withdraw earnings directly in USDT.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-xl">
            <span className="text-emerald-500 font-mono text-sm mb-2 block">03</span>
            <h3 className="font-bold text-lg mb-2">Automated Tracking</h3>
            <p className="text-gray-400 text-sm">
              Real-time attribution system powered by fladnag ensures every sale is accurately tracked and transparently credited.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 pt-8 mt-12 text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 fladnag. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
