import { Link } from "react-router-dom";

function ErrorFallback({
  title = "حدثت مشكلة غير متوقعة",
  description = "تعذر عرض هذا الجزء حاليًا. حاول تحديث الصفحة أو الرجوع خطوة للخلف.",
  compact = false,
  onRetry = null,
}) {
  return (
    <section
      dir="rtl"
      className={`glass-card rounded-[2rem] text-right text-white shadow-[0_24px_70px_rgba(0,0,0,0.24)] ${
        compact ? "p-5 md:p-6" : "p-8 md:p-10"
      }`}
    >
      <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">حالة عرض بديلة</p>
      <h2 className="mt-3 text-2xl font-bold md:text-3xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{description}</p>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="theme-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
          >
            إعادة المحاولة
          </button>
        ) : null}
        <Link
          to="/"
          className="theme-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          العودة للرئيسية
        </Link>
      </div>
    </section>
  );
}

export default ErrorFallback;
