import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-black/80 backdrop-blur border-b border-zinc-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* Sol Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-white text-base">
        <span className="bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded text-xs">F</span>
        <span>fladnag</span>
      </Link>

      {/* Sağ Linkler ve Portal Girişi */}
      <div className="flex items-center gap-6 text-xs">
        <Link href="/brand-login" className="text-gray-300 hover:text-white transition-colors">
          Brand Login
        </Link>
        <Link href="/creator-login" className="text-gray-300 hover:text-white transition-colors">
          Creator Login
        </Link>
        <Link
          href="/admin"
          className="bg-zinc-900 hover:bg-zinc-800 text-gray-200 border border-zinc-800 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
        >
          <span>🔒</span> Internal Portal
        </Link>
      </div>

    </header>
  );
}
