import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { signOut } from "firebase/auth";
import Sidebar, { SidebarToggle } from "./Sidebar";
import { auth } from "../../lib/firebase";

function DashboardLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  return (
    <main dir="rtl" className="premium-page premium-ambient min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1680px] gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <header className="glass-card rounded-[2rem] px-4 py-4 text-right text-white md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <SidebarToggle onOpen={() => setIsSidebarOpen(true)} />
                <div>
                  <p className="text-sm font-semibold tracking-[0.24em] text-[#d6bc6a]">لوحة الإدارة</p>
                  <h1 className="mt-1 text-2xl font-bold md:text-3xl">نظام إدارة محتوى العيادة</h1>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
                  <Search size={16} className="text-[#d6bc6a]" />
                  واجهة أمامية فقط مع حفظ محلي داخل المتصفح
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 text-[#f0d98e]">
                  <Bell size={16} />
                </div>
              </div>
            </div>
          </header>

          <Outlet />
        </div>

        <Sidebar
          isMobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    </main>
  );
}

export default DashboardLayout;
