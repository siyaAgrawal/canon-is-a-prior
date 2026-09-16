"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { asideLinks, journey } from "@/lib/journey";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const index = journey.findIndex((s) => s.href === pathname);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-paper/92 backdrop-blur-sm border-b border-rule-soft" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-wide items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="font-display text-[1.05rem] tracking-tight">The Canon Is a Prior</span>
          <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-ghost sm:inline">
            an open experiment
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {index >= 0 && (
            <span className="hidden font-mono text-[0.65rem] tracking-[0.18em] text-ink-ghost sm:inline tabular">
              {journey[index].n} / {journey[journey.length - 1].n}
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="journey-menu"
            className="btn-quiet py-2"
          >
            {open ? "Close" : "Contents"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="journey-menu"
          aria-label="Site contents"
          className="animate-fade-up border-t border-rule-soft bg-paper-raised/97 backdrop-blur"
        >
          <div className="mx-auto max-w-wide px-5 py-6 sm:px-8">
            <p className="eyebrow mb-4">The journey — in order</p>
            <ol className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
              {journey.map((s) => {
                const active = s.href === pathname;
                return (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className={`group flex gap-3 border-b border-rule-soft py-2.5 transition-colors ${
                        active ? "text-rust" : "hover:text-rust"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="mt-[3px] font-mono text-[0.62rem] tracking-widest text-ink-ghost tabular">
                        {s.n}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-[1.02rem] leading-snug">{s.title}</span>
                        <span className="block text-[0.78rem] leading-snug text-ink-faint">{s.line}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {asideLinks.map((l) => (
                <Link key={l.href} href={l.href} className="btn-quiet">
                  {l.title}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
