import { memo, useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, Save, Trash2 } from "lucide-react";
import { clearArticleDraft, getArticleDraft, saveArticleDraft } from "../utils/articleStorage";

const defaultForm = {
  title: "",
  content: "",
};

function StackedArticleEditor({
  article,
  specialtySlug,
  articleNumber,
  isSaving = false,
  isDraft = false,
  onSave,
  onDelete,
}) {
  const [formData, setFormData] = useState(defaultForm);
  const [lastAutoSaveAt, setLastAutoSaveAt] = useState("");

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        content: article.content || "",
      });
      return;
    }

    const draft = getArticleDraft(specialtySlug);
    if (draft) {
      setFormData({
        title: draft.title || "",
        content: draft.content || "",
      });
      return;
    }

    setFormData(defaultForm);
  }, [article, specialtySlug]);

  useEffect(() => {
    if (!isDraft) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveArticleDraft({
        specialty: specialtySlug,
        ...formData,
      });
      setLastAutoSaveAt(
        new Intl.DateTimeFormat("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [formData, isDraft, specialtySlug]);

  const fieldClass =
    "w-full rounded-[1.45rem] border border-white/10 bg-[#20344c] px-4 py-3 text-right leading-8 text-white outline-none placeholder:text-[#8f9ab0] focus:border-[#d6bc6a]/55 focus:bg-[#26405f]";

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSave({
      title: formData.title.trim(),
      content: formData.content.trim(),
      specialty: specialtySlug,
      published: true,
    });

    if (isDraft) {
      clearArticleDraft();
      setFormData(defaultForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] p-5 text-right text-white md:p-6">
      <div className="border-b border-white/10 pb-4">
        <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">
          {isDraft ? "مقال جديد" : `المقال ${articleNumber}`}
        </p>
        <h3 className="mt-2 text-2xl font-bold">{isDraft ? "إضافة مقال جديد" : article?.title || "مقال إضافي"}</h3>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">عنوان المقال</label>
          <input
            type="text"
            value={formData.title}
            onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
            className={fieldClass}
            placeholder="اكتب عنوان المقال"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">محتوى المقال</label>
          <textarea
            rows={14}
            value={formData.content}
            onChange={(event) => setFormData((current) => ({ ...current, content: event.target.value }))}
            className={`${fieldClass} min-h-[22rem] resize-y`}
            placeholder="اكتب محتوى المقال هنا."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-slate-300">
          <CheckCircle2 size={14} />
          {isDraft
            ? lastAutoSaveAt
              ? `تم حفظ المسودة في ${lastAutoSaveAt}`
              : "يتم حفظ المسودة تلقائيًا"
            : "ترتيب المقالات يظهر رأسيًا أسفل الصفحة العامة"}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ef6b6b]/26 bg-[#ef6b6b]/10 px-4 py-2 text-sm font-semibold text-[#ffd8d8]"
          >
            <Trash2 size={15} />
            حذف
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "جارٍ الحفظ..." : "حفظ"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default memo(StackedArticleEditor);
