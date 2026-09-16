/**
 * Territories, not chapters.
 *
 * The first build numbered everything 00 to 11, which made the site read as a
 * course with a syllabus. Nothing here is numbered and nothing has a prescribed
 * order beyond the homepage. The groups exist so the navigation is legible, not
 * so the reader completes them.
 */

export interface Place {
  href: string;
  title: string;
  /** Shown under the title in the menu. Should say what you *do* there. */
  line: string;
}

export interface Territory {
  id: string;
  label: string;
  places: Place[];
}

export const territories: Territory[] = [
  {
    id: "instruments",
    label: "Instruments",
    places: [
      { href: "/rewrite", title: "Rewrite the canon", line: "Same events. Change one premise. Watch what has to move with it." },
      { href: "/versions", title: "The character lab", line: "Fixed evidence about a person, in order. What it costs you to keep your first reading." },
      { href: "/criteria", title: "Coherent, supported, true", line: "Three explanations, one set of facts. Find out which criterion you actually use." },
      { href: "/machines", title: "Humans and models", line: "The same ambiguous evidence, given to people and to a language model." },
    ],
  },
  {
    id: "cases",
    label: "Cases",
    places: [
      { href: "/categories", title: "When the category breaks", line: "de Broglie, and what happens when inherited words stop fitting." },
      { href: "/person", title: "The model of a person", line: "The quiet one. Short." },
    ],
  },
  {
    id: "doubt",
    label: "Doubt",
    places: [
      { href: "/shape", title: "Is the shape really there?", line: "Structural claims, some mine, some invented. Judge which are found and which are imposed." },
      { href: "/map", title: "The map", line: "Every connection, with its breaks drawn as breaks." },
    ],
  },
  {
    id: "record",
    label: "Record",
    places: [
      { href: "/lab", title: "Method and data", line: "What is being measured, what has been collected, what this cannot show." },
      { href: "/log", title: "Log", line: "What I thought. What broke. What I still don't know." },
      { href: "/about", title: "Where this came from", line: "Fanfiction. Genuinely." },
      { href: "/ethics", title: "What is stored", line: "Almost nothing, and why." },
    ],
  },
];

export const allPlaces: Place[] = territories.flatMap((t) => t.places);

export function placeFor(pathname: string): Place | undefined {
  return allPlaces.find((p) => p.href === pathname);
}

export function territoryFor(pathname: string): Territory | undefined {
  return territories.find((t) => t.places.some((p) => p.href === pathname));
}

/**
 * Suggested next stops. Not a sequence — a short list of where this page's
 * argument actually continues, chosen per page rather than by position.
 */
export const continuations: Record<string, string[]> = {
  "/rewrite": ["/versions", "/shape"],
  "/versions": ["/person", "/criteria"],
  "/person": ["/versions", "/shape"],
  "/categories": ["/shape", "/map"],
  "/criteria": ["/machines", "/shape"],
  "/machines": ["/lab", "/criteria"],
  "/shape": ["/map", "/log"],
  "/map": ["/shape", "/lab"],
  "/lab": ["/machines", "/log"],
  "/log": ["/shape", "/about"],
  "/about": ["/versions", "/log"],
  "/ethics": ["/lab"],
};
