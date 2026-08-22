'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAnalyzerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'أهلاً بك! أنا مساعد التداول الذكي 🤖. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن إدارة المخاطر، تحليل الأسواق، أو استراتيجيات التداول.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMsg }];

    setInput('');
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // إرسال الرسائل إلى السيرفر الخاص بنا
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `حدث خطأ: ${data.error || 'يرجى المحاولة لاحقاً'}` },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'تعذر الاتصال بالسيرفر. تأكد من إعداد المفتاح بشكل صحيح.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans dir-rtl" dir="rtl">
      {/* القائمة الجانبية */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-l border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
              🤖
            </div>
            <div>
              <span className="font-bold text-lg text-white block leading-tight">محلل الذكاء</span>
              <span className="text-xs text-purple-400 font-medium">AI Trading Analyst</span>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            <Link href="/dashboard" className="block px-4 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl transition">
              📊 لوحة التحكم
            </Link>

            <Link href="/courses" className="block px-4 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl transition">
              📚 الكورسات التعليمية
            </Link>

            <Link href="/journal" className="block px-4 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl transition">
              📓 دفتر التداول
            </Link>

            <Link href="/ai-analyzer" className="block px-4 py-2.5 bg-purple-600/20 text-purple-300 font-medium rounded-xl">
              🤖 محلل الذكاء الاصطناعي
            </Link>
          </nav>
        </div>
      </aside>

      {/* واجهة الشات الحقيقية */}
      <main className="flex-1 flex flex-col h-screen p-4 md:p-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">مساعد التداول الذكي 🤖</h1>
          <p className="text-xs text-slate-400">استفسر عن التحليلات، إدارة المخاطر، واستراتيجيات التداول</p>
        </div>

        {/* منطقة الرسائل */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 border border-slate-700/50 rounded-2xl p-4 text-sm animate-pulse">
                جاري التفكير والتحليل... ⏳
              </div>
            </div>
          )}
        </div>

        {/* مربع إدخال النص */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك للمحلل الذكي..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition disabled:opacity-50"
          >
            إرسال
          </button>
        </form>
      </main>
    </div>
  );
}