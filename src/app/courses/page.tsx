'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  image_url: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from('courses').select('*');
      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 dir-rtl" dir="rtl">
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">الكورسات التعليمية 📚</h1>
          <p className="text-slate-400 text-sm">اختر الدورات التدريبية وابدأ في تطوير مهاراتك بالتداول.</p>
        </div>
        <Link
          href="/dashboard"
          className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm hover:bg-slate-800 transition"
        >
          ← العودة للوحة التحكم
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-slate-500 animate-pulse">جاري تحميل الكورسات...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition">
                {course.image_url && (
                  <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                      {course.level}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-3 mb-2">{course.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-6">{course.description}</p>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition text-sm text-center block"
                  >
                    ابدأ الدورة الآن
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}