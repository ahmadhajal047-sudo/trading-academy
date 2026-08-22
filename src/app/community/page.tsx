import Link from "next/link";

export default function CommunityPage() {
  const posts = [
    {
      id: 1,
      author: "أحمد المتداول",
      avatar: "A",
      time: "منذ ساعتين",
      title: "نظرة تحليليّة على زوج EUR/USD للأسبوع القادم",
      content: "نعتقد أن منطقة 1.0850 تشكل منطقة دعم قوية جداً. في حال الإغلاق فوق 1.0900 سنشهد استهدافاً للمستويات العالية.",
      likes: 24,
      comments: 7,
    },
    {
      id: 2,
      author: "سارة خبير تداول",
      avatar: "S",
      time: "منذ 5 ساعات",
      title: "نصيحة اليوم: عدم التداول أثناء الأخبار عالية التأثير",
      content: "إدارة المخاطر هي المفتاح الأساسي للاستمرار في هذا السوق. دائماً ضع أهدافك ولا تلاحق الشموع القوية.",
      likes: 45,
      comments: 12,
    },
  ];

  const leaderboard = [
    { rank: 1, name: "سامر العلي", profit: "+34.5%", avatar: "🥇" },
    { rank: 2, name: "عمر فاروق", profit: "+28.2%", avatar: "🥈" },
    { rank: 3, name: "خالد منصور", profit: "+21.0%", avatar: "🥉" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-l border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
              T
            </div>
            <span className="font-bold text-lg text-white">منصة المتداولين</span>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl font-medium transition">
              <span>📊</span> لوحة التحكم
            </Link>
            <Link href="/academy" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl font-medium transition">
              <span>📚</span> الأكاديمية
            </Link>
            <Link href="/community" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20">
              <span>💬</span> المجتمع والمسابقات
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6">
          <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition">
            <span>🚪</span> تسجيل الخروج
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">مجتمع المتداولين والمسابقات 💬🏆</h1>
          <p className="text-slate-400 text-sm">شارك تحليلاتك، تناقش مع الأعضاء، وتابع متصدري مسابقة هذا الشهر.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed / منشورات المجتمع */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Card */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <textarea
                rows={3}
                placeholder="شارك تحليلك أو فكرتك مع المجتمع..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition resize-none"
              ></textarea>
              <div className="flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-xl text-sm shadow-lg shadow-blue-600/30 transition">
                  نشر المنشور
                </button>
              </div>
            </div>

            {/* Posts List */}
            {posts.map((post) => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30">
                    {post.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{post.author}</h4>
                    <span className="text-xs text-slate-500">{post.time}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-1">{post.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                  <button className="hover:text-blue-400 flex items-center gap-1 transition">
                    <span>👍</span> {post.likes} إعجاب
                  </button>
                  <button className="hover:text-blue-400 flex items-center gap-1 transition">
                    <span>💬</span> {post.comments} تعليق
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel / المسابقات والترتيب */}
          <div className="space-y-6">
            {/* Top Traders Leaderboard */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">متصدرو مسابقة الشهر 🏆</h3>
                <span className="text-xs text-emerald-400 font-semibold">جاري التحديث</span>
              </div>

              <div className="space-y-3">
                {leaderboard.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.avatar}</span>
                      <span className="font-semibold text-sm text-white">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{item.profit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}