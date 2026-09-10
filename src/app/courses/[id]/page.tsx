'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function StudentCoursesPage() {
  const params = useParams();
  const courseId = params?.id as string;

  const [courseTitle, setCourseTitle] = useState<string>('');
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [unlockedSections, setUnlockedSections] = useState<string[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('');

  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [quizResult, setQuizResult] = useState<{ passed: boolean; score: number } | null>(null);

  const formatYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';

    if (url.includes('youtube.com/embed/')) return url;

    let videoId = '';

    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error || !data) {
        console.error('خطأ في جلب الكورس:', error);
        setLoading(false);
        return;
      }

      setCourseTitle(data.title || '');
      const fetchedSections: Section[] = Array.isArray(data.sections) ? data.sections : [];
      setSections(fetchedSections);

      if (fetchedSections[0]?.lessons[0]?.videoUrl) {
        setActiveVideoUrl(fetchedSections[0].lessons[0].videoUrl);
      }
      if (fetchedSections[0]?.id) {
        setActiveSectionId(fetchedSections[0].id);
        setUnlockedSections([fetchedSections[0].id]);
      }

      setLoading(false);
    };

    fetchCourse();
  }, [courseId]);

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  const handleOpenQuiz = () => {
    setCurrentQIndex(0);
    setUserAnswers({});
    setQuizResult(null);
    setShowQuizModal(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers({ ...userAnswers, [currentQIndex]: optionIndex });
  };

  const markCourseCompleted = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !courseId) return;
    await supabase.from('course_completions').upsert(
      { user_id: user.id, course_id: courseId },
      { onConflict: 'user_id,course_id' }
    );
  };

  const handleSubmitQuiz = () => {
    if (!activeSection?.quiz || !Array.isArray(activeSection.quiz.questions)) return;

    const questions = activeSection.quiz.questions;
    let correctCount = 0;

    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const passed = finalScore >= (activeSection.quiz.passingScore || 70);

    setQuizResult({ passed, score: finalScore });

    if (passed) {
      const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
      if (currentIndex + 1 < sections.length) {
        const nextSectionId = sections[currentIndex + 1].id;
        if (!unlockedSections.includes(nextSectionId)) {
          setUnlockedSections([...unlockedSections, nextSectionId]);
        }
      } else {
        // هاد كان آخر فصل بالكورس، يعني المستخدم خلّص الكورس بالكامل
        markCourseCompleted();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans p-6" dir="rtl">
        <p className="text-slate-400 animate-pulse text-lg">جاري تحميل الكورس...</p>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans p-6" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-xl font-bold text-emerald-400">لا توجد دروس مضافة بعد! 🎓</h2>
          <p className="text-slate-400 text-sm">ادخل إلى لوحة الأدمن وأضف فصولاً وفيديوهات جديدة لتظهر لك هنا فوراً.</p>
        </div>
      </div>
    );
  }

  const currentQuiz = activeSection?.quiz;
  const questionsList = currentQuiz && Array.isArray(currentQuiz.questions) ? currentQuiz.questions : [];
  const currentQuestion = questionsList[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4">
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-slate-800">
              {activeVideoUrl ? (
                <iframe
                  src={formatYoutubeEmbedUrl(activeVideoUrl)}
                  title="شرح الدرس"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">اختر درساً لمشاهدته</div>
              )}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-emerald-400">{activeSection?.title}</h2>
              {questionsList.length > 0 && (
                <button
                  onClick={handleOpenQuiz}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all text-sm"
                >
                  📝 تقديم اختبار الفصل ({questionsList.length} أسئلة)
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">{courseTitle}</h3>
          {sections.map((sec) => {
            const isUnlocked = unlockedSections.includes(sec.id);
            const isActive = activeSectionId === sec.id;

            return (
              <div
                key={sec.id}
                className={`border rounded-2xl p-4 transition-all ${
                  isUnlocked
                    ? isActive ? 'bg-slate-900 border-emerald-500' : 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-sm text-slate-200">{sec.title}</h4>
                  <span>{isUnlocked ? '🔓' : '🔒'}</span>
                </div>

                {isUnlocked ? (
                  <div className="space-y-2 pr-2 border-r-2 border-emerald-500/40">
                    {sec.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveSectionId(sec.id);
                          if (lesson.videoUrl) setActiveVideoUrl(lesson.videoUrl);
                        }}
                        className="w-full text-right text-xs p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 flex justify-between items-center transition-all"
                      >
                        <span>🎥 {lesson.title}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-400/80 mt-1">
                    مغلق 🔒 (يتطلب اجتياز اختبار الفصل السابق بنسبة {sec.quiz?.passingScore || 70}%)
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {showQuizModal && currentQuiz && currentQuestion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-emerald-400">اختبار اجتياز الفصل</h3>
              <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-bold">
                السؤال {currentQIndex + 1} من {questionsList.length}
              </span>
            </div>

            {!quizResult ? (
              <>
                <p className="text-white font-medium text-base">{currentQuestion.question}</p>
                <div className="space-y-2">
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-right p-3 rounded-xl border text-sm transition-all ${
                        userAnswers[currentQIndex] === idx
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(currentQIndex - 1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl text-xs"
                  >
                    السابق
                  </button>

                  {currentQIndex < questionsList.length - 1 ? (
                    <button
                      disabled={userAnswers[currentQIndex] === undefined}
                      onClick={() => setCurrentQIndex(currentQIndex + 1)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 font-bold text-white rounded-xl text-xs"
                    >
                      التالي
                    </button>
                  ) : (
                    <button
                      disabled={Object.keys(userAnswers).length < questionsList.length}
                      onClick={handleSubmitQuiz}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs"
                    >
                      إنهاء وإرسال الاختبار
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                {quizResult.passed ? (
                  <>
                    <div className="text-5xl">🎉</div>
                    <h4 className="text-xl font-bold text-emerald-400">مبروك! لقد اجتزت الاختبار بنسبة {quizResult.score}%</h4>
                    <p className="text-xs text-slate-300">تم فتح الفصل التالي بنجاح ويمكنك الانتقال إليه الآن.</p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl">❌</div>
                    <h4 className="text-xl font-bold text-rose-500">للأسف، لم تتجاوز نسبة النجاح ({quizResult.score}%)</h4>
                    <p className="text-xs text-slate-300">النسبة المطلوبة هي {currentQuiz.passingScore}%. أعد مراجعة الدروس وحاول مجدداً.</p>
                  </>
                )}
                <button onClick={() => setShowQuizModal(false)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 font-bold text-white rounded-xl text-xs">إغلاق</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}