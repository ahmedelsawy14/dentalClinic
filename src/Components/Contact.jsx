import { memo, useState } from "react";
import { MessageCircleMore, Phone, Send, UserRound } from "lucide-react";
import { siteConfig } from "../config/site";
import Reveal from "./Reveal";

function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !message.trim()) {
      alert("من فضلك املأ كل البيانات قبل الإرسال");
      return;
    }

    const text = encodeURIComponent(`الاسم: ${name}
رقم الهاتف: ${phone}
الرسالة: ${message}`);

    const whatsappURL = `https://wa.me/${siteConfig.phoneDigits}?text=${text}`;
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  const labelClass =
    "mb-3 flex items-center justify-end gap-2 text-base font-bold text-white md:text-[1.08rem]";
  const fieldClass =
    "h-15 w-full rounded-[1.55rem] border border-white/10 bg-[#21344d] px-5 text-right text-white outline-none transition-transform transition-colors placeholder:text-[#8f9ab0] focus:border-[#d6bc6a]/55 focus:bg-[#243a56]";
  const textareaClass =
    "min-h-[9.75rem] w-full resize-none rounded-[1.55rem] border border-white/10 bg-[#21344d] p-5 text-right text-white outline-none transition-transform transition-colors placeholder:text-[#8f9ab0] focus:border-[#d6bc6a]/55 focus:bg-[#243a56]";

  return (
    <section dir="rtl" className="section-shell section-shell-no-divider bg-[#07111f]">
      <div className="section-container grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
        <Reveal
          className="glass-card rounded-[2rem] p-8 text-white shadow-[0_24px_56px_rgba(0,0,0,0.18)] md:p-9"
        >
          <span className="theme-pill rounded-full px-4 py-2 text-sm">تواصل مباشر وسريع</span>
          <h2 className="mt-5 max-w-2xl text-right text-3xl font-bold leading-tight md:text-4xl">
            احجز استشارتك الآن بسهولة
          </h2>
          <p className="mt-5 max-w-[32rem] text-right text-sm leading-8 text-slate-300 md:text-base">
            إذا كان لديك استفسار أو تريد ترتيب موعد، اترك بياناتك وسنتواصل معك سريعًا لتنسيق
            الخطوة المناسبة.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-4 py-4.5">
              <p className="text-xs text-[#f3e7b0]">رقم التواصل</p>
              <p className="mt-1 text-sm">{siteConfig.phoneDisplay}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-4 py-4.5">
              <p className="text-xs text-[#f3e7b0]">العنوان</p>
              <p className="mt-1 text-sm leading-7">{siteConfig.address}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-4 py-4.5">
              <p className="text-xs text-[#f3e7b0]">وعد التجربة</p>
              <p className="mt-1 text-sm">رد سريع وتنظيم أوضح للحجز والاستفسار.</p>
            </div>
          </div>
        </Reveal>

        <Reveal
          as="form"
          onSubmit={handleSubmit}
          delay={70}
          className="glass-card rounded-[2rem] p-7 text-white shadow-[0_24px_56px_rgba(0,0,0,0.18)] md:p-8"
        >
          <div className="mb-6 text-right">
            <p className="text-sm font-semibold text-[#d6bc6a]">أرسل بياناتك</p>
            <h3 className="mt-2 text-2xl font-bold text-white">سنتواصل معك في أقرب وقت</h3>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col text-right">
              <label className={labelClass}>
                <span>الاسم</span>
                <UserRound size={18} className="text-[#d6bc6a]" />
              </label>
              <input
                type="text"
                placeholder="اكتب اسمك"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col text-right">
              <label className={labelClass}>
                <span>الهاتف</span>
                <Phone size={18} className="text-[#d6bc6a]" />
              </label>
              <input
                type="tel"
                placeholder="01xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col text-right">
              <label className={labelClass}>
                <span>رسالتك</span>
                <Send size={18} className="text-[#d6bc6a]" />
              </label>
              <textarea
                placeholder="اكتب أي تفاصيل إضافية أو الوقت المناسب للتواصل"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={textareaClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!name || !phone || !message}
            className={`mt-7 inline-flex h-15 w-full items-center justify-center gap-2 rounded-full px-6 text-base font-bold transition-transform transition-colors ${
              !name || !phone || !message
                ? "cursor-not-allowed bg-white/10 text-slate-500"
                : "bg-[#c2a241] text-white shadow-[0_16px_34px_rgba(194,162,65,0.18)] hover:-translate-y-0.5 hover:bg-[#b79736]"
            }`}
          >
            <MessageCircleMore size={18} />
            إرسال الطلب عبر واتساب
          </button>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(Contact);
