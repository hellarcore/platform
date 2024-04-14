import crypto from 'crypto';

/**
 * @typedef generateTenderhellarNodeKey
 * @returns {string}
 */
export default function generateTenderhellarNodeKey() {
  const {
    privateKey,
    publicKey,
  } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: {
      type: 'spki',
      format: 'der',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'der',
    },
  });

  const nodeKey = Buffer.concat([privateKey.slice(16), publicKey.slice(12)]);

  return nodeKey.toString('base64');
}
