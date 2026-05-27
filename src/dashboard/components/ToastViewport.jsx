import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

const MotionDiv = motion.div;

const toastIcons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: "border-[#6dd0a5]/30 bg-[#6dd0a5]/10 text-[#dcfff0]",
  error: "border-[#ef6b6b]/30 bg-[#ef6b6b]/12 text-[#ffd8d8]",
  info: "border-white/12 bg-white/8 text-slate-100",
};

function ToastViewport({ toast }) {
  const Icon = toast ? toastIcons[toast.type] || Info : Info;

  return (
    <AnimatePresence>
      {toast ? (
        <MotionDiv
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="fixed bottom-4 left-4 z-[140] max-w-sm"
        >
          <div
            className={`glass-card rounded-[1.4rem] border px-4 py-3 shadow-[0_20px_55px_rgba(0,0,0,0.32)] ${toastStyles[toast.type] || toastStyles.info}`}
          >
            <div className="flex items-start gap-3">
              <Icon size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message ? <p className="mt-1 text-sm leading-6">{toast.message}</p> : null}
              </div>
            </div>
            {toast.actionLabel && toast.onAction ? (
              <button
                type="button"
                onClick={toast.onAction}
                className="mt-3 inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white hover:-translate-y-0.5"
              >
                {toast.actionLabel}
              </button>
            ) : null}
          </div>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}

export default ToastViewport;
