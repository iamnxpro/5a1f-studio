import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useMotion } from "@/contexts/MotionContext";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

/**
 * Scrolls to `#section` after navigation and resets to the top on a plain
 * route change. Respects the visitor's motion preference.
 */
function HashScroll() {
  const { pathname, hash } = useLocation();
  const { motionEnabled } = useMotion();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (!hash) {
      if (previousPath.current !== pathname) {
        window.scrollTo({ top: 0, behavior: "auto" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }
      previousPath.current = pathname;
      return;
    }

    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) return;

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({
          behavior: motionEnabled ? "smooth" : "auto",
          block: "start",
        });
      } else if (previousPath.current !== pathname) {
        window.scrollTo({ top: 0, behavior: "auto" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }
    });

    previousPath.current = pathname;
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, motionEnabled]);

  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-bg-primary)]">
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <HashScroll />
    </div>
  );
}
