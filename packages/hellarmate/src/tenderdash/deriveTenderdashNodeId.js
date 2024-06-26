import crypto from 'crypto';

/**
 * @typedef deriveTenderhellarNodeId
 * @param {string} nodeKey
 * @returns {string}
 */
export default function deriveTenderhellarNodeId(nodeKey) {
  const nodeKeyBuffer = Buffer.from(nodeKey, 'base64');

  const publicKey = nodeKeyBuffer.slice(32);

  return crypto.createHash('sha256')
    .update(publicKey)
    .digest('hex')
    .slice(0, 40);
}
