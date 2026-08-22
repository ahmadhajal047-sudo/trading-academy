import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMsg = messages[messages.length - 1]?.content || '';
    const text = lastMsg.toLowerCase();

    // 1. معالجة حسابات الذهب الرياضية (حساب الأرباح واللوت تلقائياً)
    const numbers = lastMsg.match(/\d+(\.\d+)?/g)?.map(Number) || [];
    
    if ((text.includes('ذهب') || text.includes('xau') || text.includes('شراء') || text.includes('بيع')) && numbers.length >= 3) {
      // استخراج المعطيات (اللوت، سعر الدخول، سعر الخروج)
      let lot = numbers.find(n => n < 10) || 0.1;
      let prices = numbers.filter(n => n >= 100).sort((a, b) => a - b);
      
      if (prices.length >= 2) {
        const entry = prices[0];
        const exit = prices[1];
        const diff = exit - entry; // فارق السعر بالدولار
        
        // حساب الربح للذهب: (الفارق بالدولار) × (حجم اللوت × 100)
        const profit = diff * (lot * 100);
        const pips = diff * 10;

        const responseText = `
**تحليل وحساب الصفقة بدقة:**

* **نوع الأداة:** الذهب (XAUUSD)
* **حجم اللوت (Lot Size):** ${lot}
* **سعر الدخول:** $${entry}
* **سعر الخروج:** $${exit}
* **فارق الحركة:** $${diff.toFixed(2)} (${pips.toFixed(0)} نقطة / Pips)

---

**النتيجة المالية:**
* **صافي الربح المتوقع:** **$${profit.toFixed(2)}**

*(ملاحظة: لوت 1.0 قياسي في الذهب يعادل $100 لكل $1 تحرك في السعر، ولوت ${lot} يعادل $${(lot * 100).toFixed(0)} لكل $1 تحرك).*
        `.trim();

        return NextResponse.json({ reply: responseText });
      }
    }

    // 2. معالجة أسئلة شركات التمويل (Prop Firms)
    if (text.includes('حساب') || text.includes('ممول') || text.includes('اختبار') || text.includes('ftmo') || text.includes('prop')) {
      const propPlan = `
**خطة التعامل مع حسابات الشركات الممولة (Prop Firms):**

* **إدارة المخاطر:**
  * المخاطرة في الصفقة الواحدة: **0.5% إلى 1%** من رأس المال كحد أقصى.
  * الحد الأقصى للخسارة اليومية (Daily Drawdown): عادة **5%**.
  * الحد الأقصى للتراجع الكلي (Max Drawdown): عادة **10%**.

* **أهداف الأرباح (Profit Targets):**
  * المرحلة الأولى: **8% - 10%**.
  * المرحلة الثانية: **5%**.

* **نصيحة التنفيذ:** ركز على إدارة حجم اللوت والتوقف فور خسارة صفقتين متتاليتين لحماية الحساب.
      `.trim();
      return NextResponse.json({ reply: propPlan });
    }

    // 3. معالجة أسئلة إدارة المخاطر واللوت العامة
    if (text.includes('لوت') || text.includes('مخاطر') || text.includes('راس المال') || text.includes('رأس المال')) {
      const riskPlan = `
**قواعد إدارة رأس المال وحساب اللوت:**

* **حساب $100:** أقصى حجم لوت هو **0.01** (المخاطرة بـ $2 إلى $3 لكل صفقة).
* **حساب $1,000:** حجم اللوت المناسب هو **0.03 إلى 0.05** (المخاطرة بـ $10 إلى $20 لكل صفقة).
* **حساب $10,000:** حجم اللوت المناسب هو **0.20 إلى 0.50** حسب نسبة الاستوب لوز (Stop Loss).

**القاعدة الذهبية:** لا تخاطر بأكثر من 1% إلى 2% من إجمالي حسابك في أي صفقة منفردة.
      `.trim();
      return NextResponse.json({ reply: riskPlan });
    }

    // 4. الرد المباشر الشامل لأي سؤال عام آخر
    const defaultResponse = `
أهلاً بك! أنا مساعد التداول الذكي الخاص بك.

يمكنك طرح أي سؤال محدد وسيتم حسابه وإجابتك فوراً:
1. **حساب الأرباح والخسائر:** (مثال: دخلت شراء ذهب بلوت 0.2 من 2300 لـ 2310 كم أربح؟)
2. **إدارة اللوت ورأس المال:** (مثال: كيف أحسب اللوت المناسب لحساب 500$؟)
3. **شركات التمويل:** (شروط وقوانين FTMO و FundingTraders).
    `.trim();

    return NextResponse.json({ reply: defaultResponse });

  } catch (error: any) {
    return NextResponse.json(
      { reply: 'حدث خطأ في النظام الداخلي، يرجى كتابة سؤالك مرة أخرى.' },
      { status: 500 }
    );
  }
}