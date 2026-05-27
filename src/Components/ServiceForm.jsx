import { useState } from "react";
import { MessageCircleMore, Phone, Send, UserRound } from "lucide-react";
import { buildWhatsAppUrl } from "../utils/whatsapp";

const initialValues = {
  name: "",
  phone: "",
  message: "",
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "من فضلك اكتب الاسم.";
  }

  const digits = values.phone.replace(/[^\d]/g, "");
  if (!digits) {
    errors.phone = "من فضلك اكتب رقم الهاتف.";
  } else if (digits.length < 10) {
    errors.phone = "رقم الهاتف غير مكتمل.";
  }

  if (values.message.trim().length > 320) {
    errors.message = "الرسالة طويلة جدًا. حاول اختصارها.";
  }

  return errors;
}

function ServiceForm({ service, className = "" }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const whatsappUrl = buildWhatsAppUrl({
    phone: service.contact.whatsapp || service.contact.phone,
    serviceTitle: service.title,
    name: values.name.trim(),
    customerPhone: values.phone.trim(),
    message: values.message.trim(),
  });

  const handleChange = (field) => (event) => {
    const nextValues = { ...values, [field]: event.target.value };
    setValues(nextValues);

    if (errors[field]) {
      setErrors(validate(nextValues));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setValues(initialValues);
    setErrors({});
  };

  const labelClass =
    "mb-3 flex items-center justify-end gap-2 text-base font-bold text-white md:text-[1.08rem]";
  const fieldClass =
    "w-full rounded-[1.55rem] border border-white/10 bg-[#21344d] px-5 py-4 text-right text-white outline-none transition-transform transition-colors placeholder:text-[#8f9ab0] focus:border-[#d6bc6a]/55 focus:bg-[#243a56]";

  return (
    <div
      className={`xl:-mt-1 rounded-[1.8rem] border border-[#d7c48a]/20 bg-[linear-gradient(180deg,rgba(11,28,49,0.96),rgba(13,32,56,0.92))] p-5 text-white shadow-[0_18px_45px_rgba(8,27,52,0.22)] backdrop-blur md:p-6 ${className}`}
    >
      <div className="flex items-center gap-3 text-white">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b79a44] text-white shadow-[0_10px_30px_rgba(183,154,68,0.28)]">
          <MessageCircleMore size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#e5cc85]">{service.hero.ctaLabel}</p>
          <h2 className="text-xl font-bold md:text-[1.7rem]">احجز عبر واتساب في دقائق</h2>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
        اترك بياناتك وسنجهز رسالة الحجز تلقائيًا باسم الخدمة لتصل لفريق العيادة بشكل
        واضح وسريع.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#e5cc85]">الهاتف</p>
          <p
            dir="ltr"
            className="mt-2 text-left text-sm font-semibold text-white md:text-base"
            style={{ unicodeBidi: "plaintext" }}
          >
            {service.contact.phone}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#e5cc85]">البريد</p>
          <p className="mt-2 text-sm font-semibold text-white md:text-base">
            {service.contact.email}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
        <label className="block text-right">
          <span className={labelClass}>
            <span>الاسم</span>
            <UserRound size={18} className="text-[#d6bc6a]" />
          </span>
          <input
            type="text"
            value={values.name}
            onChange={handleChange("name")}
            placeholder="اكتب اسمك"
            className={fieldClass}
          />
          {errors.name ? <p className="mt-2 text-sm text-rose-300">{errors.name}</p> : null}
        </label>

        <label className="block text-right">
          <span className={labelClass}>
            <span>الهاتف</span>
            <Phone size={18} className="text-[#d6bc6a]" />
          </span>
          <input
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={handleChange("phone")}
            placeholder="01xxxxxxxxx"
            className={fieldClass}
          />
          {errors.phone ? <p className="mt-2 text-sm text-rose-300">{errors.phone}</p> : null}
        </label>

        <label className="block text-right">
          <span className={labelClass}>
            <span>رسالتك</span>
            <Send size={18} className="text-[#d6bc6a]" />
          </span>
          <textarea
            rows="4"
            value={values.message}
            onChange={handleChange("message")}
            placeholder="اكتب أي تفاصيل إضافية أو الوقت المناسب للتواصل"
            className={`${fieldClass} min-h-[9.75rem] resize-none`}
          />
          {errors.message ? <p className="mt-2 text-sm text-rose-300">{errors.message}</p> : null}
        </label>

        <button
          type="submit"
          className="inline-flex h-15 w-full items-center justify-center gap-2 rounded-full bg-[#c2a241] px-6 text-base font-bold text-white shadow-[0_18px_40px_rgba(194,162,65,0.22)] transition-transform transition-colors hover:-translate-y-0.5 hover:bg-[#b79736] focus:outline-none focus:ring-4 focus:ring-[#b79a44]/20"
        >
          <MessageCircleMore size={18} />
          إرسال الطلب عبر واتساب
        </button>
      </form>
    </div>
  );
}

export default ServiceForm;
