import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap";

const MotionDiv = motion.div;

function DeleteModal({ description, isOpen, title, onCancel, onConfirm }) {
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
          className="fixed inset-0 z-[130] flex items-center justify-center bg-[#02070d]/74 px-4"
          onClick={onCancel}
        >
          <MotionDiv
            ref={dialogRef}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="glass-card w-full max-w-md rounded-[2rem] p-6 text-white shadow-[0_32px_90px_rgba(0,0,0,0.34)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-delete-modal-title"
            dir="rtl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-[#d6bc6a]">تأكيد الحذف</p>
                <h3 id="dashboard-delete-modal-title" className="mt-3 text-2xl font-bold">
                  {title}
                </h3>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-[#d6bc6a]/24 bg-[#d6bc6a]/10 text-[#f1dc9c]">
                <AlertTriangle size={22} />
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex items-center justify-center rounded-full border border-[#ef6b6b]/35 bg-[#ef6b6b]/12 px-5 py-3 text-sm font-semibold text-[#ffd8d8] hover:-translate-y-0.5 hover:bg-[#ef6b6b]/18"
              >
                حذف
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
