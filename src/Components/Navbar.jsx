import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleUserRound, Menu, X } from "lucide-react";
import logo from "../assets/logo_dr.hazem-preview.webp";
import services from "../data/services";
import { useFocusTrap } from "../hooks/useFocusTrap";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const closeTimeout = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const megaMenuId = useId();

  const navItems = [
    { name: "الرئيسية", path: "/" },
    { name: "خدماتنا", path: "/services", hasMega: true },
    { name: "من نحن", path: "/about" },
    { name: "الحالات السابقة", path: "/gallery" },
  ];

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  const openMegaMenu = useCallback(() => {
    clearCloseTimeout();
    setShowMega(true);
  }, [clearCloseTimeout]);

  const closeMegaMenu = useCallback(() => {
    clearCloseTimeout();
    closeTimeout.current = setTimeout(() => {
      setShowMega(false);
    }, 120);
  }, [clearCloseTimeout]);

  useFocusTrap({
    containerRef: mobileMenuRef,
    isActive: open,
    onEscape: () => setOpen(false),
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setShowMega(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(
    () => () => {
      clearCloseTimeout();
    },
    [clearCloseTimeout],
  );

  const goToReservation = useCallback(() => {
    setOpen(false);
    navigate("/reservation");
  }, [navigate]);

  const goToLogin = useCallback(() => {
    setOpen(false);
    navigate("/login");
  }, [navigate]);

  return (
    <>
      <nav
        dir="rtl"
        aria-label="التنقل الرئيسي"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "px-4 pt-2 md:px-7 md:pt-2.5 lg:px-12" : "px-4 pt-2.5 md:px-7 md:pt-3 lg:px-12"
        }`}
      >
        <div
          className={`mx-auto max-w-[72rem] transition-all duration-300 ${
            scrolled ? "translate-y-0 scale-[0.982]" : "translate-y-0 scale-100"
          }`}
        >
          <div
            className={`relative overflow-visible transition-all duration-500 ease-out ${
              scrolled
                ? "glass-card rounded-[1.7rem] border border-white/12 bg-[#07111f]/84 px-2.5 py-2 shadow-[0_18px_45px_rgba(2,8,16,0.24)] backdrop-blur-2xl md:px-4"
                : "border-transparent bg-transparent px-3 py-2.5 shadow-none backdrop-blur-0 md:px-5"
            }`}
          >
            <div
              className={`relative flex items-center justify-between gap-4 ${
                scrolled ? "min-h-[3.35rem]" : "min-h-[3.45rem]"
              }`}
            >
              <Link to="/" className="group relative flex items-center gap-2.5 transition">
                <img
                  src={logo}
                  alt="شعار عيادة د. حازم سلطان"
                  width="160"
                  height="80"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className={`w-auto object-contain transition-all duration-300 ${
                    scrolled ? "h-[2.65rem] md:h-[2.95rem]" : "h-[2.85rem] md:h-[3.15rem]"
                  }`}
                />
              </Link>

              <div
                className={`hidden items-center font-semibold text-[#f7f4ee] lg:flex ${
                  scrolled ? "gap-1.5 text-[15px]" : "gap-2 text-[15px]"
                }`}
              >
                {navItems.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? location.pathname === item.path
                      : location.pathname === item.path ||
                        location.pathname.startsWith(`${item.path}/`);

                  return (
                    <div
                      key={item.path}
                      className="group relative"
                      onMouseEnter={() => item.hasMega && openMegaMenu()}
                      onMouseLeave={() => item.hasMega && closeMegaMenu()}
                      onFocus={() => item.hasMega && openMegaMenu()}
                      onBlur={() => item.hasMega && closeMegaMenu()}
                    >
                      <Link
                        to={item.path}
                        aria-haspopup={item.hasMega ? "menu" : undefined}
                        aria-expanded={item.hasMega ? showMega : undefined}
                        aria-controls={item.hasMega ? megaMenuId : undefined}
                        className={`relative inline-flex items-center rounded-full px-3.5 py-2.5 transition duration-300 ${
                          isActive
                            ? "text-[#f8efc7]"
                            : "text-white/84 hover:-translate-y-0.5 hover:text-[#f0d98e]"
                        }`}
                        onKeyDown={(event) => {
                          if (!item.hasMega) {
                            return;
                          }

                          if (["ArrowDown", "Enter", " "].includes(event.key)) {
                            event.preventDefault();
                            openMegaMenu();
                          }

                          if (event.key === "Escape") {
                            closeMegaMenu();
                          }
                        }}
                      >
                        <span className="relative">{item.name}</span>
                        <span
                          className={`absolute bottom-[0.45rem] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,#f0d98e,#d6bc6a,#f0d98e)] transition-all duration-300 ${
                            isActive ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-7 group-hover:opacity-100"
                          }`}
                        />
                      </Link>

                      {item.hasMega && showMega ? (
                        <div
                          id={megaMenuId}
                          onMouseEnter={openMegaMenu}
                          onMouseLeave={closeMegaMenu}
                          onKeyDown={(event) => {
                            if (event.key === "Escape") {
                              closeMegaMenu();
                            }
                          }}
                          role="menu"
                          aria-label="خدمات العيادة"
                          className="absolute right-0 top-full mt-4 w-[34rem] rounded-[2rem] border border-[#d6bc6a]/20 bg-[#091729]/92 p-5 text-right text-[#f7f4ee] shadow-[0_28px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-semibold tracking-[0.24em] text-[#f0d98e]">
                              خدمات العيادة
                            </p>
                            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/75">
                              {services.length}
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            {services.map((service) => (
                              <Link
                                key={service.slug}
                                to={`/services/${service.slug}`}
                                role="menuitem"
                                className="glass-card glass-card-hover rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-4"
                              >
                                <h3 className="text-sm font-semibold text-white">{service.title}</h3>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={goToLogin}
                  className="inline-flex h-[2.625rem] w-[2.625rem] items-center justify-center rounded-full border border-white/12 bg-white/8 text-[#f3e7b0] shadow-[0_12px_28px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:border-[#d6bc6a]/35 hover:bg-white/12 hover:text-[#f8efc7]"
                  aria-label="تسجيل دخول الإدارة"
                  title="تسجيل دخول الإدارة"
                >
                  <CircleUserRound size={18} />
                </button>
                <button
                  type="button"
                  onClick={goToReservation}
                  className="theme-button-primary inline-flex h-[2.625rem] items-center rounded-full px-5 text-sm font-semibold"
                >
                  احجز الآن
                </button>
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={goToLogin}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-[#f3e7b0] shadow-[0_12px_28px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:border-[#d6bc6a]/35 hover:bg-white/12 hover:text-[#f8efc7]"
                  aria-label="تسجيل دخول الإدارة"
                  title="تسجيل دخول الإدارة"
                >
                  <CircleUserRound size={19} />
                </button>

                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-[#f3e7b0] shadow-[0_12px_28px_rgba(0,0,0,0.18)] lg:hidden"
                  onClick={() => setOpen((current) => !current)}
                  aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
                  aria-expanded={open}
                  aria-controls="mobile-nav-menu"
                >
                  {open ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-[#02070d]/55 backdrop-blur-md transition duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        id="mobile-nav-menu"
        ref={mobileMenuRef}
        className={`fixed inset-x-3 top-[5rem] z-50 origin-top rounded-[1.7rem] border border-white/10 bg-[#07111f]/94 px-4 pb-4 pt-3 text-white shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition duration-300 md:inset-x-5 md:top-[5.35rem] lg:hidden ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-3 scale-[0.98] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="القائمة الرئيسية"
      >
        <div className="mx-auto max-w-xl space-y-4" dir="rtl">
          <div className="glass-card rounded-[1.7rem] p-4">
            <div className="flex flex-col gap-2.5">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? location.pathname === item.path
                    : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`rounded-[1.2rem] border px-4 py-4 text-base font-semibold transition ${
                      isActive
                        ? "border-[#d6bc6a]/35 bg-[#d6bc6a]/10 text-[#f6e5af]"
                        : "border-white/8 bg-white/5 text-[#f7f4ee] hover:border-[#d6bc6a]/35 hover:text-[#f1da97]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-[1.7rem] p-4">
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[#f1da97]">خدماتنا</p>
            <div className="grid gap-3">
              {services.slice(0, 6).map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-[1.2rem] border border-white/8 bg-white/5 px-4 py-4 transition hover:border-[#d6bc6a]/28"
                >
                  <h3 className="font-semibold">{service.title}</h3>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={goToLogin}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3.5 text-sm font-semibold text-[#f7f4ee] shadow-[0_20px_45px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 hover:border-[#d6bc6a]/35 hover:text-[#f1da97]"
            >
              <CircleUserRound size={18} />
              دخول الإدارة
            </button>

            <button
              type="button"
              onClick={goToReservation}
              className="theme-button-primary inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold"
            >
              احجز الآن
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(Navbar);
