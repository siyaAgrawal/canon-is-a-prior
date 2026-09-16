/**
 * Every place, and the room it belongs to.
 *
 * Non-linear by construction. Nothing requires anything else to have been
 * visited, every entry is a real route that renders on a cold load, and every one
 * of them appears in the index on every page.
 */

export type Room = "origin" | "myth" | "physics" | "doubt" | "inference" | "spatial" | "human" | "record";

export type Group = "origin" | "experiments" | "cases" | "connections" | "record";

export interface Place {
  href: string;
  title: string;
  /** What you do there. Not what it is about. */
  line: string;
  room: Room;
  group: Group;
}

export const places: Place[] = [
  { href: "/about", title: "Where this came from", line: "Fanfiction, specifically. Then a myth, a measurement, a person — and then a suspicion about all of it.", room: "record", group: "origin" },

  { href: "/sure", title: "Sure.", line: "One word, five readings. Commit, then watch three facts arrive and find out what you do with them.", room: "origin", group: "experiments" },
  { href: "/versions", title: "Versions", line: "Seven facts about an invented person. How much evidence before you change your mind?", room: "origin", group: "experiments" },
  { href: "/rewrite", title: "Icarus", line: "Scroll and he climbs. Change why, and the same fall means something else.", room: "myth", group: "experiments" },
  { href: "/criteria", title: "Criteria", line: "Three explanations, one set of facts. Find out which property you treat as decisive.", room: "inference", group: "experiments" },
  { href: "/discriminate", title: "Two models, same evidence", line: "Both fit everything. Design the observation that would tell them apart, then predict what it shows.", room: "inference", group: "experiments" },
  { href: "/shape", title: "Is the shape really there?", line: "Ten connections. Three are mine and false. Catch them before I tell you.", room: "doubt", group: "experiments" },
  { href: "/canon-test", title: "The Canon Test", line: "You think you've found a pattern. Eight questions that make you say what it would take to be wrong.", room: "doubt", group: "experiments" },

  { href: "/categories", title: "When the category breaks", line: "Sort six specimens. Then meet the seventh, which has the defining property of both kinds.", room: "physics", group: "cases" },
  { href: "/person", title: "The model of a person", line: "The quiet room.", room: "human", group: "cases" },
  { href: "/machines", title: "Humans and models", line: "The same ambiguous evidence, given to people and to a language model.", room: "inference", group: "cases" },

  { href: "/map", title: "The map", line: "Every connection, with the severed ones drawn as severed. Also the way around.", room: "spatial", group: "connections" },

  { href: "/discovery", title: "What we know so far", line: "Every candidate finding, its status, what would move it, and the rival that would explain the same data.", room: "doubt", group: "connections" },
  { href: "/lab", title: "Lab", line: "Question, pre-registered predictions, method, live data, limitations.", room: "record", group: "record" },
  { href: "/log", title: "Log", line: "What I thought. What broke. What I still don't know.", room: "record", group: "record" },
  { href: "/ethics", title: "Ethics", line: "What is stored, what is not, and why the dataset is deliberately poorer than it could be.", room: "record", group: "record" },
];

export const groupLabel: Record<Group, string> = {
  origin: "Origin",
  experiments: "Experiments",
  cases: "Cases",
  connections: "Connections",
  record: "Record",
};

export const groupOrder: Group[] = ["origin", "experiments", "cases", "connections", "record"];

export function placeFor(pathname: string): Place | undefined {
  return places.find((p) => p.href === pathname);
}

export function roomFor(pathname: string): Room {
  if (pathname === "/") return "origin";
  if (pathname === "/console") return "record";
  return placeFor(pathname)?.room ?? "record";
}

/** Two onward routes per page. A suggestion — never the only way forward. */
export const onward: Record<string, string[]> = {
  "/": ["/sure", "/discriminate"],
  "/sure": ["/versions", "/machines"],
  "/versions": ["/rewrite", "/person"],
  "/rewrite": ["/discriminate", "/categories"],
  "/criteria": ["/discriminate", "/machines"],
  "/discriminate": ["/categories", "/shape"],
  "/categories": ["/shape", "/map"],
  "/person": ["/versions", "/shape"],
  "/machines": ["/criteria", "/lab"],
  "/shape": ["/canon-test", "/discovery"],
  "/canon-test": ["/discovery", "/discriminate"],
  "/map": ["/discovery", "/shape"],
  "/discovery": ["/shape", "/lab"],
  "/lab": ["/discovery", "/ethics"],
  "/log": ["/shape", "/about"],
  "/ethics": ["/lab", "/about"],
  "/about": ["/versions", "/rewrite"],
};
