import { useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FileText,
  FolderKanban,
  Home,
  LogOut,
  PanelLeftClose,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { siteConfig } from "../../config/site";
import { useFocusTrap } from "../../hooks/useFocusTrap";

const sidebarLinks = [
  { to: "/dashboard", label: "نظرة عامة", icon: Home, end: true },
  { to: "/dashboard/cases", label: "حالات قبل وبعد", icon: FolderKanban },
  { to: "/dashboard/articles", label: "إدارة المقالات", icon: FileText },
  { to: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

function Sidebar({ isMobileOpen, onClose, onLogout }) {
  const mobileSidebarRef = useRef(null);

  useFocusTrap({
    containerRef: mobileSidebarRef,
    isActive: isMobileOpen,
    onEscape: onClose,
  });

  const sidebarPanel = (
    <div
      dir="rtl"
      className="glass-card flex h-full flex-col rounded-[2.2rem] border-white/10 px-5 py-5 text-right text-white shadow-[0_24px_70px_rgba(0,0,0,0.26)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] border border-[#d6bc6a]/24 bg-[#d6bc6a]/10 text-[#f0d98e]">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-[#d6bc6a]">لوحة الإدارة</p>
            <p className="mt-1 text-base font-bold">{siteConfig.siteName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-white/10 bg-white/6 text-slate-100 lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-4">
        <p className="text-sm font-semibold text-[#f3df9b]">حساب الإدارة</p>
        <p className="mt-3 text-lg font-bold text-white">مدير محتوى العيادة</p>
        <p className="mt-1 text-sm leading-6 text-slate-300">
          إدارة المقالات والحالات والنشر اليومي من مكان واحد وبواجهة عربية مريحة.
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 rounded-[1.35rem] px-4 py-3 text-sm font-semibold ${
                  isActive
                    ? "border border-[#d6bc6a]/22 bg-[#d6bc6a]/12 text-[#f5e2a1] shadow-[0_14px_35px_rgba(214,188,106,0.08)]"
                    : "border border-transparent text-slate-200 hover:border-white/10 hover:bg-white/[0.05]"
                }`
              }
            >
              <span>{link.label}</span>
              <Icon size={17} />
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-between rounded-[1.35rem] border border-[#ef6b6b]/24 bg-[#ef6b6b]/10 px-4 py-3 text-sm font-semibold text-[#ffd8d8] hover:-translate-y-0.5"
        >
          <span>تسجيل الخروج</span>
          <LogOut size={16} />
        </button>
        <p className="text-xs leading-6 text-slate-400">
          الجلسة محلية فقط. يتم حفظ المحتوى والإعدادات داخل المتصفح على هذا الجهاز.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] lg:block">{sidebarPanel}</aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-[120] bg-[#02070d]/72 lg:hidden" onClick={onClose}>
          <div className="flex h-full justify-end p-4" onClick={(event) => event.stopPropagation()}>
            <div
              ref={mobileSidebarRef}
              className="h-full w-full max-w-xs"
              role="dialog"
              aria-modal="true"
              aria-label="القائمة الجانبية للوحة الإدارة"
            >
              {sidebarPanel}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function SidebarToggle({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="inline-flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 text-white lg:hidden"
      aria-label="فتح التنقل"
    >
      <PanelLeftClose size={18} />
    </button>
  );
}

export default Sidebar;
