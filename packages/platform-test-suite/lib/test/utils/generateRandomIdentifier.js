const crypto = require('crypto');
const Hellar = require('hellar');

const { Platform } = Hellar;

/**
 * Generate random identity ID
 *
 * @return {Identifier}
 */
async function generateRandomIdentifier() {
  const { Identifier } = await Platform.initializeDppModule();
  return new Identifier(crypto.randomBytes(32));
}

module.exports = generateRandomIdentifier;
