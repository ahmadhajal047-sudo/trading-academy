import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'منصة تداول المحترفين',
  description: 'منصة التداول الذكية والكورسات المتقدمة',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-white font-sans antialiased">
        {/* شريط التنقل العلوي الرئيسي */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <span className="font-bold text-emerald-400 text-lg">Trading Pro</span>
            </div>
            
            <nav className="flex gap-4 text-sm font-semibold">
              <Link href="/" className="hover:text-emerald-400 transition-all text-slate-300">
                💬 المحلل الذكي
              </Link>
              <Link href="/courses/1" className="hover:text-emerald-400 transition-all text-slate-300">
                🎓 كورس التداول
              </Link>
              <Link href="/admin" className="bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-xl transition-all">
                🛠️ لوحة الأدمن
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}