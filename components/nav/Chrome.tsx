"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { roomFor } from "@/lib/journey";

/** Four named destinations in the bar. Everything else lives in Explore. */
const PRIMARY = [
  { href: "/sure", label: "Start" },
  { href: "/map", label: "Map" },
  { href: "/lab", label: "Research" },
  { href: "/about", label: "About" },
];
import { Index } from "./Index";

/**
 * Persistent navigation.
 *
 * Present on every route including the homepage, because the visitor owns the
 * navigation — there is no page reachable only by having been somewhere else. On
 * desktop three destinations sit in the bar; everything, always, is one keystroke
 * or one tap away in the index.
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [indexOpen, setIndexOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const room = roomFor(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIndexOpen(false), [pathname]);

  /**
   * The room is set on <body>, not on a wrapper. A wrapper's background stops at
   * its own box, which leaves the page background showing past the content and
   * behind overscroll. On the body it is always full-bleed.
   */
  useEffect(() => {
    document.body.dataset.room = room;
    return () => {
      delete document.body.dataset.room;
    };
  }, [room]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = ["INPUT", "SELECT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName);
      if (e.key === "Escape") setIndexOpen(false);
      if (!typing && (e.key === "e" || e.key === "E") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIndexOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = indexOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [indexOpen]);



  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-fg focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-bg"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
          scrolled ? "bg-bg/90 backdrop-blur-md" : "border-transparent"
        }`}
        style={scrolled ? { borderColor: "rgb(var(--line) / var(--line-a))" } : undefined}
      >
        <div className="shell flex items-center justify-between gap-6 py-3.5">
          <Link href="/" className="whitespace-nowrap font-display text-[1.02rem] tracking-tight">
            The Canon Is a Prior
          </Link>

          <div className="flex items-center gap-6 sm:gap-8">
            <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
              {PRIMARY.map((p) => {
                const active = pathname === p.href;
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    aria-current={active ? "page" : undefined}
                    className="relative font-mono text-[0.64rem] uppercase tracking-[0.16em] transition-colors"
                    style={{ color: active ? "rgb(var(--accent))" : "rgb(var(--faint))" }}
                  >
                    {p.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1.5 left-0 h-px w-full"
                        style={{ background: "rgb(var(--accent))" }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => setIndexOpen(true)}
              aria-expanded={indexOpen}
              aria-controls="project-index"
              className="btn-quiet"
            >
              Explore
              <kbd
                className="ml-1 hidden border px-1 text-[0.58rem] opacity-60 md:inline"
                style={{ borderColor: "rgb(var(--line) / 0.3)" }}
              >
                E
              </kbd>
            </button>
          </div>
        </div>
      </header>

      <Index open={indexOpen} onClose={() => setIndexOpen(false)} pathname={pathname} />

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-32 border-t" style={{ borderColor: "rgb(var(--line) / var(--line-a))" }}>
        <div className="shell py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="max-w-measure text-[0.8rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
              An investigation, not a conclusion. Nothing is reported that the data does not contain.
              You have not seen the project — you have seen one interface for it.
            </p>
            <nav aria-label="Secondary" className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/lab" className="btn-quiet">Lab</Link>
              <Link href="/log" className="btn-quiet">Log</Link>
              <Link href="/ethics" className="btn-quiet">Ethics</Link>
              <Link href="/map" className="btn-quiet">Map</Link>
              <Link href="/about" className="btn-quiet">About</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
