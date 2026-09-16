import type { Instrument } from "@/types";

/**
 * What each instrument is allowed to store.
 *
 * Every payload is checked against a shape before it is written. The rule the
 * schemas enforce is not just "valid" but "closed": only ids drawn from fixed
 * vocabularies, integers in stated ranges, arrays under a length cap. No field
 * accepts free text, because if one did, a future version of an instrument could
 * quietly start collecting prose from participants.
 *
 * Adding an instrument means adding a schema here. An unknown instrument is
 * rejected rather than stored as an opaque blob.
 */

type Check = (payload: any) => string | null;

/**
 * The keys each instrument may persist. Anything outside this list is dropped
 * before writing — validating known fields is not enough, because an unknown
 * field would sail through and could carry arbitrary text. The site says it never
 * stores anything you typed; this is what makes that true rather than intended.
 */
const ALLOWED: Record<Instrument, string[]> = {
  entry: ["assumptions", "switches"],
  shape: ["judgements", "controlsAccepted", "realRejected"],
  versions: ["steps", "switches", "accommodations", "survived"],
  criteria: ["picks", "properties", "consistent"],
  rewrite: ["module", "premisesOpened", "dwellMs"],
  map: ["opened"],
};

/** Per-item key whitelist for the one payload that contains objects in an array. */
const STEP_KEYS = ["itemId", "reading", "stance"];

const isIdList = (v: unknown, max: number): boolean =>
  Array.isArray(v) && v.length <= max && v.every((x) => typeof x === "string" && /^[a-z0-9_-]{1,40}$/i.test(x));

const isIntIn = (v: unknown, lo: number, hi: number): boolean =>
  typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi;

export const SCHEMAS: Record<Instrument, Check> = {
  /** The homepage: which assumptions were tried, in order. */
  entry: (p) => {
    if (!isIdList(p?.assumptions, 12)) return "entry.assumptions must be a short list of ids";
    if (p.assumptions.length < 1) return "entry.assumptions is empty";
    if (!isIntIn(p?.switches, 0, 12)) return "entry.switches must be an integer";
    return null;
  },

  /** The claim audit: one judgement per claim, plus how many controls were accepted. */
  shape: (p) => {
    if (typeof p?.judgements !== "object" || p.judgements === null) return "shape.judgements must be an object";
    const entries = Object.entries(p.judgements as Record<string, unknown>);
    if (entries.length > 24) return "shape.judgements has too many entries";
    for (const [k, v] of entries) {
      if (!/^[a-z0-9_-]{1,40}$/i.test(k)) return `shape.judgements has a bad key`;
      if (v !== "found" && v !== "imposed") return `shape.judgements values must be found or imposed`;
    }
    if (!isIntIn(p?.controlsAccepted, 0, 8)) return "shape.controlsAccepted must be an integer";
    if (!isIntIn(p?.realRejected, 0, 8)) return "shape.realRejected must be an integer";
    return null;
  },

  /** The character lab: the reading held at each item, and what was done with it. */
  versions: (p) => {
    if (!Array.isArray(p?.steps) || p.steps.length > 16) return "versions.steps must be a short array";
    for (const s of p.steps) {
      if (!/^[a-z0-9_-]{1,40}$/i.test(String(s?.itemId ?? ""))) return "versions step has a bad itemId";
      if (!/^[a-z0-9_-]{1,40}$/i.test(String(s?.reading ?? ""))) return "versions step has a bad reading";
      if (!["fits", "complicates", "breaks"].includes(String(s?.stance)))
        return "versions step has a bad stance";
    }
    if (!isIntIn(p?.switches, 0, 16)) return "versions.switches must be an integer";
    if (!isIntIn(p?.accommodations, 0, 16)) return "versions.accommodations must be an integer";
    if (typeof p?.survived !== "boolean") return "versions.survived must be a boolean";
    return null;
  },

  /** Which explanation was chosen in each case, and the criterion that implies. */
  criteria: (p) => {
    if (typeof p?.picks !== "object" || p.picks === null) return "criteria.picks must be an object";
    const entries = Object.entries(p.picks as Record<string, unknown>);
    if (entries.length > 8) return "criteria.picks has too many entries";
    for (const [k, v] of entries) {
      if (!/^[a-z0-9_-]{1,40}$/i.test(k) || !/^[a-z0-9_-]{1,40}$/i.test(String(v)))
        return "criteria.picks has a bad entry";
    }
    if (!isIdList(p?.properties, 8)) return "criteria.properties must be a list of property ids";
    if (typeof p?.consistent !== "boolean") return "criteria.consistent must be a boolean";
    return null;
  },

  /** Which premises were opened, and which module. */
  rewrite: (p) => {
    if (!/^[a-z0-9_-]{1,40}$/i.test(String(p?.module ?? ""))) return "rewrite.module is required";
    if (!isIdList(p?.premisesOpened, 12)) return "rewrite.premisesOpened must be a list of ids";
    if (!isIntIn(p?.dwellMs, 0, 1000 * 60 * 60)) return "rewrite.dwellMs must be an integer";
    return null;
  },

  /** Which nodes were opened on the map, in order. */
  map: (p) => {
    if (!isIdList(p?.opened, 40)) return "map.opened must be a list of node ids";
    return null;
  },
};

export function validateTrace(
  instrument: string,
  payload: unknown,
): { ok: true; clean: Record<string, unknown> } | { ok: false; error: string } {
  const check = SCHEMAS[instrument as Instrument];
  if (!check) return { ok: false, error: `unknown instrument '${instrument}'` };
  if (typeof payload !== "object" || payload === null) return { ok: false, error: "payload must be an object" };
  if (JSON.stringify(payload).length > 8000) return { ok: false, error: "payload too large" };

  const err = check(payload);
  if (err) return { ok: false, error: err };

  const allowed = ALLOWED[instrument as Instrument];
  const clean: Record<string, unknown> = {};
  for (const k of allowed) {
    if (!(k in (payload as Record<string, unknown>))) continue;
    const v = (payload as Record<string, unknown>)[k];
    clean[k] =
      k === "steps" && Array.isArray(v)
        ? v.map((step: any) => Object.fromEntries(STEP_KEYS.map((sk) => [sk, step?.[sk]])))
        : v;
  }
  return { ok: true, clean };
}

export const INSTRUMENTS = Object.keys(SCHEMAS) as Instrument[];
