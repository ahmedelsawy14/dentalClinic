function ArticleSection({ section, level = "h2" }) {
  const HeadingTag = level;
  const paragraphs = Array.isArray(section?.paragraphs) ? section.paragraphs : [];
  const points = Array.isArray(section?.points) ? section.points : [];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#d6bc6a]/16 bg-[#0d1f35] shadow-[0_18px_48px_rgba(6,12,23,0.18)]">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d6bc6a]/55 to-transparent" />
      <div className="absolute right-10 top-3 h-44 w-44 rounded-full bg-[#d6bc6a]/22 blur-3xl" />

      <div className="relative px-6 pb-5 pt-7 md:px-9 md:pb-6 md:pt-8">
        <HeadingTag className="max-w-3xl text-2xl font-bold leading-tight text-white md:text-[1.85rem]">
          {section?.title}
        </HeadingTag>
      </div>

      <div className="relative mx-6 h-px bg-white/6 md:mx-9" />

      <div className="relative max-w-3xl space-y-5 px-6 py-6 text-[0.98rem] leading-8 text-slate-300 md:px-9 md:py-8 md:text-[1.03rem] md:leading-[2.05rem]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {points.length ? (
        <div className="relative px-6 pb-6 md:px-9 md:pb-8">
          <div className="max-w-3xl rounded-[1.7rem] border border-white/7 bg-[#0a1525]/58 px-5 py-5 md:px-6">
            <ul className="space-y-3.5 text-sm leading-7.5 text-slate-300 md:text-[0.98rem]">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#d6bc6a]/85" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ServiceArticle({ article, serviceTitle }) {
  const safeArticle = {
    intro: article?.intro || "",
    sections: Array.isArray(article?.sections) ? article.sections : [],
    continuation: Array.isArray(article?.continuation) ? article.continuation : [],
  };

  return (
    <article className="space-y-6">
      <section className="relative overflow-hidden rounded-[2.35rem] border border-[#d6bc6a]/16 bg-[#0d1f35] shadow-[0_18px_48px_rgba(6,12,23,0.18)]">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d6bc6a]/55 to-transparent" />
        <div className="absolute right-12 top-4 h-52 w-52 rounded-full bg-[#d6bc6a]/22 blur-3xl" />

        <div className="relative px-7 py-9 md:px-11 md:py-11">
          <div className="max-w-5xl text-right">
            <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-[#e8d389]">
              دليل الخدمة
            </p>
            <div className="mt-3 h-px w-24 bg-gradient-to-l from-transparent via-[#d6bc6a]/85 to-[#d6bc6a]/30" />
            <h2 className="mt-4 text-3xl font-bold leading-[1.15] text-white md:text-[2.65rem]">
              كل ما تحتاج معرفته عن {serviceTitle}
            </h2>
            <p className="mt-6 max-w-4xl text-[1rem] leading-8 text-slate-300 md:text-[1.05rem] md:leading-[2.05rem]">
              {safeArticle.intro}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        {safeArticle.sections.map((section) => (
          <ArticleSection key={section.title} section={section} level="h2" />
        ))}

        {safeArticle.continuation.map((section) => (
          <ArticleSection key={section.title} section={section} level="h3" />
        ))}
      </div>
    </article>
  );
}

export default ServiceArticle;
