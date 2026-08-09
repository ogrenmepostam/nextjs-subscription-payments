import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-zinc-950/80 backdrop-blur border-b border-zinc-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 font-bold text-white text-base">
        <span className="bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded text-xs">F</span>
        <span>fladnag</span>
      </Link>
      {/* Sağ üstteki tüm kalabalık butonlar kaldırıldı */}
    </header>
  );
}
