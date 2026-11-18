import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Preloader } from "@/components/preloader/Preloader";
import { useLanguage } from "@/contexts/LanguageContext";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";

const SoftwarePage = lazy(() => import("@/pages/Software"));
const ProductionsPage = lazy(() => import("@/pages/Productions"));
const ServiceRequestPage = lazy(() => import("@/pages/ServiceRequest"));
const Team = lazy(() => import("@/pages/Team"));
const TeamMember = lazy(() => import("@/pages/TeamMember"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));

function RouteFallback() {
  const { t } = useLanguage();

  return (
    <div className="grid min-h-[60vh] place-items-center bg-[var(--color-bg-primary)] px-6 py-20">
      <p className="flex items-center gap-2.5 text-[12px] font-semibold text-[var(--color-fg-secondary)]">
        <span
          aria-hidden="true"
          className="size-2 animate-pulse rounded-full bg-[var(--color-accent)]"
        />
        {t("common.loading")}
      </p>
    </div>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

export default function App() {
  const { t } = useLanguage();
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (!introDone) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("main")?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [introDone]);

  return (
    <>
      {introDone && (
        <a className="skip-link" href="#main">
          {t("a11y.skipToContent")}
        </a>
      )}

      {!introDone && <Preloader onFinished={() => setIntroDone(true)} />}

      <div
        inert={!introDone}
        aria-hidden={introDone ? undefined : true}
        className={introDone ? undefined : "pointer-events-none"}
      >
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/software"
              element={
                <LazyPage>
                  <SoftwarePage />
                </LazyPage>
              }
            />
            <Route
              path="/productions"
              element={
                <LazyPage>
                  <ProductionsPage />
                </LazyPage>
              }
            />
            <Route
              path="/services"
              element={
                <LazyPage>
                  <ServiceRequestPage />
                </LazyPage>
              }
            />
            <Route
              path="/team"
              element={
                <LazyPage>
                  <Team />
                </LazyPage>
              }
            />
            <Route
              path="/team/abdullah"
              element={<Navigate to="/team/abdulsamad" replace />}
            />
            <Route
              path="/team/:memberId"
              element={
                <LazyPage>
                  <TeamMember />
                </LazyPage>
              }
            />
            <Route
              path="/blog"
              element={
                <LazyPage>
                  <Blog />
                </LazyPage>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <LazyPage>
                  <BlogPost />
                </LazyPage>
              }
            />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}
