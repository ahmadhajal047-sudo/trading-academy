'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

export default function AiAnalystPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'أهلاً فيك! أنا المحلل الذكي، اسألني أي سؤال متعلق بالتداول والأسواق المالية.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/trading-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply || data.error || 'حدث خطأ' },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'تعذر الاتصال، تحقق من الإنترنت وحاول مجدداً.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">المحلل الذكي 🤖</h1>

      <div className="w-full max-w-2xl flex-1 bg-gray-900 rounded-xl p-4 flex flex-col gap-3 overflow-y-auto min-h-[60vh] max-h-[70vh]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-blue-600 self-end text-white'
                : 'bg-gray-800 self-start text-gray-100'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-gray-800 px-4 py-2 rounded-2xl text-gray-400">
            يكتب الآن...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="w-full max-w-2xl flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="اكتب سؤالك عن التداول هنا..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
