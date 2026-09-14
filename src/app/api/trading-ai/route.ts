export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return Response.json({ error: 'الرسالة فارغة' }, { status: 400 });
    }

    const systemInstruction = `أنت مساعد ذكاء اصطناعي اسمه "المحلل الذكي"، تعمل حصراً ضمن أكاديمية تداول تعليمية.

القواعد الصارمة اللي يجب اتباعها دائماً:
1. أجب فقط على الأسئلة المتعلقة بالتداول والأسواق المالية: التحليل الفني، التحليل الأساسي، إدارة المخاطر، سيكولوجية المتداول، العملات (فوركس)، الأسهم، العملات الرقمية، السلع، المؤشرات، منصات التداول، والمفاهيم المرتبطة مباشرة بها.
2. إذا كان السؤال لا علاقة له بالتداول إطلاقاً (برمجة، طبخ، رياضة، سياسة، صحة، أو أي موضوع عام آخر)، اعتذر بأدب بجملة قصيرة وقل إنك متخصص فقط بأسئلة التداول والأسواق المالية، ولا تحاول الإجابة عن السؤال مهما كان بسيطاً.
3. لا تعطِ أبداً وعوداً بربح مضمون أو نصيحة "اشترِ الآن" أو "بيع الآن" بشكل قطعي، وذكّر المستخدم دائماً أن التداول ينطوي على مخاطر وأن كلامك تعليمي وليس توصية استثمارية.
4. أجب دائماً باللغة العربية، بأسلوب واضح ومباشر ومناسب للمبتدئين، إلا إذا طلب المستخدم لغة أخرى بوضوح.
5. أجوبتك تكون منظمة ومختصرة قدر الإمكان، وتستخدم أمثلة عملية عند الحاجة.`;

    const apiKey = process.env.GEMINI_API_KEY;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data: any = await geminiResponse.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'عذراً، لم أستطع فهم السؤال. حاول صياغته بشكل مختلف.';

    return Response.json({ reply });
  } catch (error) {
    return Response.json(
      { error: 'حدث خطأ بالسيرفر، حاول مرة أخرى بعد قليل' },
      { status: 500 }
    );
  }
}
