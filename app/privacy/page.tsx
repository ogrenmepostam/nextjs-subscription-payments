import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between px-4 py-12">
      <main className="max-w-4xl mx-auto w-full">
        {/* Üst Gezinti */}
        <div className="mb-8">
          <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>

        {/* Sayfa Başlığı */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: August 2026</p>

        <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed border-t border-zinc-800 pt-8">
          {/* Bölüm 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              To run the fladnag performance network, we collect minimal operational data, including account email addresses, basic profile details, and USDT payout wallet addresses provided by Creators.
            </p>
          </section>

          {/* Bölüm 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. How We Use Information</h2>
            <p>
              Collected information is exclusively used for core network operations: attributing conversions, routing campaign assignments, executing USDT commission payouts, and preventing fraud. We do not sell or rent user data to third-party advertisers.
            </p>
          </section>

          {/* Bölüm 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Tracking & Analytics</h2>
            <p>
              fladnag uses essential session tokens and conversion tracking cookies to ensure accurate commission attribution between Brands and Creators. These functional mechanisms are strictly required for network performance tracking.
            </p>
          </section>

          {/* Bölüm 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Data Security</h2>
            <p>
              Account details and wallet addresses are stored securely using industry-standard encryption protocols.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
