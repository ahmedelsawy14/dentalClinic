import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap";

const MotionDiv = motion.div;

function DeleteModal({ caseItem, isOpen, onCancel, onConfirm }) {
  const dialogRef = useRef(null);

  useFocusTrap({
    containerRef: dialogRef,
    isActive: isOpen,
    onEscape: onCancel,
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02070d]/72 px-4 backdrop-blur-md"
          onClick={onCancel}
        >
          <MotionDiv
            ref={dialogRef}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="glass-card relative w-full max-w-md overflow-hidden rounded-[2rem] p-6 text-right text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-case-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-[#d6bc6a]">
                  حذف الحالة
                </p>
                <h3 id="delete-case-title" className="mt-3 text-2xl font-bold text-white">
                  هل تريد حذف هذه الحالة؟
                </h3>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d6bc6a]/25 bg-[#d6bc6a]/10 text-[#eedda3]">
                <AlertTriangle size={22} />
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              سيتم حذف حالة{" "}
              <span className="font-semibold text-[#f6e5af]">{caseItem?.title}</span> من لوحة الإدارة
              والمتصفح الحالي بشكل نهائي.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex items-center justify-center rounded-full border border-[#ef6b6b]/35 bg-[#ef6b6b]/12 px-5 py-3 text-sm font-semibold text-[#ffd7d7] hover:-translate-y-0.5 hover:bg-[#ef6b6b]/18"
              >
                تأكيد الحذف
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="theme-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                إلغاء
              </button>
            </div>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}

export default DeleteModal;
