"use client";

/**
 * Anonymous session identity.
 *
 * A random identifier in localStorage, and nothing else. It exists so that one
 * person's several responses can be recognised as one person's during analysis. It
 * is not a login, it is not linked to anything, it is never sent anywhere except with
 * a response the participant chose to submit, and clearing site data destroys it
 * permanently — there is no server-side record that could restore it.
 */

const KEY = "cap.session";

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing) return existing;
    const id = `s_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
    window.localStorage.setItem(KEY, id);
    return id;
  } catch {
    // Private mode, or storage disabled. A per-page-load id still lets a single
    // trajectory cohere; it just will not persist, which is fine.
    return `s_eph_${Math.random().toString(36).slice(2, 12)}`;
  }
}

export function forgetSession() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to forget */
  }
}
