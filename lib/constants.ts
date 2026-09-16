/**
 * Minimum responses before any aggregate is displayed.
 *
 * Two reasons, both real: below this a group mean is barely distinguishable from a
 * single person's answer, and a chart drawn from three responses invites exactly the
 * over-reading this project is trying to avoid.
 */
export const MIN_N_FOR_AGGREGATE = 5;
