import React, { useState } from "react";
import {
  CalendarDays,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Seo from "../Components/Seo";
import { siteConfig } from "../config/site";

function ReservationPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const openWhatsApp = (text) => {
    const whatsappUrl = `https://wa.me/${siteConfig.phoneDigits}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setStatus({
        type: "error",
        message: "يرجى إدخال الاسم ورقم الهاتف ونص الاستفسار.",
      });
      return;
    }

    const messageText = `الاسم: ${name}\nرقم الهاتف: ${phone}\nالاستفسار: ${message}`;
    openWhatsApp(messageText);
    setName("");
    setPhone("");
    setMessage("");
  };

  const socialLinks = [
    { icon: Facebook, link: siteConfig.facebookUrl, label: "Facebook" },
    { icon: Instagram, link: siteConfig.instagramUrl, label: "Instagram" },
  ];

  const quickPoints = [
    {
      icon: CalendarDays,
      title: "تنسيق سريع",
      text: "نراجع طلبك سريعًا ونرتب أنسب موعد للتواصل.",
    },
    {
      icon: ShieldCheck,
      title: "اهتمام واضح",
      text: "نوضح الحالة الأولية والخطوة التالية بشكل مباشر.",
    },
    {
      icon: MapPin,
      title: "وصول أسهل",
      text: "الموقع والخطوات الأساسية أمامك في نفس الصفحة.",
    },
  ];

  const labelClass =
    "mb-3 flex items-center justify-end gap-2 text-base font-bold text-white md:text-[1.08rem]";
  const fieldClass =
    "h-15 w-full rounded-[1.55rem] border border-white/10 bg-[#21344d] px-5 text-right text-white outline-none transition-transform transition-colors placeholder:text-[#8f9ab0] focus:border-[#d6bc6a]/55 focus:bg-[#243a56]";
  const textareaClass =
    "min-h-[9.75rem] w-full resize-none rounded-[1.55rem] border border-white/10 bg-[#21344d] p-5 text-right text-white outline-none transition-transform transition-colors placeholder:text-[#8f9ab0] focus:border-[#d6bc6a]/55 focus:bg-[#243a56]";

  return (
    <>
      <Seo
        title={`احجز الآن | ${siteConfig.siteName}`}
        description="احجز استشارتك أو تواصل مع عيادة د. حازم سلطان بسهولة عبر واتساب وبيانات التواصل المباشرة."
        url={typeof window !== "undefined" ? `${window.location.origin}/reservation` : "/reservation"}
      />
      <main
        dir="rtl"
        className="relative overflow-hidden bg-[#07111f] px-6 pb-16 pt-28 md:px-10 md:pt-32 lg:px-16 lg:pb-20"
      >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,188,106,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(30,64,111,0.35),transparent_34%),linear-gradient(180deg,#07111f_0%,#091729_52%,#0b1d33_100%)]" />
      <div className="absolute right-[8%] top-16 h-64 w-64 rounded-full bg-[#d6bc6a]/12 blur-3xl" />
      <div className="absolute left-[5%] top-44 h-72 w-72 rounded-full bg-[#173a60]/18 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-10">
        <section className="overflow-hidden rounded-[2.3rem] border border-[#d8c897]/18 bg-[linear-gradient(135deg,#071425_0%,#0e2744_55%,#17395f_100%)] text-white shadow-[0_32px_90px_rgba(7,20,37,0.18)]">
          <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-stretch xl:gap-10 xl:p-10">
            <div className="flex flex-col justify-between rounded-[2rem] border border-white/8 bg-white/[0.03] p-7 backdrop-blur md:p-8">
              <div className="space-y-5 text-right">
                <span className="inline-flex rounded-full border border-[#d8c897]/20 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-[#f2dfa2]">
                  احجز الآن
                </span>

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                    ابدأ خطوتك
                    <span className="text-[#e3c86f]"> بثقة وهدوء </span>
                    <br />
                    نحو ابتسامة أجمل
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
                    في {siteConfig.siteName} نهتم بأن تكون بداية تواصلك واضحة ومريحة، لذلك
                    جمعنا لك الحجز السريع وبيانات التواصل والموقع في صفحة واحدة بنفس اللغة
                    البصرية لباقي الموقع.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {quickPoints.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-[1.5rem] border border-[#d8c897]/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 text-right backdrop-blur"
                      >
                        <div className="mb-3 flex justify-end text-[#e3c86f]">
                          <Icon size={19} />
                        </div>
                        <h2 className="text-sm font-bold text-white md:text-base">{item.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-300">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-[#d8c897]/16 bg-[linear-gradient(180deg,rgba(183,154,68,0.1),rgba(255,255,255,0.03))] p-5">
                <div className="flex flex-col gap-4 text-right md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-end gap-3 text-sm text-slate-100 md:text-base">
                      <span dir="ltr" className="font-semibold text-white">
                        {siteConfig.phoneDisplay}
                      </span>
                      <Phone size={18} className="text-[#f2dfa2]" />
                    </div>
                    <div className="flex items-center justify-end gap-3 text-sm text-slate-100 md:text-base">
                      <span dir="ltr" className="font-semibold text-white">
                        {siteConfig.email}
                      </span>
                      <Mail size={18} className="text-[#f2dfa2]" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    {socialLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.label}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c897]/16 bg-white/[0.06] text-[#f4e3ab] transition hover:-translate-y-0.5 hover:bg-[#b79a44] hover:text-white"
                        >
                          <Icon size={17} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-[#d8c897]/18 bg-white/[0.06] p-7 text-right text-white shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-sm md:p-8"
            >
              <div className="space-y-3">
                <p className="text-sm font-semibold tracking-[0.2em] text-[#f0d98e]">
                  نموذج الحجز
                </p>
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  اترك بياناتك وسنتواصل معك
                </h2>
                <p className="text-sm leading-7 text-slate-300 md:text-base">
                  اكتب اسمك ورقمك واستفسارك، وسيتم تجهيز رسالة واتساب مباشرة بشكل منظم
                  وواضح.
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="flex flex-col text-right">
                  <span className={labelClass}>
                    <span>الاسم</span>
                    <UserRound size={18} className="text-[#d6bc6a]" />
                  </span>
                  <input
                    type="text"
                    placeholder="اكتب اسمك"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="flex flex-col text-right">
                  <span className={labelClass}>
                    <span>الهاتف</span>
                    <Phone size={18} className="text-[#d6bc6a]" />
                  </span>
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>

              <label className="mt-5 flex flex-col text-right">
                <span className={labelClass}>
                  <span>رسالتك</span>
                  <Send size={18} className="text-[#d6bc6a]" />
                </span>
                <textarea
                  placeholder="اكتب أي تفاصيل إضافية أو الوقت المناسب للتواصل"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={textareaClass}
                  required
                />
              </label>

              <div className="mt-5 rounded-[1.4rem] border border-[#d8c897]/18 bg-[#0c1c33] p-4 text-sm leading-7 text-slate-300">
                نرتب تواصلك مع العيادة بأسرع صورة ممكنة، مع الحفاظ على نفس أسلوب الموقع
                الهادئ والواضح.
              </div>

              <button
                type="submit"
                disabled={!name || !phone || !message}
                className={`mt-6 inline-flex h-15 w-full items-center justify-center gap-2 rounded-full text-base font-bold transition-transform transition-colors ${
                  !name || !phone || !message
                    ? "cursor-not-allowed bg-white/10 text-slate-500"
                    : "bg-[#c2a241] text-white shadow-[0_18px_40px_rgba(194,162,65,0.22)] hover:-translate-y-0.5 hover:bg-[#b79736]"
                }`}
              >
                <MessageCircleMore size={18} />
                إرسال عبر واتساب
              </button>

              {status && (
                <p
                  className={`mt-4 rounded-2xl p-4 text-sm ${
                    status.type === "success"
                      ? "bg-emerald-500/12 text-emerald-200"
                      : "bg-rose-500/12 text-rose-200"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-[#d8c897]/16 bg-white/[0.05] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-sm">
          <div className="rounded-[1.5rem] border border-[#d8c897]/18 bg-[#0b1d33] p-4">
            <div className="mb-4 flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-[#f0d98e]">
                  موقع العيادة
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">سهولة الوصول</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                الخريطة موجودة هنا لتسهيل الوصول بعد التنسيق، مع نفس الواجهة الهادئة
                والمريحة بصريًا.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.4rem] border border-[#d8c897]/18">
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                aria-label="فتح موقع العيادة على خرائط جوجل"
              >
                <iframe
                  title="location"
                  src={siteConfig.mapEmbedUrl}
                  className="h-80 w-full border-0 md:h-[24rem]"
                  loading="eager"
                ></iframe>
                <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-end">
                  <span className="rounded-full border border-[#d8c897]/18 bg-[#07111f]/82 px-4 py-2 text-sm font-semibold text-[#f2dfa2] shadow-[0_14px_28px_rgba(0,0,0,0.18)] transition group-hover:-translate-y-0.5 group-hover:bg-[#0d223c]">
                    افتح الموقع على الخريطة
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </div>
      </main>
    </>
  );
}

export default ReservationPage;
