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
 * Optional fields must tolerate absence as well as null. An earlier version
 * compared against null only, so a payload that simply omitted an optional key
 * failed validation with a message about the string "undefined".
 */
const absent = (v: unknown): boolean => v === null || v === undefined;
const optionalId = (v: unknown): boolean => absent(v) || /^[a-z0-9_-]{1,40}$/i.test(String(v));
const optionalInt = (v: unknown, lo: number, hi: number): boolean =>
  absent(v) || (typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi);
const optionalBool = (v: unknown): boolean => absent(v) || typeof v === "boolean";

/**
 * The keys each instrument may persist. Anything outside this list is dropped
 * before writing — validating known fields is not enough, because an unknown
 * field would sail through and could carry arbitrary text. The site says it never
 * stores anything you typed; this is what makes that true rather than intended.
 */
const ALLOWED: Record<Instrument, string[]> = {
  entry: ["path", "changes", "confidence", "completed", "reasoning"],
  character: ["assumptions", "switches"],
  shape: ["judgements", "controlsAccepted", "realRejected", "reasoning"],
  versions: ["steps", "switches", "accommodations", "survived", "prediction", "predictionHeld", "reasoning"],
  criteria: ["picks", "properties", "consistent", "reasoning"],
  rewrite: ["module", "premisesOpened", "dwellMs"],
  map: ["opened"],
  discriminate: [
    "caseId",
    "preferred",
    "preferenceCriterion",
    "prediction",
    "predictionConfidence",
    "proposedTestId",
    "proposedTestIsDiscriminating",
    "afterOutcome",
    "revised",
    "reasoning",
  ],
  category: ["caseId", "assignments", "anomalyResponse", "createdCategory", "reasoning"],
};

/** Per-item key whitelist for the one payload that contains objects in an array. */
const STEP_KEYS = ["itemId", "reading", "stance"];

/**
 * Free-text reasoning.
 *
 * This site used to store nothing typed, and said so. That was the wrong call:
 * *why* someone answered is more informative than what they answered, and no
 * closed vocabulary recovers it. So reasoning is now collected — optional,
 * capped, labelled at the point of entry, and never required.
 *
 * The cap is a real control, not a formality: 600 characters is enough for a
 * reason and too short for a confession. Control characters are stripped, and the
 * field is the only place on the site where a participant's own words are kept.
 */
export const REASONING_MAX = 600;

function cleanReasoning(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v !== "string") return null;
  // eslint-disable-next-line no-control-regex
  const stripped = v.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  return stripped.length === 0 ? null : stripped.slice(0, REASONING_MAX);
}

const isReasoning = (v: unknown): boolean =>
  v === null || v === undefined || (typeof v === "string" && v.length <= REASONING_MAX * 2);

const isIdList = (v: unknown, max: number): boolean =>
  Array.isArray(v) && v.length <= max && v.every((x) => typeof x === "string" && /^[a-z0-9_-]{1,40}$/i.test(x));

const isIntIn = (v: unknown, lo: number, hi: number): boolean =>
  typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi;

export const SCHEMAS: Record<Instrument, Check> = {
  /**
   * The "Sure." reading: which of five at each stage, plus confidence in the
   * first commitment. Index 0 is the reading taken on the word alone.
   */
  entry: (p) => {
    if (!isIdList(p?.path, 8)) return "entry.path must be a short list of reading ids";
    if (p.path.length < 1) return "entry.path is empty";
    if (!isIntIn(p?.changes, 0, 8)) return "entry.changes must be an integer";
    if (!optionalInt(p?.confidence, 0, 100)) return "entry.confidence must be null or 0-100";
    if (typeof p?.completed !== "boolean") return "entry.completed must be a boolean";
    if (!isReasoning(p?.reasoning)) return "entry.reasoning is too long";
    return null;
  },

  /** The character hook: which assumptions about Draco were tried, in order. */
  character: (p) => {
    if (!isIdList(p?.assumptions, 12)) return "character.assumptions must be a short list of ids";
    if (p.assumptions.length < 1) return "character.assumptions is empty";
    if (!isIntIn(p?.switches, 0, 12)) return "character.switches must be an integer";
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
    if (!isReasoning(p?.reasoning)) return "shape.reasoning is too long";
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
    if (!optionalId(p?.prediction)) return "versions.prediction must be an outcome id or null";
    if (!optionalBool(p?.predictionHeld)) return "versions.predictionHeld must be null or a boolean";
    if (!isReasoning(p?.reasoning)) return "versions.reasoning is too long";
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
    if (!isReasoning(p?.reasoning)) return "criteria.reasoning is too long";
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

  /**
   * The justification instrument. Records the whole arc: which model was
   * preferred and on what criterion, what was predicted, which test was proposed
   * to tell the models apart, whether that test actually discriminates, and
   * whether the outcome moved them.
   */
  discriminate: (p) => {
    if (!/^[a-z0-9_-]{1,40}$/i.test(String(p?.caseId ?? ""))) return "discriminate.caseId is required";
    if (!/^[a-z0-9_-]{1,40}$/i.test(String(p?.preferred ?? ""))) return "discriminate.preferred is required";
    if (!optionalId(p?.preferenceCriterion)) return "discriminate.preferenceCriterion must be an id or null";
    if (!optionalId(p?.prediction)) return "discriminate.prediction must be an outcome id or null";
    if (!optionalInt(p?.predictionConfidence, 0, 100))
      return "discriminate.predictionConfidence must be null or 0-100";
    if (!optionalId(p?.proposedTestId)) return "discriminate.proposedTestId must be a test id or null";
    if (!optionalBool(p?.proposedTestIsDiscriminating))
      return "discriminate.proposedTestIsDiscriminating must be null or a boolean";
    if (!optionalBool(p?.revised)) return "discriminate.revised must be null or a boolean";
    if (!isReasoning(p?.reasoning)) return "discriminate.reasoning is too long";
    return null;
  },

  /** The category-failure task: where the anomaly was put, and what was done about it. */
  category: (p) => {
    if (!/^[a-z0-9_-]{1,40}$/i.test(String(p?.caseId ?? ""))) return "category.caseId is required";
    if (typeof p?.assignments !== "object" || p.assignments === null)
      return "category.assignments must be an object";
    const entries = Object.entries(p.assignments as Record<string, unknown>);
    if (entries.length > 24) return "category.assignments has too many entries";
    for (const [k, v] of entries) {
      if (!/^[a-z0-9_-]{1,40}$/i.test(k) || !/^[a-z0-9_-]{1,40}$/i.test(String(v)))
        return "category.assignments has a bad entry";
    }
    if (!["keep", "stretch", "new", "reject"].includes(String(p?.anomalyResponse)))
      return "category.anomalyResponse must be keep, stretch, new or reject";
    if (!isReasoning(p?.createdCategory)) return "category.createdCategory is too long";
    if (!isReasoning(p?.reasoning)) return "category.reasoning is too long";
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
  if (JSON.stringify(payload).length > 12000) return { ok: false, error: "payload too large" };

  const err = check(payload);
  if (err) return { ok: false, error: err };

  const allowed = ALLOWED[instrument as Instrument];
  const clean: Record<string, unknown> = {};
  for (const k of allowed) {
    if (!(k in (payload as Record<string, unknown>))) continue;
    const v = (payload as Record<string, unknown>)[k];
    if (k === "steps" && Array.isArray(v)) {
      clean[k] = v.map((step: any) => Object.fromEntries(STEP_KEYS.map((sk) => [sk, step?.[sk]])));
    } else if (k === "reasoning" || k === "createdCategory") {
      clean[k] = cleanReasoning(v);
    } else {
      clean[k] = v;
    }
  }
  return { ok: true, clean };
}

export const INSTRUMENTS = Object.keys(SCHEMAS) as Instrument[];
