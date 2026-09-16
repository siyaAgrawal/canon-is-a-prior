/**
 * Every place on the site, and the room it belongs to.
 *
 * There is no sequence. Nothing requires anything else to have been visited, no
 * page is reachable only from another, and every entry here is a real route that
 * renders standalone on a cold load.
 */

export type Room = "origin" | "myth" | "physics" | "doubt" | "inference" | "spatial" | "human" | "record";

export interface Place {
  href: string;
  title: string;
  /** What you do there, not what it is about. */
  line: string;
  room: Room;
  group: "explore" | "thread" | "record";
}

export const places: Place[] = [
  { href: "/versions", title: "Versions", line: "One character, two assumptions. Then seven facts about a stranger, and what it costs you to keep your first reading.", room: "origin", group: "explore" },
  { href: "/rewrite", title: "Icarus", line: "Climb. Change why he climbed. Watch the same fall mean something else.", room: "myth", group: "explore" },
  { href: "/shape", title: "The shape", line: "Ten connections. Three are mine and false. Find them before I tell you.", room: "doubt", group: "explore" },

  { href: "/categories", title: "When the category breaks", line: "Wave or particle — and what it costs to have some of each.", room: "physics", group: "thread" },
  { href: "/person", title: "The model of a person", line: "The quiet room.", room: "human", group: "thread" },
  { href: "/machines", title: "How interpretations move", line: "Which criterion you actually use, and what a language model does with the same evidence.", room: "inference", group: "thread" },
  { href: "/map", title: "The map", line: "Every connection, with the severed ones drawn as severed.", room: "spatial", group: "thread" },

  { href: "/about", title: "Origin", line: "Fanfiction. Then a myth, a measurement, a person.", room: "record", group: "record" },
  { href: "/lab", title: "Method & data", line: "What is measured, what has been collected, what this cannot show.", room: "record", group: "record" },
  { href: "/log", title: "Log", line: "What I thought. What broke. What I still don't know.", room: "record", group: "record" },
];

export const groupLabel: Record<Place["group"], string> = {
  explore: "Explore",
  thread: "Follow the thread",
  record: "See the record",
};

export function placeFor(pathname: string): Place | undefined {
  return places.find((p) => p.href === pathname);
}

export function roomFor(pathname: string): Room {
  if (pathname === "/") return "origin";
  return placeFor(pathname)?.room ?? "record";
}

/** Two onward routes per page, chosen because the thought continues there. */
export const onward: Record<string, string[]> = {
  "/": ["/versions", "/shape"],
  "/versions": ["/rewrite", "/person"],
  "/rewrite": ["/categories", "/shape"],
  "/categories": ["/shape", "/map"],
  "/person": ["/versions", "/shape"],
  "/machines": ["/lab", "/shape"],
  "/shape": ["/map", "/log"],
  "/map": ["/shape", "/lab"],
  "/lab": ["/machines", "/log"],
  "/log": ["/shape", "/about"],
  "/about": ["/versions", "/rewrite"],
};
