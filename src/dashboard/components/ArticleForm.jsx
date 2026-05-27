import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, Save, X } from "lucide-react";
import { getArticleDraft, saveArticleDraft, clearArticleDraft, getSpecialtyBySlug } from "../utils/articleStorage";
import { buildArticlePayload, validateArticlePayload } from "../utils/seoHelpers";

const defaultForm = {
  title: "",
  content: "",
  specialty: "",
  status: "published",
};

function ArticleForm({
  article,
  isOpen,
  isSaving,
  forcedSpecialty = "",
  articleNumber,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [lastAutoSaveAt, setLastAutoSaveAt] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (article) {
      setFormData({
        title: article.title || "",
        content: article.content || "",
        specialty: article.specialty || forcedSpecialty || "",
        status: article.status || "published",
      });
      setErrors({});
      return;
    }

    const draft = getArticleDraft();
    if (draft) {
      setFormData({
        ...defaultForm,
        ...draft,
        specialty: forcedSpecialty || draft.specialty || "",
      });
    } else {
      setFormData({
        ...defaultForm,
        specialty: forcedSpecialty || "",
      });
    }
    setErrors({});
  }, [article, forcedSpecialty, isOpen]);

  useEffect(() => {
    if (!isOpen || article) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveArticleDraft(formData);
      setLastAutoSaveAt(
        new Intl.DateTimeFormat("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    }, 280);

    return () => window.clearTimeout(timeoutId);
  }, [article, formData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const selectedSpecialty = getSpecialtyBySlug(formData.specialty);
  const fieldShellClass =
    "w-full rounded-[1.45rem] border border-white/10 bg-[#20344c] px-4 py-3 text-right leading-8 text-white outline-none placeholder:text-[#8f9ab0] focus:border-[#d6bc6a]/55 focus:bg-[#26405f]";

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = buildArticlePayload({
      ...formData,
      specialty: forcedSpecialty || formData.specialty,
    });
    const nextErrors = validateArticlePayload(payload);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    await onSave(payload);
    clearArticleDraft();
  };

  return (
    <section dir="rtl" className="space-y-5">
      <div className="glass-card rounded-[2rem] p-5 text-right text-white md:p-7">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">
              {article ? "تحرير المقال" : "نشر مقال جديد"}
            </p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              {article
                ? `تعديل ${articleNumber ? `المقال ${articleNumber}` : "المقال"}`
                : `${articleNumber ? `المقال ${articleNumber}` : "مقال جديد"} ضمن ${selectedSpecialty?.title || "التخصص"}`}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              اكتب العنوان والمحتوى فقط، والنظام يتولى تلقائيًا تجهيز الملخص والرابط المختصر وبيانات الظهور في البحث.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-100 hover:-translate-y-0.5"
          >
            <X size={15} />
            إغلاق
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="mb-5 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">بيانات المقال</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                المقال يتبع صورة وهوية التخصص تلقائيًا، لذلك لا تحتاج إلى أي إعدادات إضافية.
              </p>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.3rem] border border-white/10 bg-[#081423]/60 px-4 py-3">
                <p className="text-sm font-semibold text-[#f0d98e]">التخصص الحالي</p>
                <p className="mt-1 text-sm text-slate-200">{selectedSpecialty?.title || "لم يتم تحديد التخصص"}</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white">عنوان المقال</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  className={fieldShellClass}
                  placeholder="مثال: كيف تساعد زراعة الأسنان في استعادة الابتسامة والوظيفة الطبيعية"
                />
                {errors.title ? <p className="text-sm text-[#ffb6b6]">{errors.title}</p> : null}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white">حالة المقال</label>
                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleChange("status", "draft")}
                    className={`rounded-[1.3rem] border px-4 py-3 text-sm font-semibold ${
                      formData.status === "draft"
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-[#081423]/55 text-slate-300"
                    }`}
                  >
                    حفظ كمسودة
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("status", "published")}
                    className={`rounded-[1.3rem] border px-4 py-3 text-sm font-semibold ${
                      formData.status === "published"
                        ? "border-[#6dd0a5]/24 bg-[#6dd0a5]/10 text-[#dcfff0]"
                        : "border-white/10 bg-[#081423]/55 text-slate-300"
                    }`}
                  >
                    نشر المقال
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="mb-5 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">محتوى المقال</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                سيقوم النظام تلقائيًا باستخراج الملخص من أول فقرة، وحساب وقت القراءة، وتجهيز البيانات المطلوبة في الخلفية.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">نص المقال</label>
              <textarea
                rows={16}
                value={formData.content}
                onChange={(event) => handleChange("content", event.target.value)}
                className={`${fieldShellClass} min-h-[28rem] resize-y`}
                placeholder="اكتب محتوى المقال هنا، ويفضل تقسيمه إلى فقرات قصيرة وواضحة لسهولة القراءة."
              />
              {errors.content ? <p className="text-sm text-[#ffb6b6]">{errors.content}</p> : null}
            </div>
          </section>

          <div className="sticky bottom-3 z-20 rounded-[1.6rem] border border-white/10 bg-[#07111f]/95 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                  <CheckCircle2 size={14} />
                  جاهز للظهور في البحث تلقائيًا
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                  <CheckCircle2 size={14} />
                  {lastAutoSaveAt ? `تم حفظ المسودة في ${lastAutoSaveAt}` : "يتم حفظ المسودة تلقائيًا"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {!article ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearArticleDraft();
                      setFormData({ ...defaultForm, specialty: forcedSpecialty || "" });
                    }}
                    className="theme-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold"
                  >
                    حذف المسودة
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "جارٍ الحفظ..." : formData.status === "draft" ? "حفظ كمسودة" : article ? "حفظ التعديلات" : "نشر المقال"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ArticleForm;
