import type { Metadata } from "next";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { logEntries, logNote } from "@/research/log";

export const metadata: Metadata = {
  title: "Log",
  description: "What I thought. What broke. What changed. What I still don't know.",
};

const FIELDS = [
  ["Thought", "thought"],
  ["Broke", "broke"],
  ["Changed", "changed"],
  ["Still don't know", "unknown"],
] as const;

export default function LogPage() {
  return (
    <>
      <PageHead title="Log" note={<p>{logNote}</p>} />

      <Shell className="mt-16">
        <div className="max-w-column space-y-20">
          {logEntries.map((e, i) => (
            <Reveal key={`${e.date}-${i}`}>
              <article className="hair pt-8">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-ghost">
                  {e.displayDate}
                </p>
                <h2 className="mt-4 font-display text-display-s leading-[1.35]">{e.question}</h2>
                <dl className="mt-8 space-y-6">
                  {FIELDS.map(([label, key]) => {
                    const value = e[key];
                    return (
                      <div key={label} className="grid gap-1.5 sm:grid-cols-[8rem_1fr] sm:gap-7">
                        <dt className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.13em] text-rust">
                          {label}
                        </dt>
                        <dd>
                          {value ? (
                            <p className="text-[0.95rem] leading-[1.7] text-ink-soft">{value}</p>
                          ) : (
                            <p className="font-mono text-[0.64rem] uppercase tracking-[0.13em] text-ink-ghost">
                              — nothing yet —
                            </p>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </Shell>

      <Continue from="/log" />
    </>
  );
}
