import { memo } from "react";
import { CalendarDays, Clock3 } from "lucide-react";

function formatArticleDate(value) {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function ArticleCard({ article, specialty, articleNumber }) {
  const paragraphs = article.content
    .split(/\n+/)
    .filter(Boolean);

  return (
    <article
      dir="rtl"
      className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] text-right text-white shadow-[0_20px_52px_rgba(0,0,0,0.16)]"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d6bc6a]/36 to-transparent" />

      <div
        className="relative overflow-hidden px-6 pb-5 pt-6 md:px-8 md:pb-6 md:pt-7"
        style={{
          backgroundImage: specialty?.coverImage
            ? `linear-gradient(180deg, rgba(7,17,31,0.88), rgba(7,17,31,0.95)), url(${specialty.coverImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,188,106,0.12),transparent_30%)]" />

        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="rounded-full border border-[#d6bc6a]/22 bg-[#d6bc6a]/10 px-3 py-1 text-[#f0dc99]">
              المقال {articleNumber}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-[#07111f]/40 px-3 py-1 text-slate-300">
              <CalendarDays size={12} />
              {formatArticleDate(article.updatedAt || article.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-[#07111f]/40 px-3 py-1 text-slate-300">
              <Clock3 size={12} />
              {article.readingTime?.label}
            </span>
          </div>

          <h3 className="mt-5 max-w-3xl text-[1.95rem] font-bold leading-tight text-white md:text-[2.2rem]">
            {article.title}
          </h3>
        </div>
      </div>

      <div className="mx-6 h-px bg-white/6 md:mx-8" />

      <div className="px-6 py-6 md:px-8 md:py-8">
        <div className="max-w-3xl space-y-5 text-[0.98rem] leading-8 text-slate-300 md:text-[1.04rem] md:leading-[2.15rem]">
          {paragraphs.map((paragraph, index) => (
            <p key={`${article.id}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

export default memo(ArticleCard);
