import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpenText, ChevronLeft, Plus, Search } from "lucide-react";
import DeleteModal from "../components/DeleteModal";
import ServiceGuideEditor from "../components/ServiceGuideEditor";
import StackedArticleEditor from "../components/StackedArticleEditor";
import ToastViewport from "../components/ToastViewport";
import {
  deleteArticle,
  getAllArticles,
  getEditableServiceContentBySlug,
  getSpecialties,
  saveServiceGuide,
  subscribeToArticleStorage,
  upsertArticle,
} from "../utils/articleStorage";

function ArticlesPage({ initialSpecialtySlug = "" }) {
  const location = useLocation();
  const specialties = getSpecialties();
  const defaultSpecialtySlug = initialSpecialtySlug || specialties[0]?.slug || "";
  const [selectedSpecialty, setSelectedSpecialty] = useState(defaultSpecialtySlug);
  const [, setContentVersion] = useState(0);
  const [guideSaving, setGuideSaving] = useState(false);
  const [savingArticleId, setSavingArticleId] = useState("");
  const [pendingDeleteArticle, setPendingDeleteArticle] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingArticle, setIsCreatingArticle] = useState(mode === "seo");
  const deferredQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    setSelectedSpecialty(initialSpecialtySlug || specialties[0]?.slug || "");
  }, [initialSpecialtySlug, location.pathname, specialties]);

  useEffect(() => {
    const refreshContent = () => {
      startTransition(() => {
        setContentVersion((current) => current + 1);
      });
    };

    const unsubscribe = subscribeToArticleStorage(refreshContent);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timeoutId = toast ? window.setTimeout(() => setToast(null), 2800) : null;
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [toast]);

  const selectedSpecialtyMeta = specialties.find((specialty) => specialty.slug === selectedSpecialty) || null;
  const serviceContent = getEditableServiceContentBySlug(selectedSpecialty);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const scopedArticles = serviceContent?.articles || [];

    if (!normalizedQuery) {
      return scopedArticles;
    }

    return scopedArticles.filter((article) =>
      `${article.title} ${article.content}`.toLowerCase().includes(normalizedQuery),
    );
  }, [deferredQuery, serviceContent?.articles]);

  const allArticlesCount = getAllArticles().length;
  const sectionEyebrow = "إدارة محتوى الخدمات";
  const sectionTitle = "إدارة المحتوى الثابت والمقالات الإضافية";
  const sectionDescription =
    "بنية كل صفحة خدمة ثابتة وآمنة، ويمكن تعديل النصوص فقط داخل الدليل الرئيسي، ثم إضافة مقالات إضافية أسفل الصفحة بشكل رأسي مرتب.";

  const handleSaveGuide = async (payload) => {
    setGuideSaving(true);

    try {
      saveServiceGuide(selectedSpecialty, payload);
      setToast({
        type: "success",
        title: "تم حفظ الدليل الرئيسي",
        message: `تم تحديث النصوص الأساسية لخدمة ${selectedSpecialtyMeta?.title || "التخصص"}.`,
      });
    } finally {
      setGuideSaving(false);
    }
  };

  const handleSaveArticle = async (payload, currentId) => {
    setSavingArticleId(currentId || "new");

    try {
      const savedArticle = upsertArticle(payload, currentId);
      setIsCreatingArticle(false);
      setToast({
        type: "success",
        title: currentId ? "تم تحديث المقال" : "تمت إضافة المقال",
        message: `أصبح "${savedArticle?.title || "المقال"}" ظاهرًا أسفل صفحة الخدمة بنفس الترتيب الرأسي.`,
      });
    } finally {
      setSavingArticleId("");
    }
  };

  const handleDeleteArticle = () => {
    if (!pendingDeleteArticle) {
      return;
    }

    deleteArticle(pendingDeleteArticle.id);
    setPendingDeleteArticle(null);
    setToast({
      type: "success",
      title: "تم حذف المقال",
      message: "تمت إزالة المقال من التخصص المحدد.",
    });
  };

  return (
    <section dir="rtl" className="space-y-4 text-right">
      <div className="glass-card rounded-[2rem] p-5 text-white md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">{sectionEyebrow}</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">{sectionTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              {sectionDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-5 text-white md:p-6">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">اختيار الخدمة</p>
            <h3 className="mt-2 text-2xl font-bold">حرّر صفحة واحدة في كل مرة</h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {specialties.map((specialty) => (
              <button
                key={specialty.slug}
                type="button"
                onClick={() => {
                  setSelectedSpecialty(specialty.slug);
                  setIsCreatingArticle(false);
                }}
                className={`min-w-[220px] rounded-[1.5rem] border px-4 py-4 text-right ${
                  selectedSpecialty === specialty.slug
                    ? "border-[#d6bc6a]/26 bg-[#d6bc6a]/12 text-[#f3df9b]"
                    : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-[#d6bc6a]/20"
                }`}
              >
                <p className="text-base font-bold">{specialty.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{specialty.description}</p>
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px_240px]">
            <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3">
              <Search size={17} className="text-[#d6bc6a]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="ابحث داخل المقالات الإضافية لهذه الخدمة"
                className="w-full bg-transparent text-sm text-right text-white outline-none placeholder:text-[#8f9ab0]"
              />
            </div>

            <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
              <BookOpenText size={16} className="text-[#d6bc6a]" />
              دليل ثابت + مقالات رأسية
            </div>

            <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
              <BookOpenText size={16} className="text-[#d6bc6a]" />
              {allArticlesCount} مقال إضافي
            </div>
          </div>
        </div>
      </div>

      {selectedSpecialtyMeta ? (
        <div className="glass-card rounded-[2rem] p-5 text-white md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">الصفحة الحالية</p>
              <h3 className="mt-2 text-3xl font-bold">{selectedSpecialtyMeta.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                يتم الحفاظ على عناوين الصفحة وترتيبها كما هي، بينما تتحكم اللوحة فقط في النصوص الداخلية والمقالات الإضافية.
              </p>
            </div>
            <Link
              to={`/services/${selectedSpecialtyMeta.slug}`}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-100 hover:-translate-y-0.5"
            >
              معاينة الصفحة العامة
              <ChevronLeft size={15} />
            </Link>
          </div>
        </div>
      ) : null}

      {selectedSpecialtyMeta && serviceContent ? (
        <ServiceGuideEditor
          specialty={selectedSpecialtyMeta}
          guide={serviceContent.guide}
          isSaving={guideSaving}
          onSave={handleSaveGuide}
        />
      ) : null}

      <section className="space-y-4">
        <div className="glass-card rounded-[2rem] p-5 text-white md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">المقالات الإضافية</p>
              <h3 className="mt-2 text-2xl font-bold">مقالات {selectedSpecialtyMeta?.title || "الخدمة"}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
                كل مقال جديد يظهر أسفل المقال السابق في الصفحة العامة، بدون شبكات أو أعمدة متجاورة.
              </p>
            </div>

            {!isCreatingArticle ? (
              <button
                type="button"
                onClick={() => setIsCreatingArticle(true)}
                className="theme-button-primary inline-flex items-center gap-2 self-start rounded-full px-5 py-3 text-sm font-bold"
              >
                <Plus size={16} />
                إضافة مقال جديد
              </button>
            ) : null}
          </div>
        </div>

        {filteredArticles.map((article, index) => (
          <StackedArticleEditor
            key={article.id}
            article={article}
            articleNumber={index + 1}
            specialtySlug={selectedSpecialty}
            isSaving={savingArticleId === article.id}
            onSave={(payload) => handleSaveArticle(payload, article.id)}
            onDelete={() => setPendingDeleteArticle(article)}
          />
        ))}

        {isCreatingArticle ? (
          <StackedArticleEditor
            key={`draft-${selectedSpecialty}`}
            isDraft
            articleNumber={filteredArticles.length + 1}
            specialtySlug={selectedSpecialty}
            isSaving={savingArticleId === "new"}
            onSave={(payload) => handleSaveArticle(payload)}
            onDelete={() => {
              setIsCreatingArticle(false);
            }}
          />
        ) : null}

        {!filteredArticles.length && !isCreatingArticle ? (
          <div className="glass-card rounded-[2rem] p-8 text-center text-white">
            <h3 className="text-2xl font-bold">لا توجد مقالات إضافية بعد</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              الدليل الرئيسي ظاهر بالفعل في صفحة الخدمة. يمكنك الآن إضافة أول مقال إضافي أسفله من الزر أعلاه.
            </p>
          </div>
        ) : null}
      </section>

      <DeleteModal
        isOpen={Boolean(pendingDeleteArticle)}
        title="حذف هذا المقال؟"
        description={`سيتم حذف "${pendingDeleteArticle?.title || "المقال المحدد"}" من الخدمة الحالية.`}
        onCancel={() => setPendingDeleteArticle(null)}
        onConfirm={handleDeleteArticle}
      />
      <ToastViewport toast={toast} />
    </section>
  );
}

export default ArticlesPage;
