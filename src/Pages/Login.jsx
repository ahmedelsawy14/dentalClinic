import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import useAuth from "../hooks/useAuth";

function getFirebaseLoginError(code) {
  switch (code) {
    case "auth/invalid-email":
      return { email: "يرجى إدخال بريد إلكتروني صحيح." };
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return { password: "البريد الإلكتروني أو كلمة المرور غير صحيحين." };
    case "auth/too-many-requests":
      return { password: "تمت محاولات كثيرة. حاول مرة أخرى بعد قليل." };
    case "auth/network-request-failed":
      return { submit: "تعذر الاتصال حاليًا. تحقق من الإنترنت ثم أعد المحاولة." };
    default:
      return { submit: "تعذر تسجيل الدخول حاليًا. حاول مرة أخرى بعد قليل." };
  }
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = location.state?.from || "/dashboard";
  const labelClass =
    "mb-3 flex items-center justify-end gap-2 text-base font-bold text-white md:text-[1.08rem]";
  const fieldShellClass =
    "flex h-15 items-center gap-3 rounded-[1.55rem] border border-white/10 bg-[#21344d] px-5 text-white transition-colors focus-within:border-[#d6bc6a]/55 focus-within:bg-[#243a56]";

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "يرجى إدخال البريد الإلكتروني.";
    }

    if (!password.trim()) {
      nextErrors.password = "يرجى إدخال كلمة المرور.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate(fromPath, { replace: true });
    } catch (error) {
      setErrors(getFirebaseLoginError(error?.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="premium-page premium-ambient relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 md:px-10 lg:px-12"
    >
      <div className="absolute right-[8%] top-24 h-44 w-44 rounded-full bg-[#d6bc6a]/12 blur-3xl" />
      <div className="absolute left-[6%] top-40 h-56 w-56 rounded-full bg-[#23456c]/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-stretch">
          <section className="glass-card hidden rounded-[2.4rem] p-8 text-right text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.28em] text-[#d6bc6a]">ADMIN ACCESS</p>
              <h1 className="mt-5 text-4xl font-bold leading-tight">
                إدارة حالات قبل وبعد داخل نفس هوية العيادة
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
                تسجيل دخول بسيط وآمن على مستوى الواجهة فقط لمراجعة الحالات، رفع الصور، وتنظيم
                مكتبة النتائج بطريقة راقية ومتناسقة مع الموقع الحالي.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                "رفع صور قبل وبعد مع معاينة مباشرة قبل الحفظ.",
                "حفظ محلي داخل المتصفح لسرعة التجربة أثناء الإدارة.",
                "واجهة متجاوبة بنفس الألوان والزجاجيات والحركة الهادئة للموقع.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card mx-auto w-full max-w-xl rounded-[2.4rem] p-6 text-right text-white shadow-[0_32px_85px_rgba(0,0,0,0.28)] sm:p-8 md:p-9">
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-200 hover:-translate-y-0.5 hover:border-[#d6bc6a]/35 hover:text-[#f6e5af]"
              >
                العودة للموقع
              </Link>
              <span className="flex h-14 w-14 items-center justify-center rounded-[1.6rem] border border-[#d6bc6a]/24 bg-[#d6bc6a]/10 text-[#eedda3]">
                <ShieldCheck size={26} />
              </span>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold tracking-[0.24em] text-[#d6bc6a]">LOGIN</p>
              <h2 className="mt-3 text-3xl font-bold">تسجيل دخول الإدارة</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
                أدخل البريد الإلكتروني وكلمة المرور للانتقال إلى لوحة إدارة الحالات.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label htmlFor="admin-email" className={labelClass}>
                  <span>البريد الإلكتروني</span>
                  <Mail size={18} className="text-[#d6bc6a]" />
                </label>
                <div className={fieldShellClass}>
                  <Mail size={18} className="shrink-0 text-[#7c8a9b]" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@clinic.com"
                    autoComplete="email"
                    className="w-full bg-transparent text-right outline-none placeholder:text-[#8f9ab0]"
                  />
                </div>
                {errors.email ? <p className="text-sm text-[#ffb6b6]">{errors.email}</p> : null}
              </div>

              <div className="space-y-3">
                <label htmlFor="admin-password" className={labelClass}>
                  <span>كلمة المرور</span>
                  <LockKeyhole size={18} className="text-[#d6bc6a]" />
                </label>
                <div className={fieldShellClass}>
                  <LockKeyhole size={18} className="shrink-0 text-[#7c8a9b]" />
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-transparent text-right outline-none placeholder:text-[#8f9ab0]"
                  />
                </div>
                {errors.password ? (
                  <p className="text-sm text-[#ffb6b6]">{errors.password}</p>
                ) : null}
              </div>

              {errors.submit ? <p className="text-sm text-[#ffb6b6]">{errors.submit}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting || isAuthLoading}
                className="inline-flex h-15 w-full items-center justify-center rounded-full bg-[#c2a241] px-6 text-base font-bold text-white shadow-[0_18px_40px_rgba(194,162,65,0.22)] transition-transform transition-colors hover:-translate-y-0.5 hover:bg-[#b79736] disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isSubmitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Login;
