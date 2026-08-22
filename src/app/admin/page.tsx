'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase'; // تأكد من مطابقة مسار ملف supabase لديك

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  passingScore: number;
  questions: Question[];
}

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz?: Quiz;
}

interface Course {
  id: string;
  title: string;
  category: string;
  sections: Section[];
}

// اكتب إيميلك الخاص بالأدمن هنا
const ADMIN_EMAIL = "ahmadhajal047@gmail.com"; 

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // التحقق من صلاحيات الأدمن عند فتح الصفحة
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. إذا لم يكن مسجلاً، وجهه لصفحة الدخول
        if (!user) {
          router.replace('/login');
          return;
        }

        // 2. إذا لم يكن الإيميل مطابقاً لإيميل الأدمن، وجهه للداشبورد العادي
        if (user.email !== ADMIN_EMAIL) {
          router.replace('/dashboard');
          return;
        }

        // المستخدم أدمن بالفعل
        setAuthorized(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_courses');
      if (saved) {
        try { 
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
    }
    return [
      {
        id: '1',
        title: 'كورس احتراف تداول الذهب والمؤشرات (SMC)',
        category: 'تداول',
        sections: [
          {
            id: 's1',
            title: 'الفصل الأول: أساسيات كسر السيولة وهيكل السوق',
            lessons: [
              { id: 'l1', title: 'شرح مناطق الـ Order Block', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
            ],
            quiz: {
              passingScore: 70,
              questions: [
                {
                  id: 'q1',
                  question: 'ما هو شرط كسر الهيكل الصاعد (BOS)؟',
                  options: ['إغلاق شمعة أعلى آخر قمة', 'ملامسة خط الدعم', 'ارتفاع الرافعة المالية'],
                  correctAnswer: 0
                }
              ]
            }
          }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('app_courses', JSON.stringify(courses));
  }, [courses]);

  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'section' | 'lesson' | 'quiz' | null>(null);

  const [sectionTitleInput, setSectionTitleInput] = useState('');
  const [lessonTitleInput, setLessonTitleInput] = useState('');
  const [lessonUrlInput, setLessonUrlInput] = useState('');

  // إدارة الأسئلة للاختبار
  const [quizScore, setQuizScore] = useState<number>(70);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [currentQText, setCurrentQText] = useState('');
  const [currentOpt1, setCurrentOpt1] = useState('');
  const [currentOpt2, setCurrentOpt2] = useState('');
  const [currentOpt3, setCurrentOpt3] = useState('');
  const [currentCorrect, setCurrentCorrect] = useState<number>(0);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    const newCourse: Course = {
      id: Date.now().toString(),
      title: newCourseTitle,
      category: 'تداول',
      sections: []
    };
    setCourses([...courses, newCourse]);
    setNewCourseTitle('');
  };

  const handleAddSection = () => {
    if (!sectionTitleInput.trim() || !activeCourseId) return;
    setCourses(courses.map(course => {
      if (course.id === activeCourseId) {
        return {
          ...course,
          sections: [...course.sections, { id: Date.now().toString(), title: sectionTitleInput, lessons: [] }]
        };
      }
      return course;
    }));
    setSectionTitleInput('');
    setModalType(null);
  };

  const handleAddLesson = () => {
    if (!lessonTitleInput.trim() || !activeCourseId || !activeSectionId) return;
    setCourses(courses.map(course => {
      if (course.id === activeCourseId) {
        return {
          ...course,
          sections: course.sections.map(sec => {
            if (sec.id === activeSectionId) {
              return {
                ...sec,
                lessons: [...sec.lessons, { id: Date.now().toString(), title: lessonTitleInput, videoUrl: lessonUrlInput }]
              };
            }
            return sec;
          })
        };
      }
      return course;
    }));
    setLessonTitleInput('');
    setLessonUrlInput('');
    setModalType(null);
  };

  const handleOpenQuizModal = (courseId: string, section: Section) => {
    setActiveCourseId(courseId);
    setActiveSectionId(section.id);
    if (section.quiz) {
      setQuizScore(section.quiz.passingScore || 70);
      setQuestionsList(Array.isArray(section.quiz.questions) ? section.quiz.questions : []);
    } else {
      setQuizScore(70);
      setQuestionsList([]);
    }
    setModalType('quiz');
  };

  const handleAddQuestionToList = () => {
    if (!currentQText.trim() || !currentOpt1.trim() || !currentOpt2.trim() || !currentOpt3.trim()) return;
    
    const newQ: Question = {
      id: Date.now().toString(),
      question: currentQText,
      options: [currentOpt1, currentOpt2, currentOpt3],
      correctAnswer: currentCorrect
    };

    setQuestionsList([...questionsList, newQ]);
    setCurrentQText('');
    setCurrentOpt1('');
    setCurrentOpt2('');
    setCurrentOpt3('');
    setCurrentCorrect(0);
  };

  const handleRemoveQuestion = (qId: string) => {
    setQuestionsList(questionsList.filter(q => q.id !== qId));
  };

  const handleSaveQuiz = () => {
    if (!activeCourseId || !activeSectionId || questionsList.length === 0) return;

    setCourses(courses.map(course => {
      if (course.id === activeCourseId) {
        return {
          ...course,
          sections: course.sections.map(sec => {
            if (sec.id === activeSectionId) {
              return {
                ...sec,
                quiz: {
                  passingScore: Number(quizScore),
                  questions: questionsList
                }
              };
            }
            return sec;
          })
        };
      }
      return course;
    }));

    setModalType(null);
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_courses');
      window.location.reload();
    }
  };

  // شاشة الانتظار أثناء التحقق من الهوية
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-emerald-400 font-sans">
        <p className="animate-pulse text-lg">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  // منع عرض الصفحة إذا لم يكن أدمن
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="border-b border-slate-800 pb-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">لوحة تحكم أدمن التداول 📈</h1>
            <p className="text-slate-400 mt-1">إدارة الكورسات، إنشاء اختبارات متعددة الأسئلة، وضبط نسبة الاجتياز</p>
          </div>
          <button 
            onClick={resetAllData} 
            className="bg-rose-600/20 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs hover:bg-rose-600 hover:text-white transition-all"
          >
            🔄 إعادة ضبط البيانات القديمة
          </button>
        </div>

        {/* إضافة كورس */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">إنشاء كورس تداول جديد</h2>
          <form onSubmit={handleAddCourse} className="flex gap-4">
            <input
              type="text"
              placeholder="عنوان الكورس"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-white"
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all">
              + إضافة الكورس
            </button>
          </form>
        </div>

        {/* الكورسات */}
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white">{course.title}</h3>
                <button
                  onClick={() => {
                    setActiveCourseId(course.id);
                    setModalType('section');
                  }}
                  className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 hover:text-white"
                >
                  + إضافة فصل جديد
                </button>
              </div>

              <div className="space-y-4">
                {course.sections.map((sec) => {
                  const qCount = sec.quiz && Array.isArray(sec.quiz.questions) ? sec.quiz.questions.length : 0;
                  return (
                    <div key={sec.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-lg text-emerald-300">{sec.title}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setActiveCourseId(course.id);
                              setActiveSectionId(sec.id);
                              setModalType('lesson');
                            }}
                            className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-slate-200"
                          >
                            + إضافة فيديو
                          </button>
                          <button
                            onClick={() => handleOpenQuizModal(course.id, sec)}
                            className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-black px-3 py-2 rounded-lg font-semibold"
                          >
                            {sec.quiz ? `تعديل الاختبار (${qCount} أسئلة)` : '+ إضافة اختبار'}
                          </button>
                        </div>
                      </div>

                      <div className="pr-4 border-r-2 border-slate-800 space-y-2">
                        {sec.lessons.map((lesson) => (
                          <div key={lesson.id} className="text-sm text-slate-300 flex justify-between bg-slate-900/50 p-2 rounded-lg">
                            <span>🎥 {lesson.title}</span>
                          </div>
                        ))}
                      </div>

                      {sec.quiz && (
                        <div className="bg-amber-950/20 border border-amber-500/20 p-3 rounded-lg text-xs text-amber-300 flex justify-between items-center">
                          <span>📝 عدد أسئلة الاختبار: **{qCount} أسئلة**</span>
                          <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded font-bold">
                            نسبة النجاح المطلوبة: {sec.quiz.passingScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal الاختبار */}
        {modalType === 'quiz' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">إعداد اختبار الفصل (أسئلة متعددة)</h3>

              <div className="flex gap-4 items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="text-sm text-slate-300 font-bold">نسبة النجاح المطلوبة للفصل:</label>
                <input
                  type="number"
                  value={quizScore}
                  onChange={(e) => setQuizScore(Number(e.target.value))}
                  className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                />
                <span className="text-slate-400">%</span>
              </div>

              {/* الأسئلة */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-emerald-400">الأسئلة المضافة ({questionsList.length}):</h4>
                {questionsList.map((q, idx) => (
                  <div key={q.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{idx + 1}. {q.question}</p>
                      <p className="text-slate-400 mt-1">الخيار الصحيح: {q.options[q.correctAnswer]}</p>
                    </div>
                    <button onClick={() => handleRemoveQuestion(q.id)} className="text-rose-400 hover:text-rose-300 font-bold">حذف</button>
                  </div>
                ))}
              </div>

              {/* إضافة سؤال */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-amber-400">+ إضافة سؤال جديد للاختبار</h4>
                <input
                  type="text"
                  placeholder="نص السؤال"
                  value={currentQText}
                  onChange={(e) => setCurrentQText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" placeholder="الخيار 1" value={currentOpt1} onChange={(e) => setCurrentOpt1(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  <input type="text" placeholder="الخيار 2" value={currentOpt2} onChange={(e) => setCurrentOpt2(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  <input type="text" placeholder="الخيار 3" value={currentOpt3} onChange={(e) => setCurrentOpt3(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2 items-center text-xs text-slate-300">
                    <span>الإجابة الصحيحة:</span>
                    <select value={currentCorrect} onChange={(e) => setCurrentCorrect(Number(e.target.value))} className="bg-slate-900 border border-slate-800 rounded p-1">
                      <option value={0}>الخيار 1</option>
                      <option value={1}>الخيار 2</option>
                      <option value={2}>الخيار 3</option>
                    </select>
                  </div>
                  <button onClick={handleAddQuestionToList} className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2 rounded-lg font-bold">
                    إضافة السؤال للاختبار
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 rounded-xl text-xs text-slate-300">إلغاء</button>
                <button onClick={handleSaveQuiz} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl text-xs">
                  حفظ الاختبار بالكامل
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal الفصول والدروس */}
        {modalType === 'section' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4">
              <h3 className="text-xl font-bold text-white">إضافة فصل جديد</h3>
              <input type="text" placeholder="عنوان الفصل" value={sectionTitleInput} onChange={(e) => setSectionTitleInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300">إلغاء</button>
                <button onClick={handleAddSection} className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold">إضافة</button>
              </div>
            </div>
          </div>
        )}

        {modalType === 'lesson' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4">
              <h3 className="text-xl font-bold text-white">إضافة فيديو درس</h3>
              <input type="text" placeholder="عنوان الدرس" value={lessonTitleInput} onChange={(e) => setLessonTitleInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
              <input type="text" placeholder="رابط الفيديو (YouTube Embed)" value={lessonUrlInput} onChange={(e) => setLessonUrlInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300">إلغاء</button>
                <button onClick={handleAddLesson} className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold">إضافة الدرس</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}