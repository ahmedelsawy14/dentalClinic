import { memo, useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, RefreshCcw, Save, Trash2, UploadCloud } from "lucide-react";

const MAX_IMAGE_SIZE = 2.5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const IMAGE_QUALITY = 0.82;

const defaultFormState = {
  title: "",
  beforeImage: "",
  afterImage: "",
  beforeImageFile: null,
  afterImageFile: null,
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("تعذر قراءة الملف."));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("تعذر تجهيز الصورة."));
    image.src = dataUrl;
  });
}

async function optimizeImageFile(file) {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImageFromDataUrl(originalDataUrl);

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    return originalDataUrl;
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const compressedBlob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/webp", IMAGE_QUALITY);
  });

  if (!compressedBlob) {
    return originalDataUrl;
  }

  const optimizedFile = new File(
    [compressedBlob],
    `${file.name.replace(/\.[^.]+$/, "") || "case-image"}.webp`,
    {
      type: "image/webp",
    },
  );

  return {
    previewUrl: await readFileAsDataUrl(optimizedFile),
    file: optimizedFile,
  };
}

function UploadZone({
  error,
  helper,
  id,
  inputRef,
  isDragging,
  isUploading,
  label,
  onChange,
  onDrop,
  onDragLeave,
  onDragOver,
  onRemove,
  onReplace,
  preview,
  progress,
}) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-base font-bold text-white">
        {label}
      </label>
      <label
        htmlFor={id}
        className={`block cursor-pointer overflow-hidden rounded-[1.6rem] border border-dashed p-4 transition ${
          isDragging
            ? "border-[#d6bc6a]/70 bg-[#d6bc6a]/10"
            : "border-white/14 bg-white/[0.04] hover:border-[#d6bc6a]/30 hover:bg-white/[0.05]"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onChange}
        />

        {preview ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#081423]/72">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={preview} alt={label} className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onReplace();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#8dc9ff]/24 bg-[#8dc9ff]/10 px-4 py-2 text-sm font-semibold text-[#def0ff]"
              >
                <RefreshCcw size={14} />
                استبدال الصورة
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onRemove();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#ef6b6b]/24 bg-[#ef6b6b]/10 px-4 py-2 text-sm font-semibold text-[#ffd8d8]"
              >
                <Trash2 size={14} />
                إزالة الصورة
              </button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[15rem] flex-col items-center justify-center rounded-[1.3rem] border border-white/8 bg-[#081423]/60 px-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-[#d6bc6a]/24 bg-[#d6bc6a]/10 text-[#f0d98e]">
              <UploadCloud size={22} />
            </span>
            <p className="mt-4 text-base font-semibold text-white">اسحب الصورة هنا أو اضغط للاختيار</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">{helper}</p>
          </div>
        )}

        {isUploading ? (
          <div className="mt-4 rounded-[1rem] border border-white/10 bg-[#081423]/72 p-3">
            <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
              <span>جارٍ تجهيز الصورة</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#d6bc6a]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
      </label>
      {error ? <p className="text-sm text-[#ffb6b6]">{error}</p> : null}
    </div>
  );
}

function UploadCaseForm({ caseItem, onCancelEdit, onSaveCase }) {
  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [dragTarget, setDragTarget] = useState("");
  const [uploadState, setUploadState] = useState({
    beforeImage: { isUploading: false, progress: 0 },
    afterImage: { isUploading: false, progress: 0 },
  });
  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);

  const isUploadPending = uploadState.beforeImage.isUploading || uploadState.afterImage.isUploading;

  useEffect(() => {
    if (caseItem) {
      setFormData({
        title: caseItem.title || "",
        beforeImage: caseItem.beforeImage || "",
        afterImage: caseItem.afterImage || "",
        beforeImageFile: null,
        afterImageFile: null,
      });
      setErrors({});
      setUploadState({
        beforeImage: { isUploading: false, progress: 0 },
        afterImage: { isUploading: false, progress: 0 },
      });
      return;
    }

    setFormData(defaultFormState);
    setErrors({});
    setUploadState({
      beforeImage: { isUploading: false, progress: 0 },
      afterImage: { isUploading: false, progress: 0 },
    });
  }, [caseItem]);

  const fieldClass =
    "w-full rounded-[1.45rem] border border-white/10 bg-[#20344c] px-4 py-3 text-right leading-8 text-white outline-none placeholder:text-[#8f9ab0] focus:border-[#d6bc6a]/55 focus:bg-[#26405f]";

  const setField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "", submit: "" }));
  };

  const simulateUpload = async (file, field) => {
    try {
      if (!file.type.startsWith("image/")) {
        setErrors((current) => ({ ...current, [field]: "يرجى اختيار ملف صورة صالح فقط." }));
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setErrors((current) => ({
          ...current,
          [field]: "حجم الصورة كبير. الحد الأقصى الموصى به 2.5 ميجابايت.",
        }));
        return;
      }

      setErrors((current) => ({ ...current, [field]: "", submit: "" }));
      setUploadState((current) => ({
        ...current,
        [field]: { isUploading: true, progress: 15 },
      }));

      for (const progress of [42, 68, 92]) {
        await new Promise((resolve) => window.setTimeout(resolve, 90));
        setUploadState((current) => ({
          ...current,
          [field]: { isUploading: true, progress },
        }));
      }

      const optimizedImage = await optimizeImageFile(file);
      const fileField = field === "beforeImage" ? "beforeImageFile" : "afterImageFile";
      setFormData((current) => ({
        ...current,
        [field]: optimizedImage.previewUrl,
        [fileField]: optimizedImage.file,
      }));
      setErrors((current) => ({ ...current, [field]: "", submit: "" }));
      setUploadState((current) => ({
        ...current,
        [field]: { isUploading: false, progress: 100 },
      }));
    } catch {
      setErrors((current) => ({
        ...current,
        [field]: "تعذر تجهيز الصورة الآن. حاول اختيار صورة أخرى أو أصغر حجمًا.",
      }));
      setUploadState((current) => ({
        ...current,
        [field]: { isUploading: false, progress: 0 },
      }));
    }
  };

  const handleFileInputChange = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await simulateUpload(file, field);
  };

  const handleDrop = async (event, field) => {
    event.preventDefault();
    setDragTarget("");
    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    await simulateUpload(file, field);
  };

  const clearImageField = (field) => {
    const fileField = field === "beforeImage" ? "beforeImageFile" : "afterImageFile";
    setFormData((current) => ({ ...current, [field]: "", [fileField]: null }));
    setErrors((current) => ({ ...current, [field]: "", submit: "" }));
    setUploadState((current) => ({
      ...current,
      [field]: { isUploading: false, progress: 0 },
    }));
    if (field === "beforeImage" && beforeInputRef.current) {
      beforeInputRef.current.value = "";
    }
    if (field === "afterImage" && afterInputRef.current) {
      afterInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setFormData(defaultFormState);
    setErrors({});
    setUploadState({
      beforeImage: { isUploading: false, progress: 0 },
      afterImage: { isUploading: false, progress: 0 },
    });
    if (beforeInputRef.current) beforeInputRef.current.value = "";
    if (afterInputRef.current) afterInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isUploadPending) {
      setErrors((current) => ({
        ...current,
        submit: "انتظر حتى يكتمل تجهيز صورتي قبل وبعد ثم أعد الضغط على حفظ الحالة.",
      }));
      return;
    }

    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = "يرجى إدخال اسم واضح للحالة.";
    if (!formData.beforeImage) nextErrors.beforeImage = "يرجى رفع صورة قبل.";
    if (!formData.afterImage) nextErrors.afterImage = "يرجى رفع صورة بعد.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    try {
      await onSaveCase({
        title: formData.title.trim(),
        beforeImageFile: formData.beforeImageFile,
        afterImageFile: formData.afterImageFile,
        beforeImageUrl: caseItem?.beforeImage || "",
        afterImageUrl: caseItem?.afterImage || "",
      });

      if (!caseItem) {
        resetForm();
      }
    } catch (error) {
      setErrors((current) => ({
        ...current,
        submit: error?.message || "تعذر حفظ الحالة حاليًا. حاول تقليل حجم الصور ثم أعد المحاولة.",
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section dir="rtl" className="space-y-5">
      <div className="glass-card rounded-[2rem] p-5 text-right text-white md:p-7">
        <div className="border-b border-white/10 pb-5">
          <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">
            {caseItem ? "تحرير الحالة" : "حالة جديدة"}
          </p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            {caseItem ? "تحديث بيانات الحالة" : "إضافة حالة قبل وبعد"}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            تجربة سريعة وبسيطة: اسم الحالة ثم صور قبل وبعد فقط.
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">اسم الحالة</label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => setField("title", event.target.value)}
                className={fieldClass}
                placeholder="مثال: تحسين الابتسامة الأمامية"
              />
              {errors.title ? <p className="text-sm text-[#ffb6b6]">{errors.title}</p> : null}
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="grid gap-5 xl:grid-cols-2">
              <UploadZone
                id="before-image"
                label="صورة قبل"
                helper="اختر صورة واضحة للحالة قبل العلاج."
                inputRef={beforeInputRef}
                preview={formData.beforeImage}
                error={errors.beforeImage}
                isDragging={dragTarget === "beforeImage"}
                isUploading={uploadState.beforeImage.isUploading}
                progress={uploadState.beforeImage.progress}
                onChange={async (event) => handleFileInputChange(event, "beforeImage")}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragTarget("beforeImage");
                }}
                onDragLeave={() => setDragTarget("")}
                onDrop={async (event) => handleDrop(event, "beforeImage")}
                onRemove={() => clearImageField("beforeImage")}
                onReplace={() => beforeInputRef.current?.click()}
              />

              <UploadZone
                id="after-image"
                label="صورة بعد"
                helper="اختر صورة واضحة لنفس الحالة بعد العلاج."
                inputRef={afterInputRef}
                preview={formData.afterImage}
                error={errors.afterImage}
                isDragging={dragTarget === "afterImage"}
                isUploading={uploadState.afterImage.isUploading}
                progress={uploadState.afterImage.progress}
                onChange={async (event) => handleFileInputChange(event, "afterImage")}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragTarget("afterImage");
                }}
                onDragLeave={() => setDragTarget("")}
                onDrop={async (event) => handleDrop(event, "afterImage")}
                onRemove={() => clearImageField("afterImage")}
                onReplace={() => afterInputRef.current?.click()}
              />
            </div>
          </section>

          <div className="sticky bottom-3 z-20 rounded-[1.6rem] border border-white/10 bg-[#07111f]/95 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-slate-300">
                <CheckCircle2 size={14} />
                تظهر الحالة تلقائيًا داخل صفحة الجاليري بعد الحفظ
              </div>

              <div className="flex flex-wrap gap-2">
                {caseItem ? (
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    className="theme-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold"
                  >
                    إلغاء التحرير
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={isSaving || isUploadPending}
                  className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "جاري الحفظ..." : isUploadPending ? "جاري تجهيز الصور..." : "حفظ الحالة"}
                </button>
              </div>
            </div>
            {errors.submit ? <p className="mt-3 text-sm text-[#ffb6b6]">{errors.submit}</p> : null}
          </div>
        </form>
      </div>
    </section>
  );
}

export default memo(UploadCaseForm);
