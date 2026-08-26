'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) {
        setMessageType('error');
        setMessage(error.message);
      } else {
        setMessageType('success');
        setMessage('تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.');
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessageType('error');
        setMessage(error.message);
      } else {
        window.location.href = '/dashboard';
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-2xl shadow-lg shadow-emerald-500/20 mx-auto mb-4">
            📈
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">أكاديمية المتداولين</h1>
          <p className="text-sm text-slate-400">
            {isSignUp ? 'أنشئ حسابك وابدأ رحلتك التعليمية' : 'سجّل دخولك لمتابعة رحلتك التعليمية'}
          </p>
        </div>

        {/* البطاقة */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>

          {message && (
            <div
              className={`text-xs p-3 rounded-xl mb-5 text-center border ${
                messageType === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أحمد محمد"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition duration-200 mt-2 disabled:opacity-50"
            >
              {loading
                ? 'جاري التحميل...'
                : isSignUp
                ? 'إنشاء الحساب'
                : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage('');
              }}
              className="text-emerald-400 font-semibold hover:underline"
            >
              {isSignUp ? 'تسجيل الدخول' : 'أنشئ حساباً جديداً'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}