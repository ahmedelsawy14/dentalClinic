import { memo, useMemo } from "react";
import { BookOpenText, CalendarDays, Clock3, PenSquare, SearchX, Trash2 } from "lucide-react";
import { calculateSeoScore, getSeoTone } from "../utils/seoHelpers";

function formatArticleDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function scoreClasses(scoreTone) {
  switch (scoreTone) {
    case "strong":
      return "border-[#6dd0a5]/30 bg-[#6dd0a5]/10 text-[#dcfff0]";
    case "good":
      return "border-[#8dc9ff]/30 bg-[#8dc9ff]/10 text-[#def0ff]";
    case "average":
      return "border-[#f3c76b]/30 bg-[#f3c76b]/10 text-[#fff1c8]";
    default:
      return "border-[#ef6b6b]/30 bg-[#ef6b6b]/10 text-[#ffd9d9]";
  }
}

function readinessCopy(score, status) {
  if (status === "draft") {
    return "مسودة بانتظار المراجعة";
  }

  if (score >= 85) {
    return "جاهز للظهور في البحث";
  }

  if (score >= 65) {
    return "جاهز للنشر";
  }

  return "يستفيد من مزيد من التفاصيل";
}

function ArticleSkeleton() {
  return (
    <div className="glass-card overflow-hidden rounded-[1.8rem] p-5">
      <div className="mt-4 h-6 animate-pulse rounded-full bg-white/10" />
      <div className="mt-3 h-10 w-32 animate-pulse rounded-full bg-white/8" />
      <div className="mt-4 h-28 animate-pulse rounded-[1.1rem] bg-white/8" />
    </div>
  );
}

function ArticlesTable({
  articles,
  loading,
  onDelete,
  onEdit,
  selectedSpecialty,
  specialtiesBySlug,
}) {
  const cards = useMemo(() => {
    return articles.map((article) => {
      const specialty = specialtiesBySlug[article.specialty];
      const score = calculateSeoScore(article, specialty?.title || "");
      const tone = getSeoTone(score);

      return { article, score, specialty, tone };
    });
  }, [articles, specialtiesBySlug]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ArticleSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div dir="rtl" className="glass-card rounded-[2rem] p-8 text-center text-white">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-[#d6bc6a]/24 bg-[#d6bc6a]/10 text-[#f1dc9c]">
          <SearchX size={26} />
        </span>
        <h3 className="mt-5 text-2xl font-bold">لا توجد مقالات مطابقة</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
          جرّب تعديل البحث أو أضف مقالًا جديدًا داخل هذا التخصص.
        </p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-4">
      {cards.map(({ article, score, specialty, tone }, index) => (
        <article
          key={article.id}
          className="glass-card glass-card-hover overflow-hidden rounded-[1.9rem] text-right text-white shadow-[0_18px_45px_rgba(0,0,0,0.2)]"
        >
          <div
            className="p-5 md:p-6"
            style={{
              backgroundImage: specialty?.coverImage
                ? `linear-gradient(180deg, rgba(7,17,31,0.82), rgba(7,17,31,0.95)), url(${specialty.coverImage})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#d6bc6a]/22 bg-[#d6bc6a]/10 px-3 py-1 text-xs font-semibold text-[#f3df9b]">
                  {selectedSpecialty ? `المقال ${index + 1}` : specialty?.title || article.specialty}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${scoreClasses(tone)}`}>
                  {article.status === "draft" ? "مسودة" : "منشور"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-200">
                  {readinessCopy(score, article.status)}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold leading-snug">{article.title}</h3>
              <p className="mt-3 text-sm leading-8 text-slate-300">{article.excerpt}</p>
            </div>

            <div className="mt-5 grid gap-4 border-t border-white/10 pt-4 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <p className="inline-flex items-center gap-2">
                  <CalendarDays size={15} />
                  {formatArticleDate(article.createdAt)}
                </p>
                <p className="inline-flex items-center gap-2">
                  <BookOpenText size={15} />
                  {specialty?.title || article.specialty}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Clock3 size={15} />
                  {article.readingTime?.label}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(article)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#8dc9ff]/24 bg-[#8dc9ff]/10 px-4 py-2 text-sm font-semibold text-[#def0ff] hover:-translate-y-0.5"
                >
                  <PenSquare size={15} />
                  تعديل
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(article)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ef6b6b]/26 bg-[#ef6b6b]/10 px-4 py-2 text-sm font-semibold text-[#ffd8d8] hover:-translate-y-0.5"
                >
                  <Trash2 size={15} />
                  حذف
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default memo(ArticlesTable);
