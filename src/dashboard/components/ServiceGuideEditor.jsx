import { memo, useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, Save } from "lucide-react";
import { clearGuideDraft, getGuideDraft, saveGuideDraft } from "../utils/articleStorage";

function paragraphsToText(paragraphs = []) {
  return paragraphs.join("\n\n");
}

function textToParagraphs(value) {
  return value
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ServiceGuideEditor({ specialty, guide, onSave, isSaving = false }) {
  const [formData, setFormData] = useState(() => ({
    intro: guide?.intro || "",
    sections: (guide?.sections || []).map((section) => paragraphsToText(section.paragraphs)),
    continuation: (guide?.continuation || []).map((section) => paragraphsToText(section.paragraphs)),
  }));
  const [lastAutoSaveAt, setLastAutoSaveAt] = useState("");

  useEffect(() => {
    const draft = getGuideDraft(specialty.slug);
    if (draft) {
      setFormData(draft);
      return;
    }

    setFormData({
      intro: guide?.intro || "",
      sections: (guide?.sections || []).map((section) => paragraphsToText(section.paragraphs)),
      continuation: (guide?.continuation || []).map((section) => paragraphsToText(section.paragraphs)),
    });
  }, [guide, specialty.slug]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      saveGuideDraft(specialty.slug, formData);
      setLastAutoSaveAt(
        new Intl.DateTimeFormat("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [formData, specialty.slug]);

  const fieldClass =
    "min-h-[11rem] w-full resize-y rounded-[1.45rem] border border-white/10 bg-[#20344c] p-4 text-right leading-8 text-white outline-none placeholder:text-[#8f9ab0] focus:border-[#d6bc6a]/55 focus:bg-[#26405f]";

  const handleGroupChange = (key, index, value) => {
    setFormData((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSave({
      intro: formData.intro.trim(),
      sections: formData.sections.map((section) => ({
        paragraphs: textToParagraphs(section),
      })),
      continuation: formData.continuation.map((section) => ({
        paragraphs: textToParagraphs(section),
      })),
    });

    clearGuideDraft();
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] p-5 text-right text-white md:p-7">
      <div className="border-b border-white/10 pb-5">
        <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">الدليل الرئيسي</p>
        <h3 className="mt-2 text-2xl font-bold md:text-3xl">كل ما تحتاج معرفته عن {specialty.title}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
          العناوين والتقسيم ثابتة لحماية شكل الصفحة. يمكنك تعديل النصوص فقط داخل كل جزء.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <h4 className="text-xl font-bold text-white">مقدمة الدليل</h4>
          <textarea
            value={formData.intro}
            onChange={(event) => setFormData((current) => ({ ...current, intro: event.target.value }))}
            className={`${fieldClass} mt-4 min-h-[12rem]`}
            placeholder="اكتب مقدمة الصفحة هنا."
          />
        </section>

        {(guide?.sections || []).map((section, index) => (
          <section
            key={section.title}
            className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 md:p-6"
          >
            <h4 className="text-xl font-bold text-white">{section.title}</h4>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              اكتب الفقرات الخاصة بهذا الجزء فقط، وسيبقى العنوان والعناصر الثابتة كما هي في الصفحة.
            </p>
            <textarea
              value={formData.sections[index] || ""}
              onChange={(event) => handleGroupChange("sections", index, event.target.value)}
              className={`${fieldClass} mt-4`}
              placeholder="افصل بين كل فقرة وأخرى بسطر فارغ."
            />
          </section>
        ))}

        {(guide?.continuation || []).map((section, index) => (
          <section
            key={section.title}
            className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 md:p-6"
          >
            <h4 className="text-xl font-bold text-white">{section.title}</h4>
            <textarea
              value={formData.continuation[index] || ""}
              onChange={(event) => handleGroupChange("continuation", index, event.target.value)}
              className={`${fieldClass} mt-4`}
              placeholder="اكتب النص التكميلي لهذا الجزء."
            />
          </section>
        ))}
      </div>

      <div className="sticky bottom-3 z-20 mt-6 rounded-[1.6rem] border border-white/10 bg-[#07111f]/95 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-slate-300">
            <CheckCircle2 size={14} />
            {lastAutoSaveAt ? `تم حفظ المسودة في ${lastAutoSaveAt}` : "يتم حفظ المسودة تلقائيًا"}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "جارٍ الحفظ..." : "حفظ الدليل الرئيسي"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default memo(ServiceGuideEditor);
