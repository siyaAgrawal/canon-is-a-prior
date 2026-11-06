import Link from "next/link";
import { groupLabel, groupLine, groupOrder, places, roomColor } from "@/lib/journey";

/**
 * Every page, in its section, in path order. Used wherever the whole site should
 * be visible at once without opening anything: the end of the homepage, the
 * footer, and the 404.
 *
 * `detail` adds the one-line description under each title; the footer leaves it
 * off so the map stays a map.
 */
export function SiteDirectory({
  current,
  detail = false,
  showHome = false,
}: {
  current?: string;
  detail?: boolean;
  showHome?: boolean;
}) {
  return (
    <div className={`grid gap-x-10 ${detail ? "gap-y-14" : "gap-y-10"} sm:grid-cols-2 lg:grid-cols-4`}>
      {groupOrder.map((g) => (
        <section key={g} aria-labelledby={`dir-${g}`}>
          <h3 id={`dir-${g}`} className="kicker mb-1" style={{ color: "rgb(var(--fg))" }}>
            {groupLabel[g]}
          </h3>
          {detail && (
            <p className="mb-3 text-[0.8rem] leading-snug" style={{ color: "rgb(var(--faint))" }}>
              {groupLine[g]}
            </p>
          )}
          <ul className={detail ? "mt-4" : "mt-3"}>
            {g === "instruments" && showHome && (
              <DirItem href="/" title="Home — the “Sure.” opening" color={roomColor.origin} current={current} />
            )}
            {places
              .filter((p) => p.group === g)
              .map((p) => (
                <DirItem
                  key={p.href}
                  href={p.href}
                  title={p.title}
                  line={detail ? p.line : undefined}
                  color={roomColor[p.room]}
                  current={current}
                />
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function DirItem({
  href,
  title,
  line,
  color,
  current,
}: {
  href: string;
  title: string;
  line?: string;
  color: string;
  current?: string;
}) {
  const active = current === href;
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`group flex items-start gap-3 ${line ? "py-2.5" : "py-1.5"}`}
      >
        <span
          aria-hidden="true"
          className="mt-[0.45em] h-[7px] w-[7px] flex-none rounded-full border"
          style={{ borderColor: color, background: active ? color : "transparent" }}
        />
        <span className="min-w-0">
          <span
            className={`block leading-snug transition-opacity group-hover:opacity-70 ${
              line ? "font-display text-[1.08rem]" : "text-[0.9rem]"
            }`}
            style={{ color: active ? color : "rgb(var(--fg))" }}
          >
            {title}
            {active && (
              <span className="ml-2 font-mono text-[0.56rem] uppercase tracking-[0.16em]" style={{ color }}>
                you are here
              </span>
            )}
          </span>
          {line && (
            <span className="mt-0.5 block text-[0.8rem] leading-snug" style={{ color: "rgb(var(--faint))" }}>
              {line}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}
