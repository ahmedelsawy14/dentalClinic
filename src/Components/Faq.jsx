import { memo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";

const faqs = [
  {
    question: "ما فائدة علاج العصب باستخدام الميكروسكوب؟",
    answer:
      "الميكروسكوب يتيح للطبيب رؤية القنوات الدقيقة بوضوح أعلى، مما يساعد على تنظيفها بدقة أكبر ورفع نسبة نجاح العلاج خاصة في الحالات المعقدة.",
  },
  {
    question: "هل إجراءات تجميل الأسنان تسبب ألمًا؟",
    answer:
      "غالبًا لا، لأن الإجراءات تتم بأحدث التقنيات مع تخدير مناسب وتجهيز جيد يضمن راحة المريض طوال الجلسة.",
  },
  {
    question: "كم تستغرق زراعة الأسنان؟",
    answer:
      "المدة تختلف حسب الحالة، لكن الإجراء نفسه غالبًا يتم وفق خطة واضحة تضمن الراحة وسرعة العودة للحياة الطبيعية.",
  },
  {
    question: "هل الحشوات التجميلية تدوم طويلًا؟",
    answer:
      "نعم، عند استخدام خامات عالية الجودة مع العناية اليومية والمتابعة المنتظمة يمكن أن تدوم لفترات طويلة جدًا.",
  },
  {
    question: "هل يتوفر نظام تقسيط للخدمات الكبيرة؟",
    answer:
      "يمكن مناقشة تفاصيل السداد حسب الخطة العلاجية والحالة للوصول إلى الخيار الأنسب للمريض.",
  },
  {
    question: "كيف يتم ضمان التعقيم داخل العيادة؟",
    answer:
      "نلتزم ببروتوكولات تعقيم صارمة وباستخدام أجهزة حديثة للحفاظ على أعلى درجات الأمان والسلامة داخل العيادة.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section dir="rtl" className="section-shell bg-[#07111f]">
      <div className="section-container">
        <Reveal className="mb-12 max-w-3xl text-right">
          <span className="theme-pill rounded-full px-4 py-2 text-sm font-medium">
            الأسئلة الشائعة
          </span>
          <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">
            إجابات سريعة تقلل التردد قبل الحجز
          </h2>
          <p className="mt-5 text-sm leading-8 text-slate-300 md:text-base">
            جمعنا أكثر الأسئلة التي تدور في ذهن المريض قبل الحجز حتى تكون الصورة أوضح ويشعر
            بالثقة والاطمئنان.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal delay={60} className="glass-card rounded-[2rem] p-7 text-white shadow-[0_20px_48px_rgba(0,0,0,0.18)] md:p-8">
            <h3 className="text-2xl font-bold text-[#f4e4a0]">نحب أن تكون الصورة واضحة</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300">
              هذا القسم ليس مجرد محتوى إضافي، بل جزء مهم من تجربة المريض لأنه يقلل القلق
              ويسهّل قرار التواصل.
            </p>
            <div className="mt-7 space-y-3">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm">
                شرح مبسط وواضح
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm">
                أسلوب مريح ومطمئن
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm">
                تمهيد جيد قبل الحجز
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <Reveal key={faq.question} delay={index * 40}>
                  <div
                    className={`rounded-[1.7rem] border p-5 text-white shadow-[0_14px_32px_rgba(0,0,0,0.1)] transition-colors ${
                      isOpen ? "border-[#d6bc6a]/34 bg-white/[0.06]" : "border-white/10 bg-white/[0.035]"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex w-full flex-row-reverse items-center justify-between gap-4 text-right"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform ${
                          isOpen ? "bg-[#d6bc6a] text-[#091729]" : "bg-[#d6bc6a]/10 text-[#f4e4a0]"
                        }`}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </div>

                      <h3 className="flex-1 text-base font-semibold leading-7 text-white">
                        {faq.question}
                      </h3>
                    </button>

                    {isOpen ? (
                      <p className="pt-4 text-right text-sm leading-8 text-slate-300">
                        {faq.answer}
                      </p>
                    ) : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Faq);
