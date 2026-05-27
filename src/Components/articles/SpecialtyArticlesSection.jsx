import { memo, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import ArticleCard from "./ArticleCard";
import {
  getArticlesBySpecialty,
  getSpecialtyBySlug,
  subscribeToArticleStorage,
} from "../../dashboard/utils/articleStorage";

function SpecialtyArticlesSection({ specialtySlug }) {
  const specialty = getSpecialtyBySlug(specialtySlug);
  const [articles, setArticles] = useState(() =>
    getArticlesBySpecialty(specialtySlug, { publishedOnly: true }),
  );

  useEffect(() => {
    setArticles(getArticlesBySpecialty(specialtySlug, { publishedOnly: true }));

    return subscribeToArticleStorage(() => {
      setArticles(getArticlesBySpecialty(specialtySlug, { publishedOnly: true }));
    });
  }, [specialtySlug]);

  if (!specialty || !articles.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-8 lg:p-10">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d6bc6a]/36 to-transparent" />

      <div className="max-w-3xl text-right">
        <span className="theme-pill rounded-full px-4 py-2 text-sm">
          <Sparkles size={14} />
          مقالات اليوم
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            specialty={specialty}
            articleNumber={index + 1}
          />
        ))}
      </div>
    </section>
  );
}

export default memo(SpecialtyArticlesSection);
