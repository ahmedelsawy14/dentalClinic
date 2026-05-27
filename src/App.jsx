import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import ErrorBoundary from "./Components/ErrorBoundary";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import ScrollToTop from "./Components/ScrollToTop";
import WhatsAppButton from "./Components/WhatsAppButton";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import Services from "./Pages/Services";
import RouteSkeleton from "./Components/RouteSkeleton";

const About = lazy(() => import("./Pages/About"));
const Gallery = lazy(() => import("./Pages/gallery"));
const ReservationPage = lazy(() => import("./Pages/ReservationPage"));
const ServiceDetail = lazy(() => import("./Pages/ServiceDetail"));
const Login = lazy(() => import("./Pages/Login"));
const DashboardLayout = lazy(() => import("./dashboard/layout/DashboardLayout"));
const DashboardHome = lazy(() => import("./dashboard/pages/DashboardHome"));
const CasesPage = lazy(() => import("./dashboard/pages/CasesPage"));
const ArticlesPage = lazy(() => import("./dashboard/pages/ArticlesPage"));
const SpecialtyArticlesPage = lazy(() => import("./dashboard/pages/SpecialtyArticlesPage"));
const SettingsPage = lazy(() => import("./dashboard/pages/SettingsPage"));

function LazyRoute({ children, compact = false, resetKey, fallbackDescription }) {
  return (
    <ErrorBoundary
      compact={compact}
      resetKey={resetKey}
      fallbackDescription={fallbackDescription}
    >
      <Suspense fallback={<RouteSkeleton compact={compact} />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function App() {
  const location = useLocation();
  const routeKey = location.pathname;
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isAuthRoute = location.pathname === "/login";
  const hideSiteChrome = isDashboardRoute || isAuthRoute;

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
      >
        الانتقال إلى المحتوى الرئيسي
      </a>
      <ScrollToTop />
      {!hideSiteChrome ? <Navbar /> : null}
      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/services/:serviceName"
            element={
              <LazyRoute
                resetKey={routeKey}
                fallbackDescription="تعذر تحميل صفحة الخدمة بالكامل حاليًا. يمكنك تحديث الصفحة أو العودة لاحقًا."
              >
                <ServiceDetail />
              </LazyRoute>
            }
          />
          <Route
            path="/about"
            element={
              <LazyRoute resetKey={routeKey}>
                <About />
              </LazyRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <LazyRoute resetKey={routeKey}>
                <Gallery />
              </LazyRoute>
            }
          />
          <Route
            path="/reservation"
            element={
              <LazyRoute resetKey={routeKey}>
                <ReservationPage />
              </LazyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <LazyRoute resetKey={routeKey}>
                <Login />
              </LazyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <LazyRoute
                compact
                resetKey={routeKey}
                fallbackDescription="تعذر تحميل لوحة الإدارة حاليًا. حاول إعادة فتح الصفحة."
              >
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              </LazyRoute>
            }
          >
            <Route
              index
              element={
                <LazyRoute compact resetKey={routeKey}>
                  <DashboardHome />
                </LazyRoute>
              }
            />
            <Route
              path="cases"
              element={
                <LazyRoute compact resetKey={routeKey}>
                  <CasesPage />
                </LazyRoute>
              }
            />
            <Route
              path="articles"
              element={
                <LazyRoute compact resetKey={routeKey}>
                  <ArticlesPage />
                </LazyRoute>
              }
            />
            <Route
              path="articles/:specialty"
              element={
                <LazyRoute compact resetKey={routeKey}>
                  <SpecialtyArticlesPage />
                </LazyRoute>
              }
            />
            <Route
              path="settings"
              element={
                <LazyRoute compact resetKey={routeKey}>
                  <SettingsPage />
                </LazyRoute>
              }
            />
          </Route>
        </Routes>
      </div>
      {!hideSiteChrome ? <Footer /> : null}
      {!hideSiteChrome ? <WhatsAppButton /> : null}
    </>
  );
}

export default App;
