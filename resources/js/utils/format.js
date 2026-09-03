/**
 * Currency formatter — South African Rand.
 * Output: "R 1 250,00"  (en-ZA: space as thousands sep, comma as decimal)
 *
 * Single Intl.NumberFormat instance created once for performance.
 */
const zarFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/**
 * Format a number as ZAR with the R prefix.
 * formatZAR(1250)    → "R 1 250,00"
 * formatZAR(0)       → "R 0,00"
 * formatZAR(null)    → "R 0,00"
 */
export function formatZAR(amount) {
    return 'R\u00A0' + zarFormatter.format(Number(amount) || 0);
}

/**
 * Same, but returns just the numeric part without the R prefix.
 * Useful when the R is rendered separately (e.g. in a styled span).
 */
export function formatZARNumber(amount) {
    return zarFormatter.format(Number(amount) || 0);
}
