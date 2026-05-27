import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, FolderKanban, Layers3, Settings2 } from "lucide-react";
import {
  getAllArticles,
  getArticlesSnapshot,
  getSpecialties,
  subscribeToArticleStorage,
} from "../utils/articleStorage";
import { getCases } from "../../services/casesService";

function DashboardHome() {
  const [casesCount, setCasesCount] = useState(0);
  const [articles, setArticles] = useState(() => getAllArticles());
  const specialties = getSpecialties();

  useEffect(() => {
    const refreshData = async () => {
      setCasesCount((await getCases()).length);
      setArticles(getAllArticles());
    };

    refreshData().catch(() => {
      setCasesCount(0);
      setArticles(getAllArticles());
    });
    const unsubscribe = subscribeToArticleStorage(refreshData);

    return () => {
      unsubscribe();
    };
  }, []);

  const totalManagedItems = useMemo(() => specialties.length + articles.length, [articles.length, specialties.length]);

  const articleMap = getArticlesSnapshot();
  const latestArticles = [...articles]
    .sort((firstArticle, secondArticle) => new Date(secondArticle.createdAt) - new Date(firstArticle.createdAt))
    .slice(0, 5);

  return (
    <section dir="rtl" className="space-y-4 text-right text-white">
      <div className="glass-card rounded-[2rem] p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-[#d6bc6a]">نظرة عامة</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">مركز التحكم في محتوى العيادة</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              مساحة إدارة متكاملة لحالات قبل وبعد، وأدلة الخدمات الثابتة، والمقالات الإضافية، مع نفس هوية الموقع وربط قاعدة بيانات للحالات.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard/articles"
              className="theme-button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold"
            >
              إدارة المقالات
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/dashboard/cases"
              className="theme-button-secondary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            >
              إدارة الحالات
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {[
          { label: "التخصصات", value: specialties.length, icon: Layers3 },
          { label: "المقالات الإضافية", value: articles.length, icon: FileText },
          { label: "حالات قبل وبعد", value: casesCount, icon: FolderKanban },
          { label: "إجمالي عناصر المحتوى", value: totalManagedItems, icon: Settings2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="glass-card rounded-[1.8rem] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-[#d6bc6a]/24 bg-[#d6bc6a]/10 text-[#f0d98e]">
                  <Icon size={20} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <div className="glass-card rounded-[2rem] p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">أحدث المقالات</p>
              <h3 className="mt-2 text-2xl font-bold">آخر المقالات الإضافية</h3>
            </div>
            <Link to="/dashboard/articles" className="text-sm font-semibold text-[#f3df9b] hover:text-white">
              عرض الكل
            </Link>
          </div>

          {latestArticles.length ? (
            <div className="mt-5 space-y-3">
              {latestArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#f3df9b]">
                      {specialties.find((item) => item.slug === article.specialty)?.title || article.specialty}
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">{article.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{article.excerpt}</p>
                  </div>
                  <Link
                    to={`/dashboard/articles/${article.specialty}`}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-100"
                  >
                    فتح التخصص
                    <ArrowRight size={15} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/12 bg-white/[0.04] p-5 text-sm leading-7 text-slate-300">
              لا توجد مقالات إضافية بعد. ما زال الدليل الرئيسي لكل خدمة متاحًا ويمكنك إضافة المقالات من داخل صفحة التخصص.
            </div>
          )}
        </div>

        <div className="glass-card rounded-[2rem] p-5 md:p-6">
          <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">تغطية التخصصات</p>
          <h3 className="mt-2 text-2xl font-bold">الأدلة والمقالات حسب الصفحة</h3>
          <div className="mt-5 space-y-3">
            {specialties.map((specialty) => (
              <Link
                key={specialty.slug}
                to={`/dashboard/articles/${specialty.slug}`}
                className="flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 hover:border-[#d6bc6a]/24 hover:bg-white/[0.06]"
              >
                <span>{specialty.title}</span>
                <span className="rounded-full border border-[#d6bc6a]/22 bg-[#d6bc6a]/10 px-3 py-1 text-xs font-semibold text-[#f3df9b]">
                  دليل + {(articleMap[specialty.slug] || []).length}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardHome;
