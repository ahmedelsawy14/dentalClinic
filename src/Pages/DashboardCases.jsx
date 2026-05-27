import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderKanban, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import CasesTable from "../components/dashboard/CasesTable";
import DeleteModal from "../components/dashboard/DeleteModal";
import UploadCaseForm from "../components/dashboard/UploadCaseForm";
import {
  createDentalCase,
  deleteDentalCase,
  getStoredCases,
} from "../utils/localStorageHelpers";

function DashboardCases() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [toast, setToast] = useState(null);
  const [pendingDeleteCase, setPendingDeleteCase] = useState(null);

  useEffect(() => {
    setCases(getStoredCases());
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2800);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleCreateCase = (caseData) => {
    const nextCase = createDentalCase(caseData);
    setCases((currentCases) => [nextCase, ...currentCases]);
    setToast({
      type: "success",
      message: "تم حفظ الحالة بنجاح.",
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const confirmDelete = () => {
    if (!pendingDeleteCase) {
      return;
    }

    const updatedCases = deleteDentalCase(pendingDeleteCase.id);
    setCases(updatedCases);
    setPendingDeleteCase(null);
    setToast({
      type: "success",
      message: "تم حذف الحالة بنجاح.",
    });
  };

  return (
    <main
      dir="rtl"
      className="premium-page premium-ambient relative min-h-screen overflow-hidden px-4 pb-10 pt-6 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="absolute right-[8%] top-16 h-44 w-44 rounded-full bg-[#d6bc6a]/12 blur-3xl" />
      <div className="absolute left-[6%] top-52 h-56 w-56 rounded-full bg-[#23456c]/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <header className="glass-card rounded-[2.2rem] p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,0.28)] md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d6bc6a]/22 bg-[#d6bc6a]/10 px-4 py-2 text-sm font-semibold text-[#f5e2a1]">
                <ShieldCheck size={16} />
                Admin Dashboard
              </div>
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">Before & After Cases</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  لوحة أمامية فقط لإدارة الحالات السابقة، مع رفع الصور، المعاينة، والحذف ضمن
                  نفس هوية الموقع الحالية.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:border-[#d6bc6a]/35 hover:text-[#f6e5af]"
              >
                <Sparkles size={16} />
                عرض صفحة الحالات
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#efc66d]/22 bg-[#efc66d]/10 px-5 py-3 text-sm font-semibold text-[#f9e9b8] hover:-translate-y-0.5 hover:bg-[#efc66d]/16"
              >
                <LogOut size={16} />
                تسجيل الخروج
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-300">إجمالي الحالات</p>
              <p className="mt-2 text-3xl font-bold text-white">{cases.length}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-300">نوع التخزين</p>
              <p className="mt-2 text-lg font-bold text-white">localStorage</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-300">حالة الواجهة</p>
              <p className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-[#d8fff0]">
                <FolderKanban size={18} />
                جاهزة للإدارة
              </p>
            </div>
          </div>
        </header>

        <UploadCaseForm onSaveCase={handleCreateCase} />
        <CasesTable cases={cases} loading={false} onDelete={setPendingDeleteCase} onEdit={() => {}} />
      </div>

      <DeleteModal
        isOpen={Boolean(pendingDeleteCase)}
        title="حذف الحالة"
        description={`سيتم حذف "${pendingDeleteCase?.title || "هذه الحالة"}" من المكتبة المحلية.`}
        onCancel={() => setPendingDeleteCase(null)}
        onConfirm={confirmDelete}
      />
    </main>
  );
}

export default DashboardCases;
