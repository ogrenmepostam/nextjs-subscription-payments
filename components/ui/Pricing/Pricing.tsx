'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Props {
  user: any;
  products: any[];
  subscription: any;
}

export default function Pricing({ user }: Props) {
  const supabase = createClientComponentClient();
  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000';
  
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(adminWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash) return;
    
    setLoading(true);
    setErrorMessage('');

    if (!user) {
      setErrorMessage('Ödeme bildirimi yapmak için lütfen önce giriş yapın.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('payments').insert([
        {
          user_id: user.id,
          tx_hash: txHash.trim(),
          status: 'pending'
        }
      ]);

      if (error) {
        if (error.code === '23505') {
          setErrorMessage('Bu İşlem Kodu (TxHash) daha önce bildirilmiş.');
        } else {
          setErrorMessage('Kayıt oluşturulurken bir hata oluştu: ' + error.message);
        }
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage('Bir kriz/bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(adminWallet)}`;

  return (
    <section className="bg-black text-white py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          USDT ile Abonelik & Katılım
        </h1>
        <p className="text-zinc-400 text-lg">
          Ödemenizi doğrudan Web3 cüzdanınızdan USDT (BEP20 / TRC20) olarak gerçekleştirebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        {/* ÖDEME KARTI */}
        <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
          <h2 className="text-xl font-bold mb-2">USDT Ödeme Kasası</h2>
          <p className="text-xs text-zinc-400 mb-4">Ağ: BNB Smart Chain (BEP20) / TRC20</p>

          <div className="bg-white p-2 rounded-lg mb-4 border border-zinc-700">
            <img 
              src={qrImageUrl} 
              alt="USDT Cüzdan QR Kodu" 
              className="w-40 h-40 object-contain rounded"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs text-zinc-500 mb-1 text-left">Resmi Cüzdan Adresi</label>
            <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs font-mono break-all mb-3">
              <span className="flex-1 text-zinc-300">{adminWallet}</span>
              <button
                onClick={handleCopy}
                className="ml-2 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs px-3 py-1.5 rounded transition"
              >
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
          </div>
        </div>

        {/* İŞLEM ONAY & AFFILIATE */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ödeme Bildirimi</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Transferi yaptıktan sonra İşlem Kodunu (TxHash) aşağıya girerek aboneliğinizi aktif edebilirsiniz.
            </p>

            {submitted ? (
              <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm">
                ✓ İşlem kodunuz Supabase veritabanına iletildi. Doğrulama yapıldıktan sonra erişiminiz tanımlanacaktır.
              </div>
            ) : (
              <form onSubmit={handleSubmitTx} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="0x... (TxHash / Transfer Kodu)"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono"
                    required
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-bold py-3 px-4 rounded-lg text-sm transition"
                >
                  {loading ? 'İşleniyor...' : 'Ödemeyi Onayla'}
                </button>
              </form>
            )}
          </div>

          {/* REFERANS PANELİ */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <h4 className="text-sm font-semibold mb-1 text-emerald-400">Yayıncı / Referans Paneli</h4>
            <p className="text-xs text-zinc-400 mb-3">
              Kendi referans linkinizle kullanıcı davet edin, her satıştan komisyon kazanın.
            </p>
            {user ? (
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300">
                Sizin Ref Linkiniz: <span className="text-emerald-400">?ref={user.id?.slice(0, 8)}</span>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">
                * Özel referans linkinizi görmek için giriş yapmalısınız.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
