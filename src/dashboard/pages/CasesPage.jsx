import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { ImagePlus, Search } from "lucide-react";
import UploadCaseForm from "../../Components/dashboard/UploadCaseForm";
import CasesTable from "../../Components/dashboard/CasesTable";
import DeleteModal from "../components/DeleteModal";
import ToastViewport from "../components/ToastViewport";
import { createCase, deleteCase, getCases, restoreCase, updateCase } from "../../services/casesService";

function CasesPage() {
  const [cases, setCases] = useState([]);
  const [editingCase, setEditingCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingDeleteCase, setPendingDeleteCase] = useState(null);
  const [toast, setToast] = useState(null);
  const deferredQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    const timeoutId = toast
      ? window.setTimeout(() => {
          setToast(null);
        }, 2800)
      : null;

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [toast]);

  useEffect(() => {
    const refreshCases = async () => {
      try {
        setCases(await getCases());
      } finally {
        setLoading(false);
      }
    };

    refreshCases().catch(() => setCases([]));
  }, []);

  const filteredCases = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return [...cases]
      .filter((caseItem) =>
        normalizedQuery ? `${caseItem.title}`.toLowerCase().includes(normalizedQuery) : true,
      )
      .sort((firstCase, secondCase) => new Date(secondCase.createdAt) - new Date(firstCase.createdAt));
  }, [cases, deferredQuery]);

  const handleSaveCase = async (caseData) => {
    let savedCase = null;

    if (editingCase) {
      savedCase = await updateCase(editingCase.id, {
        title: caseData.title,
        beforeImageFile: caseData.beforeImageFile,
        afterImageFile: caseData.afterImageFile,
        beforeImageUrl: caseData.beforeImageUrl,
        afterImageUrl: caseData.afterImageUrl,
      });
      startTransition(() => {
        setCases((currentCases) =>
          currentCases.map((caseItem) =>
            caseItem.id === editingCase.id
              ? {
                  ...caseItem,
                  ...savedCase,
                  createdAt: caseItem.createdAt,
                }
              : caseItem,
          ),
        );
      });
      setEditingCase(null);
    } else {
      savedCase = await createCase(caseData);
      startTransition(() => {
        setCases((currentCases) => [savedCase, ...currentCases]);
      });
    }

    setToast({
      type: "success",
      title: editingCase ? "تم تحديث الحالة" : "تم حفظ الحالة",
      message: `أصبحت "${savedCase?.title || "الحالة"}" ظاهرة تلقائيًا داخل صفحة الجاليري.`,
    });
  };

  const confirmDelete = async () => {
    if (!pendingDeleteCase) {
      return;
    }

    await deleteCase(pendingDeleteCase.id);
    const deletedCase = pendingDeleteCase;

    startTransition(() => {
      setCases((currentCases) => currentCases.filter((caseItem) => caseItem.id !== deletedCase.id));
    });

    setPendingDeleteCase(null);
    if (editingCase?.id === deletedCase.id) {
      setEditingCase(null);
    }

    setToast({
      type: "success",
      title: "تم حذف الحالة",
      message: "تم حذف الحالة المحددة من قاعدة البيانات.",
      actionLabel: "تراجع",
      onAction: async () => {
        const restoredCase = await restoreCase(deletedCase);
        setCases((currentCases) => [restoredCase, ...currentCases]);
        setToast({
          type: "info",
          title: "تمت استعادة الحالة",
          message: `عادت "${deletedCase.title}" إلى المكتبة مرة أخرى.`,
        });
      },
    });
  };

  return (
    <section dir="rtl" className="space-y-4 text-right">
      <div className="glass-card rounded-[2rem] p-5 text-white md:p-6">
        <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">قبل وبعد</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">إدارة جاليري الحالات</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
          أضف الحالة بصيغة بسيطة جدًا: اسم وصورتان فقط. بعد الحفظ تظهر مباشرة داخل الجاليري العام.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "إجمالي الحالات", value: cases.length },
          { label: "الحالات الظاهرة في الجاليري", value: cases.length },
          {
            label: "آخر إضافة",
            value: cases[0]
              ? new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short" }).format(
                  new Date(cases[0].createdAt),
                )
              : "—",
          },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-[1.7rem] p-5 text-white">
            <p className="text-sm text-slate-300">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <UploadCaseForm
        caseItem={editingCase}
        onCancelEdit={() => setEditingCase(null)}
        onSaveCase={handleSaveCase}
      />

      <div className="mx-auto max-w-4xl glass-card rounded-[2rem] p-5 text-white md:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3">
            <Search size={17} className="text-[#d6bc6a]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ابحث باسم الحالة"
              className="w-full bg-transparent text-sm text-right text-white outline-none placeholder:text-[#8f9ab0]"
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
            <ImagePlus size={16} className="text-[#d6bc6a]" />
            الأحدث أولًا
          </div>
        </div>
      </div>

      <CasesTable
        cases={filteredCases}
        loading={loading}
        onDelete={setPendingDeleteCase}
        onEdit={(caseItem) => {
          setEditingCase(caseItem);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <DeleteModal
        isOpen={Boolean(pendingDeleteCase)}
        title="حذف الحالة المحددة؟"
        description={`سيتم حذف "${pendingDeleteCase?.title || "هذه الحالة"}" من لوحة الإدارة والجاليري.`}
        onCancel={() => setPendingDeleteCase(null)}
        onConfirm={confirmDelete}
      />
      <ToastViewport toast={toast} />
    </section>
  );
}

export default CasesPage;
