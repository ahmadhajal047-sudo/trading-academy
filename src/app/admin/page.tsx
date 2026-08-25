'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.replace('/login');
          return;
        }

        if (user.email !== ADMIN_EMAIL) {
          router.replace('/dashboard');
          return;
        }

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

  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    setCoursesLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('خطأ في جلب الكورسات:', error);
    } else if (data) {
      const mapped: Course[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category || 'تداول',
        sections: Array.isArray(row.sections) ? row.sections : [],
      }));
      setCourses(mapped);
    }
    setCoursesLoading(false);
  };

  useEffect(() => {
    if (authorized) {
      fetchCourses();
    }
  }, [authorized]);

  const updateCourseSections = async (courseId: string, newSections: Section[]) => {
    setSaving(true);
    const { error } = await supabase
      .from('courses')
      .update({ sections: newSections })
      .eq('id', courseId);

    if (error) {
      alert('حدث خطأ أثناء الحفظ: ' + error.message);
    }
    setSaving(false);
  };

  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'section' | 'lesson' | 'quiz' | null>(null);

  const [sectionTitleInput, setSectionTitleInput] = useState('');
  const [lessonTitleInput, setLessonTitleInput] = useState('');
  const [lessonUrlInput, setLessonUrlInput] = useState('');

  const [quizScore, setQuizScore] = useState<number>(70);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [currentQText, setCurrentQText] = useState('');
  const [currentOpt1, setCurrentOpt1] = useState('');
  const [currentOpt2, setCurrentOpt2] = useState('');
  const [currentOpt3, setCurrentOpt3] = useState('');
  const [currentCorrect, setCurrentCorrect] = useState<number>(0);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    setSaving(true);
    const { error } = await supabase.from('courses').insert([
      {
        title: newCourseTitle,
        category: 'تداول',
        sections: [],
      },
    ]);

    if (error) {
      alert('حدث خطأ أثناء إضافة الكورس: ' + error.message);
    } else {
      setNewCourseTitle('');
      await fetchCourses();
    }
    setSaving(false);
  };

  const handleAddSection = async () => {
    if (!sectionTitleInput.trim() || !activeCourseId) return;

    const course = courses.find((c) => c.id === activeCourseId);
    if (!course) return;

    const newSections = [
      ...course.sections,
      { id: Date.now().toString(), title: sectionTitleInput, lessons: [] },
    ];

    setCourses(courses.map((c) => (c.id === activeCourseId ? { ...c, sections: newSections } : c)));
    setSectionTitleInput('');
    setModalType(null);

    await updateCourseSections(activeCourseId, newSections);
  };

  const handleAddLesson = async () => {
    if (!lessonTitleInput.trim() || !activeCourseId || !activeSectionId) return;

    const course = courses.find((c) => c.id === activeCourseId);
    if (!course) return;

    const newSections = course.sections.map((sec) => {
      if (sec.id === activeSectionId) {
        return {
          ...sec,
          lessons: [...sec.lessons, { id: Date.now().toString(), title: lessonTitleInput, videoUrl: lessonUrlInput }],
        };
      }
      return sec;
    });

    setCourses(courses.map((c) => (c.id === activeCourseId ? { ...c, sections: newSections } : c)));
    setLessonTitleInput('');
    setLessonUrlInput('');
    setModalType(null);

    await updateCourseSections(activeCourseId, newSections);
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
      correctAnswer: currentCorrect,
    };

    setQuestionsList([...questionsList, newQ]);
    setCurrentQText('');
    setCurrentOpt1('');
    setCurrentOpt2('');
    setCurrentOpt3('');
    setCurrentCorrect(0);
  };

  const handleRemoveQuestion = (qId: string) => {
    setQuestionsList(questionsList.filter((q) => q.id !== qId));
  };

  const handleSaveQuiz = async () => {
    if (!activeCourseId || !activeSectionId || questionsList.length === 0) return;

    const course = courses.find((c) => c.id === activeCourseId);
    if (!course) return;

    const newSections = course.sections.map((sec) => {
      if (sec.id === activeSectionId) {
        return {
          ...sec,
          quiz: {
            passingScore: Number(quizScore),
            questions: questionsList,
          },
        };
      }
      return sec;
    });

    setCourses(courses.map((c) => (c.id === activeCourseId ? { ...c, sections: newSections } : c)));
    setModalType(null);

    await updateCourseSections(activeCourseId, newSections);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-emerald-400 font-sans">
        <p className="animate-pulse text-lg">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="border-b border-slate-800 pb-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">لوحة تحكم أدمن التداول 📈</h1>
            <p className="text-slate-400 mt-1">إدارة الكورسات، إنشاء اختبارات متعددة الأسئلة، وضبط نسبة الاجتياز</p>
          </div>
          {saving && (
            <span className="text-xs text-amber-400 animate-pulse">جاري الحفظ...</span>
          )}
        </div>

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
            <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
              + إضافة الكورس
            </button>
          </form>
        </div>

        {coursesLoading ? (
          <div className="text-center py-16 text-slate-500 animate-pulse">جاري تحميل الكورسات من قاعدة البيانات...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-slate-500">لا توجد كورسات بعد. أضف أول كورس من الأعلى.</div>
        ) : (
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
                            <span>📝 عدد أسئلة الاختبار: <strong>{qCount} أسئلة</strong></span>
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
        )}

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