'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Trade {
  id: string;
  symbol: string;
  type: string;
  entry_price: number;
  exit_price: number;
  lot_size: number;
  profit_loss: number;
  risk_reward: number;
  notes: string;
  created_at: string;
}

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // نموذج إضافة صفقة جديدة
  const [symbol, setSymbol] = useState('XAUUSD');
  const [type, setType] = useState('BUY');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [lotSize, setLotSize] = useState('0.10');
  const [profitLoss, setProfitLoss] = useState('');
  const [riskReward, setRiskReward] = useState('2.0');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTrades = async () => {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTrades(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleAddTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('يرجى تسجيل الدخول أولاً');
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from('trades').insert([
      {
        user_id: user.id,
        symbol: symbol.toUpperCase(),
        type,
        entry_price: parseFloat(entryPrice),
        exit_price: parseFloat(exitPrice),
        lot_size: parseFloat(lotSize),
        profit_loss: parseFloat(profitLoss),
        risk_reward: parseFloat(riskReward),
        notes,
      },
    ]);

    if (error) {
      alert('حدث خطأ أثناء إضافة الصفقة: ' + error.message);
    } else {
      // إعادة ضبط النموذج وتحديث القائمة
      setProfitLoss('');
      setEntryPrice('');
      setExitPrice('');
      setNotes('');
      fetchTrades();
    }
    setSubmitting(false);
  };

  // إحصائيات الدفتر الحسابية التلقائية
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.profit_loss > 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0';
  const netPnL = trades.reduce((acc, t) => acc + Number(t.profit_loss), 0).toFixed(2);
  const avgRR = totalTrades > 0 ? (trades.reduce((acc, t) => acc + Number(t.risk_reward), 0) / totalTrades).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 dir-rtl" dir="rtl">
      {/* الهيدر */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">دفتر التداول الرقمي 📓</h1>
          <p className="text-slate-400 text-sm">دّون صفقاتك وراقب إحصائياتك لتطوير استراتيجيتك.</p>
        </div>
        <Link
          href="/dashboard"
          className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm hover:bg-slate-800 transition"
        >
          ← العودة للوحة التحكم
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* نموذج إضافة صفقة */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
          <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">تسجيل صفقة جديدة</h2>
          <form onSubmit={handleAddTrade} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">الزوج / الأداة المالية</label>
              <input
                type="text"
                required
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="مثال: XAUUSD"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">نوع الصفقة</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="BUY">شراء (BUY)</option>
                  <option value="SELL">بيع (SELL)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">حجم اللوت (Lot)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">سعر الدخول</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="2035.50"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">سعر الخروج</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="2042.10"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">الربح/الخسارة ($)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={profitLoss}
                  onChange={(e) => setProfitLoss(e.target.value)}
                  placeholder="مثال: 150 أو -50"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">نسبة المخاطرة R:R</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={riskReward}
                  onChange={(e) => setRiskReward(e.target.value)}
                  placeholder="2.0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">ملاحظات / سبب الدخول</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="كسر ترند على فريم 15 دقيقة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition text-sm disabled:opacity-50"
            >
              {submitting ? 'جاري الحفظ...' : '+ إضافة الصفقة'}
            </button>
          </form>
        </div>

        {/* عرض الإحصائيات وجدول الصفقات */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* كروت الإحصائيات التلقائية */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs">إجمالي الصفقات</span>
              <h3 className="text-2xl font-bold text-white mt-1">{totalTrades}</h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs">نسبة النجاح (Win Rate)</span>
              <h3 className="text-2xl font-bold text-indigo-400 mt-1">{winRate}%</h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs">صافي الأرباح</span>
              <h3 className={`text-2xl font-bold mt-1 ${Number(netPnL) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${netPnL}
              </h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs">متوسط R:R</span>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">1:{avgRR}</h3>
            </div>
          </div>

          {/* جدول الصفقات */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">سجل الصفقات</h2>
            {loading ? (
              <p className="text-slate-500 text-sm animate-pulse">جاري التحميل...</p>
            ) : trades.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center">لا توجد صفقات مسجلة بعد. ابدأ بإضافة صفتك الأولى!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs">
                      <th className="pb-3">الزوج</th>
                      <th className="pb-3">النوع</th>
                      <th className="pb-3">اللوت</th>
                      <th className="pb-3">الدخول/الخروج</th>
                      <th className="pb-3">الربح/الخسارة</th>
                      <th className="pb-3">R:R</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {trades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-slate-800/30">
                        <td className="py-3 font-semibold text-white">{trade.symbol}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">{trade.lot_size}</td>
                        <td className="py-3 text-slate-400 text-xs">
                          {trade.entry_price} ← {trade.exit_price}
                        </td>
                        <td className={`py-3 font-bold ${trade.profit_loss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {trade.profit_loss >= 0 ? `+$${trade.profit_loss}` : `-$${Math.abs(trade.profit_loss)}`}
                        </td>
                        <td className="py-3 text-amber-400">1:{trade.risk_reward}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}