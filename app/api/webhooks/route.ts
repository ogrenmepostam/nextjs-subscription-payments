import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ref_code, tx_hash } = body;

    if (!ref_code) {
      return NextResponse.json({ error: 'ref_code gerekli' }, { status: 400 });
    }

    // 1. Gelen referans kodundan eşleşmeyi bul
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*, companies(*), creators(*)')
      .eq('ref_code', ref_code)
      .single();

    if (matchError || !match) {
      return NextResponse.json({ error: 'Eşleşen referans kodu bulunamadı' }, { status: 404 });
    }

    const companyAmount = match.companies?.commission_per_sale || 0;
    const creatorAmount = match.creators?.commission_per_sale || 0;

    // 2. İşlemi ve net kârı otomatik kaydet
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([
        {
          match_id: match.id,
          tx_hash: tx_hash || null,
          company_amount: companyAmount,
          creator_amount: creatorAmount,
          status: 'pending' // İade süresi geçene kadar beklemede
        }
      ])
      .select();

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Satış ve komisyonlar otomatik işlendi',
      data: transaction 
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
