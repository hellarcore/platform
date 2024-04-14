import validateTenderhellarNodeKey from './validators/validateTenderhellarNodeKey.js';
import generateTenderhellarNodeKey from '../../tenderhellar/generateTenderhellarNodeKey.js';

/**
 * @param {Object} [options]
 * @param {string} [options.initial]
 * @returns {Object}
 */
export default function createPlatformNodeKeyInput(options = {}) {
  let { initial } = options;
  if (initial === null || initial === undefined) {
    initial = generateTenderhellarNodeKey();
  }

  return {
    type: 'input',
    name: 'platformNodeKey',
    header: `  Hellarmate needs to collect details on your Tenderhellar node key.

  This key is used to uniquely identify your Hellar Platform node. The node key is
  derived from a standard Ed25519 cryptographic key pair, presented in a cached
  format specific to Tenderhellar. You can provide a key, or a new key will be
  automatically generated for you.\n`,
    message: 'Enter Ed25519 node key',
    hint: 'Base64 encoded',
    initial,
    validate: validateTenderhellarNodeKey,
  };
}
