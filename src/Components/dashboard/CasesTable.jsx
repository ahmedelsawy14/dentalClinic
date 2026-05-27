import { memo } from "react";
import { CalendarDays, ImageOff, PenSquare, Trash2 } from "lucide-react";

function formatCaseDate(dateValue) {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
}

const CaseCard = memo(function CaseCard({ caseItem, onDelete, onEdit }) {
  return (
    <article
      className="glass-card overflow-hidden rounded-[1.2rem] text-right text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
      dir="rtl"
    >
      <div className="space-y-2 p-2.5">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="overflow-hidden rounded-[0.85rem] border border-white/10 bg-[#081423]/78">
            <div className="aspect-[1/1] overflow-hidden">
              <img src={caseItem.beforeImage} alt={`صورة قبل للحالة ${caseItem.title}`} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="border-t border-white/10 px-3 py-1.5 text-[11px] font-semibold text-slate-200 md:text-xs">قبل</div>
          </div>

          <div className="overflow-hidden rounded-[0.85rem] border border-white/10 bg-[#081423]/78">
            <div className="aspect-[1/1] overflow-hidden">
              <img src={caseItem.afterImage} alt={`صورة بعد للحالة ${caseItem.title}`} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="border-t border-white/10 px-3 py-1.5 text-[11px] font-semibold text-slate-200 md:text-xs">بعد</div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-[#d6bc6a]/22 bg-[#d6bc6a]/10 px-2.5 py-1 text-[11px] font-semibold text-[#f3df9b]">
              حالة محفوظة
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] text-slate-100">
              <CalendarDays size={11} />
              {formatCaseDate(caseItem.createdAt)}
            </span>
          </div>

          <h3 className="mt-1.5 text-sm font-bold text-white md:text-base">{caseItem.title}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-white/10 pt-2">
          <button
            type="button"
            onClick={() => onEdit(caseItem)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#8dc9ff]/24 bg-[#8dc9ff]/10 px-3 py-1.5 text-[11px] font-semibold text-[#def0ff] md:text-xs"
          >
            <PenSquare size={13} />
            تعديل
          </button>
          <button
            type="button"
            onClick={() => onDelete(caseItem)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ef6b6b]/26 bg-[#ef6b6b]/10 px-3 py-1.5 text-[11px] font-semibold text-[#ffd8d8] md:text-xs"
          >
            <Trash2 size={13} />
            حذف الحالة
          </button>
        </div>
      </div>
    </article>
  );
});

function CasesTable({ cases, loading, onDelete, onEdit }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="glass-card rounded-[1.8rem] p-5">
            <div className="h-8 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="mt-4 h-64 animate-pulse rounded-[1.4rem] bg-white/8" />
          </div>
        ))}
      </div>
    );
  }

  if (!cases.length) {
    return (
      <div className="glass-card rounded-[2rem] p-8 text-center text-white md:p-10" dir="rtl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-[#d6bc6a]/20 bg-[#d6bc6a]/10 text-[#eedda3]">
          <ImageOff size={26} />
        </div>
        <h3 className="mt-5 text-2xl font-bold">لا توجد حالات مطابقة</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
          أضف أول حالة الآن وستظهر هنا مباشرة ثم تنتقل تلقائيًا إلى صفحة الجاليري العامة.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5" dir="rtl">
      <div className="text-right text-white">
        <p className="text-sm font-semibold tracking-[0.24em] text-[#d6bc6a]">مكتبة الحالات</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">حالات قبل وبعد المحفوظة</h2>
      </div>

      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cases.map((caseItem) => (
          <CaseCard key={caseItem.id} caseItem={caseItem} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}

export default memo(CasesTable);
