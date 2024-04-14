const SATOSHI_MULTIPLIER = 10 ** 8;

/**
 * Convert satoshis to Hellar
 *
 * @param {number} satoshi
 *
 * @returns {number}
 */
export function toHellar(satoshi) {
  return satoshi / SATOSHI_MULTIPLIER;
}

/**
 * Convert hellar to satoshis
 *
 * @param {number} hellar
 *
 * @return {number}
 */
export function toSatoshi(hellar) {
  return hellar * SATOSHI_MULTIPLIER;
}
