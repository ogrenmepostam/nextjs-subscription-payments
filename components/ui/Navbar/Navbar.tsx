import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-black text-white px-6 py-4 flex justify-between items-center border-b border-gray-800">
      {/* Sol Üst Logo ve Marka İsmi */}
      <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wide">
        <span className="bg-green-500 text-black px-2 py-0.5 rounded font-extrabold text-sm">F</span>
        <span>fladnag</span>
      </Link>

      {/* Sağ Üst Butonlar */}
      <div className="flex items-center gap-4 text-sm">
        <Link href="/brand-login" className="text-gray-300 hover:text-white transition-colors">
          Brand Login
        </Link>
        <Link href="/creator-login" className="text-gray-300 hover:text-white transition-colors">
          Creator Login
        </Link>
        <Link 
          href="/admin" 
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs transition-colors border border-gray-700"
        >
          <span>🔒</span> Internal Portal
        </Link>
      </div>
    </header>
  );
}
