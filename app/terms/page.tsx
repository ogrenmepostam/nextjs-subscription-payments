import Link from 'next/link';

export default function TermsOfService() {
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
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: August 2026</p>

        <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed border-t border-zinc-800 pt-8">
          {/* Bölüm 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the fladnag platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use our services.
            </p>
          </section>

          {/* Bölüm 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Role of the Platform</h2>
            <p>
              fladnag operates strictly as a performance marketing network and technical intermediary connecting digital product owners ("Brands") with independent content creators and affiliates ("Creators"). fladnag does not buy or sell end products directly.
            </p>
          </section>

          {/* Bölüm 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Payouts and USDT Commissions</h2>
            <p>
              Creators earn commissions strictly based on verified, non-refunded performance metrics determined by assigned campaigns. All payouts are executed in USDT (Tether) to the cryptocurrency wallet address specified in the Creator's account settings. Users are solely responsible for providing accurate wallet addresses.
            </p>
          </section>

          {/* Bölüm 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Prohibited Conduct</h2>
            <p>
              Users agree not to engage in fraudulent practices, including but not limited to self-referrals, bot traffic, misleading promotional materials, or automated link spamming. Accounts participating in suspicious activity will be suspended immediately without payout.
            </p>
          </section>

          {/* Bölüm 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Limitation of Liability</h2>
            <p>
              fladnag is not liable for third-party network outages, blockchain transfer delays, or incorrect wallet inputs provided by the user.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
