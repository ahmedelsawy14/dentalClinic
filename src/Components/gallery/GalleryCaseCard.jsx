import { memo } from "react";

function GalleryCaseCard({ caseItem }) {
  return (
    <article
      dir="rtl"
      className="glass-card overflow-hidden rounded-[2rem] text-right text-white shadow-[0_20px_46px_rgba(0,0,0,0.18)]"
    >
      <div className="grid gap-0 border-b border-white/10 sm:grid-cols-2">
        <div className="overflow-hidden border-b border-white/10 sm:border-b-0 sm:border-l sm:border-white/10">
          <div className="aspect-[4/3] overflow-hidden bg-[#081423]">
            <img
              src={caseItem.beforeImage}
              alt={`صورة قبل للحالة ${caseItem.title}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="px-4 py-3 text-sm font-semibold text-slate-200">قبل</div>
        </div>

        <div className="overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden bg-[#081423]">
            <img
              src={caseItem.afterImage}
              alt={`صورة بعد للحالة ${caseItem.title}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="px-4 py-3 text-sm font-semibold text-slate-200">بعد</div>
        </div>
      </div>

      <div className="space-y-3 p-5 md:p-6">
        <span className="inline-flex rounded-full border border-[#d6bc6a]/22 bg-[#d6bc6a]/10 px-3 py-1 text-xs font-semibold text-[#f3df9b]">
          حالة من داخل العيادة
        </span>
        <h3 className="text-2xl font-bold text-white">{caseItem.title}</h3>
        <p className="text-sm leading-8 text-slate-300 md:text-base">{caseItem.description}</p>
      </div>
    </article>
  );
}

export default memo(GalleryCaseCard);
