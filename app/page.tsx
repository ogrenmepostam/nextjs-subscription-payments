export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      
      {/* Kartlar Bölümü */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        
        {/* Kart 1: Brands */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <span className="text-green-400 font-mono text-xl font-bold">01</span>
          <h3 className="text-xl font-bold">For Brands & SaaS</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Set your bounty per sale. Integrate via Webhook and only pay commission when actual revenue is generated through <strong>fladnag</strong>.
          </p>
        </div>

        {/* Kart 2: Creators */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <span className="text-green-400 font-mono text-xl font-bold">02</span>
          <h3 className="text-xl font-bold">For Creators & Affiliates</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Get assigned to converting campaigns on <strong>fladnag</strong> network. Share your custom tracking link and withdraw earnings directly in USDT.
          </p>
        </div>

        {/* Kart 3: Tracking */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <span className="text-green-400 font-mono text-xl font-bold">03</span>
          <h3 className="text-xl font-bold">Automated Tracking</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Real-time attribution system powered by <strong>fladnag</strong> ensures every sale is accurately tracked and transparently credited.
          </p>
        </div>

      </div>
    </main>
  );
}
