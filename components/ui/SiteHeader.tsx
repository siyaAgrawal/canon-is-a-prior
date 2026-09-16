"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { territories, territoryFor } from "@/lib/journey";

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

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const here = territoryFor(pathname);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-rule-soft bg-paper/92 backdrop-blur-sm" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-wide items-baseline justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link href="/" className="font-display text-[1.02rem] tracking-tight hover:text-rust">
          The Canon Is a Prior
        </Link>

        <div className="flex items-baseline gap-5">
          {here && (
            <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-ghost sm:inline">
              {here.label}
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="btn-quiet py-1"
          >
            {open ? "Close" : "Everything"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="site-menu"
          aria-label="Site"
          className="animate-fade-up border-t border-rule-soft bg-paper-raised/97 backdrop-blur"
        >
          <div className="mx-auto max-w-wide px-5 py-8 sm:px-8">
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {territories.map((t) => (
                <div key={t.id}>
                  <p className="eyebrow mb-3">{t.label}</p>
                  <ul>
                    {t.places.map((p) => {
                      const active = p.href === pathname;
                      return (
                        <li key={p.href}>
                          <Link
                            href={p.href}
                            aria-current={active ? "page" : undefined}
                            className={`block border-b border-rule-soft py-2.5 transition-colors ${
                              active ? "text-rust" : "hover:text-rust"
                            }`}
                          >
                            <span className="block font-display text-[1.02rem] leading-snug">{p.title}</span>
                            <span className="mt-0.5 block text-[0.78rem] leading-snug text-ink-faint">
                              {p.line}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
