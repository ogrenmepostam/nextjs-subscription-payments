import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-400 border-t border-zinc-900 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        
        {/* Sol Logo Alanı (ACME yerine fladnag) */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 text-black font-extrabold w-6 h-6 rounded flex items-center justify-center text-xs">
            F
          </div>
          <span className="text-white font-bold text-sm tracking-wide">fladnag</span>
        </div>

        {/* Menü Kolonları */}
        <div className="flex gap-16 text-xs">
          <div className="flex flex-col gap-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <span className="text-white font-semibold mb-1">LEGAL</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>

      </div>

      {/* Alt Telif Satırı */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-zinc-900/60 flex justify-between items-center text-xs text-gray-500">
        <p>© 2026 fladnag. All rights reserved.</p>
        <p>Crafted by Vercel</p>
      </div>
    </footer>
  );
}
