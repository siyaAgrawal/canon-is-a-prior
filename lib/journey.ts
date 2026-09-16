/**
 * The journey.
 *
 * The site is twelve stops in a fixed order, not twelve pages. Every stop knows what
 * comes before and after it, so a visitor can read it as one continuous argument
 * without ever using the navigation menu.
 */

export interface Stop {
  href: string;
  n: string;
  title: string;
  /** The one line that appears in the rail and in the prev/next links. */
  line: string;
  /** Roughly how long the page takes, for the reader's benefit. */
  minutes: number;
}

export const journey: Stop[] = [
  { href: "/", n: "00", title: "The canon is a prior", line: "Every interpretation begins somewhere.", minutes: 2 },
  { href: "/experiment", n: "01", title: "Update your belief", line: "You are given incomplete evidence. Make your best interpretation.", minutes: 6 },
  { href: "/bayes", n: "02", title: "Why call it a prior?", line: "What you just did, written down.", minutes: 5 },
  { href: "/canon", n: "03", title: "Rewrite the canon", line: "Change one assumption and watch the model reorganise.", minutes: 7 },
  { href: "/category", n: "04", title: "When the category breaks", line: "Wave or particle — and why the question has that shape.", minutes: 5 },
  { href: "/underdetermination", n: "05", title: "Same evidence, different reading", line: "Two people, one fact, two defensible conclusions.", minutes: 5 },
  { href: "/humans-vs-machines", n: "06", title: "Humans vs machines", line: "The same scenarios, run through a language model.", minutes: 8 },
  { href: "/data", n: "07", title: "The data", line: "What participants have actually shown. Possibly nothing yet.", minutes: 4 },
  { href: "/lab", n: "08", title: "The lab", line: "Question, hypotheses, method, failures, limits.", minutes: 8 },
  { href: "/philosophy", n: "09", title: "When should we change the story?", line: "Coherent, plausible, supported, true, useful — five different things.", minutes: 10 },
  { href: "/map", n: "10", title: "The connection map", line: "The sheet this started on, with every line made to declare itself.", minutes: 5 },
  { href: "/end", n: "11", title: "There is no final canon", line: "What do you do when the evidence doesn't fit the story?", minutes: 2 },
];

export const asideLinks = [
  { href: "/log", title: "Researcher's log" },
  { href: "/sources", title: "Sources" },
  { href: "/about", title: "About" },
  { href: "/ethics", title: "Ethics & privacy" },
];

export function stopFor(pathname: string): Stop | undefined {
  return journey.find((s) => s.href === pathname);
}

export function neighbours(pathname: string): { prev?: Stop; next?: Stop } {
  const i = journey.findIndex((s) => s.href === pathname);
  if (i < 0) return {};
  return { prev: journey[i - 1], next: journey[i + 1] };
}
