'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans dir-rtl" dir="rtl">
      
      {/* الهيدر العلوي الخاص بالمنصة */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* اللوجو والعنوان */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              📈
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide">أكاديمية المتداولين</h1>
              <p className="text-xs text-emerald-400 font-medium">Trading Academy</p>
            </div>
          </div>

          {/* أزرار التسجيل والدخول */}
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link 
              href="/login" 
              className="px-5 py-2.5 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              إنشاء حساب
            </Link>
          </div>

        </div>
      </header>

      {/* المحتوى الرئيسي للبدء */}
      <main className="max-w-7xl mx-auto px-6 py-16 text-center space-y-8">
        
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-4">
          ✨ المنصة الأولى لتعليم تداول الأسواق المالية
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-white max-w-4xl mx-auto">
          احترف تداول الأسواق المالية مع <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">أفضل الكورسات المتقدمة</span>
        </h2>

        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          تعلم استراتيجيات SMC، تحليل السيولة، وإدارة المخاطر مع اختبارات تفاعلية ومتابعة مستمرة لتطوير مهاراتك في التداول.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <Link 
            href="/login" 
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-1"
          >
            ابدأ التعلم الآن 🚀
          </Link>
        </div>

      </main>

    </div>
  );
}