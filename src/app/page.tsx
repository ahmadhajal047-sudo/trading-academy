import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* Navbar / شريط النافبار */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
              T
            </div>
            <span className="font-bold text-xl text-white">أكاديمية المتداولين</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-blue-400 transition">الأكاديمية</Link>
            <Link href="/" className="hover:text-blue-400 transition">المجتمع</Link>
            <Link href="/" className="hover:text-blue-400 transition">المسابقات</Link>
            <Link href="/" className="hover:text-blue-400 transition">الدعم</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition px-3 py-2">
              تسجيل الدخول
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section / القسم الرئيسي */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center">
        <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-6">
          المنصة الأولى والكاملة للمتداولين العرب
        </span>

        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-6">
          منصة تجمع المتداولين في مكان واحد <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            للتعلم، التطور، المجتمع والدعم
          </span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          تعلم التداول من الصفر عبر كورسات واختبارات تفاعلية، شارك في مسابقات شهرية وجوائز قيمة، وتواصل مع مجتمع يدعمك دائماً.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/30 transition text-center">
            ابدأ رحلتك مجاناً
          </Link>
          <Link href="/login" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-8 py-4 rounded-xl transition text-center">
            استكشف الأكاديمية
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
        جميع الحقوق محفوظة © منصة أكاديمية المتداولين
      </footer>
    </div>
  );
}