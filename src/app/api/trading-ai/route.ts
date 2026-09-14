import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'لم يتم إرسال أي سؤال' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'مفتاح Gemini غير موجود على السيرفر' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `أنت مساعد ذكي متخصص بالتداول والأسواق المالية (خصوصاً الذهب XAUUSD وشركات التمويل Prop Firms). أجب بشكل مختصر ومفيد وباللغة العربية على السؤال التالي:\n\n${message}`,
    });

    const replyText = response.text || 'لم يتم الحصول على رد، حاول مرة أخرى.';

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التواصل مع الذكاء الاصطناعي' },
      { status: 500 }
    );
  }
}
