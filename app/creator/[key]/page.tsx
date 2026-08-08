'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CreatorDashboard() {
  const params = useParams();
  const accessKey = params?.key as string;

  const [creator, setCreator] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessKey) fetchCreatorData();
  }, [accessKey]);

  const fetchCreatorData = async () => {
    setLoading(true);
    const { data: creatorData } = await supabase
      .from('creators')
      .select('*')
      .eq('access_key', accessKey)
      .single();

    if (creatorData) {
      setCreator(creatorData);

      const { data: matchData } = await supabase
        .from('matches')
        .select('*, companies(name)')
        .eq('creator_id', creatorData.id);

      if (matchData) setMatches(matchData);

      const matchIds = matchData?.map(m => m.id) || [];
      if (matchIds.length > 0) {
        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .in('match_id', matchIds);
        if (txData) setTransactions(txData);
      }
    }
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center text-white">Loading dashboard...</div>;
  if (!creator) return <div className="p-10 text-center text-red-500">Invalid or expired Access Key.</div>;

  // Bakiyeler
  const totalPaid = transactions
    .filter(t => t.status === 'creator_paid')
    .reduce((acc, t) => acc + (t.creator_amount || 0), 0);

  const pendingBalance = transactions
    .filter(t => t.status === 'pending')
    .reduce((acc, t) => acc + (t.creator_amount || 0), 0);

  const refundedBalance = transactions
    .filter(t => t.status === 'refunded')
    .reduce((acc, t) => acc + (t.creator_amount || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 max-w-5xl mx-auto space-y-8">
      <header className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold text-emerald-400">Welcome, {creator.name}</h1>
        <p className="text-zinc-400 text-sm mt-1">Creator Commission & Payout Tracking Dashboard</p>
      </header>

      {/* METRICS & BALANCES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase font-bold">Total Paid</p>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{totalPaid} USDT</p>
        </div>
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase font-bold">Pending Balance</p>
          <p className="text-2xl font-bold text-yellow-400 mt-2">{pendingBalance} USDT</p>
        </div>
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase font-bold">Refunded / Deducted</p>
          <p className="text-2xl font-bold text-red-400 mt-2">-{refundedBalance} USDT</p>
        </div>
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase font-bold">Payout Wallet</p>
          <p className="text-xs font-mono text-zinc-300 mt-3 truncate">{creator.wallet_address || 'Not Provided'}</p>
        </div>
      </div>

      {/* ACTIVE CAMPAIGNS */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-200 mb-4">Your Active Referral Links</h2>
        <div className="space-y-3">
          {matches.map(m => (
            <div key={m.id} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-white">{m.companies?.name}</p>
                <p className="text-xs text-zinc-400">Commission Per Sale: <span className="text-emerald-400 font-bold">{creator.commission_per_sale} USDT</span></p>
              </div>
              <div className="bg-zinc-900 px-3 py-2 rounded border border-zinc-700 font-mono text-sm text-blue-400">
                ?ref={m.ref_code}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRANSACTIONS AND ESTIMATED PAYOUT DATES */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-200 mb-4">Transaction History & Payout Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Estimated Payout Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {transactions.map(t => {
                const payoutDateStr = t.payout_date 
                  ? new Date(t.payout_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  : 'Pending Verification';

                return (
                  <tr key={t.id}>
                    <td className={`p-3 font-bold ${t.status === 'refunded' ? 'text-red-400 line-through' : 'text-emerald-400'}`}>
                      {t.status === 'refunded' ? `-${t.creator_amount}` : `+${t.creator_amount}`} USDT
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        t.status === 'refunded' ? 'bg-red-950 text-red-400' :
                        t.status === 'creator_paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-yellow-950 text-yellow-400'
                      }`}>
                        {t.status === 'refunded' ? 'Refunded' : t.status === 'creator_paid' ? 'Paid Out' : 'Pending Hold'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs text-zinc-400">
                      {t.status === 'refunded' ? 'Cancelled (Refunded)' : t.status === 'creator_paid' ? 'Completed' : payoutDateStr}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
