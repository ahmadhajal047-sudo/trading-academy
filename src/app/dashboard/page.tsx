'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUserEmail(user.email ?? null);
      }
      setLoading(false);
    }
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center dir-rtl" dir="rtl">
        <p className="text-lg font-medium">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans dir-rtl" dir="rtl">
      {/* القائمة الجانبية */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-l border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <span className="font-bold text-lg text-white block leading-tight">منصة التداول</span>
              <span className="text-xs text-indigo-400 font-medium">Academy & Journal</span>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-600/20 text-indigo-300 font-medium rounded-xl transition">
              <span>📊</span>
              <span>لوحة التحكم</span>
            </Link>

            <Link href="/courses" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-xl transition">
              <span>📚</span>
              <span>الكورسات التعليمية</span>
            </Link>

            <Link href="/journal" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-xl transition">
              <span>📓</span>
              <span>دفتر التداول</span>
            </Link>

            <Link href="/ai-analyzer" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-xl transition">
              <span>🤖</span>
              <span>محلل الذكاء الاصطناعي</span>
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 border border-red-500/20"
        >
          <span>تسجيل الخروج</span>
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              أهلاً بك مجدداً 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">مواظبتك اليومية هي طريقك للاحتراف.</p>
          </div>

          {userEmail && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 self-start md:self-auto">
              {userEmail}
            </div>
          )}
        </header>

        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-2">الكورسات المكتملة</span>
            <span className="text-3xl font-bold text-white">0 / 4</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-2">الصفقات المسجلة</span>
            <span className="text-3xl font-bold text-white">0 صفقة</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-2">تقييم الالتزام</span>
            <span className="text-3xl font-bold text-emerald-400">100%</span>
          </div>
        </div>

        {/* كارت بدء التعلم */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">ابدأ رحلتك التعليمية الآن 🚀</h2>
            <p className="text-slate-300 text-sm max-w-xl">
              استكشف الدروس الأولى واكتسب الأساسيات لبناء استراتيجية تداول ناجحة وإدارة مخاطر صارمة.
            </p>
          </div>
          <Link
            href="/courses"
            className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition text-sm shadow-lg shadow-indigo-600/30"
          >
            تصفح الكورسات
          </Link>
        </div>
      </main>
    </div>
  );
}