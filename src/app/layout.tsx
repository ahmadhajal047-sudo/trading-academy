import './globals.css';

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
        <main>{children}</main>
      </body>
    </html>
  );
}