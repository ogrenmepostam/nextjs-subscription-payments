'use client';

import { useState } from 'react';

export default function CreatorDashboard() {
  const [usdtAddress, setUsdtAddress] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [paymentDate, setPaymentDate] = useState('2026-09-15');

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Top Bar */}
      <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 text-black font-bold rounded p-1 text-sm">F</div>
          <span className="font-bold text-xl">fladnag</span>
        </div>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-sm text-gray-300 px-4 py-2 rounded border border-zinc-700">
          Sign Out
        </button>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Track your performance and USDT payout details.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <span className="text-gray-400 text-sm">Total Earnings</span>
            <div className="text-3xl font-bold text-emerald-400 mt-2">$0.00 USDT</div>
            <span className="text-xs text-gray-500 mt-1 block">Updated real-time</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <span className="text-gray-400 text-sm">Refund Deductions</span>
            <div className="text-3xl font-bold text-red-400 mt-2">-$0.00 USDT</div>
            <span className="text-xs text-gray-500 mt-1 block">Total deducted from returns</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <span className="text-gray-400 text-sm">Estimated Payout Date</span>
            <div className="text-2xl font-bold text-white mt-2">{paymentDate}</div>
            <span className="text-xs text-emerald-500 mt-1 block">Earliest: Minimum 30 days lock</span>
          </div>
        </div>

        {/* Wallet & Settings Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Address Input */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">USDT Wallet Address</h3>
            <p className="text-gray-400 text-xs mb-4">Provide your TRC20 or ERC20 USDT address to receive payouts.</p>
            <form onSubmit={handleSaveWallet} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="e.g. T9yD14Nj9j7xAB4..."
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded text-sm transition"
              >
                Save Address
              </button>
              {isSaved && <span className="text-emerald-400 text-xs ml-3">Saved successfully!</span>}
            </form>
          </div>

          {/* Schedule Payout Date */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Payout Date Preference</h3>
            <p className="text-gray-400 text-xs mb-4">You can delay your payout date beyond the minimum threshold.</p>
            <div className="space-y-4">
              <input
                type="date"
                value={paymentDate}
                min="2026-09-15"
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500">Note: Payout date cannot be set earlier than the minimum allowed date.</p>
            </div>
          </div>
        </div>

        {/* Notifications / Order Logs */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-4">Recent Sales & Notifications</h3>
          <div className="text-center py-8 text-gray-500 text-sm">
            No sales or refund notifications recorded yet.
          </div>
        </div>
      </div>
    </div>
  );
}
