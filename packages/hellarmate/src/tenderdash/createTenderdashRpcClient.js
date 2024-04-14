import jayson from 'jayson/promise/index.js';

/**
 * Create Tenderhellar RPC client
 *
 * @param {Object} [options]
 * @param {string} [options.host]
 * @param {number} [options.port]
 */
export default function createTenderhellarRpcClient({ host, port } = {}) {
  return jayson.client.http({
    host: host || '127.0.0.1',
    port: port || 26657,
  });
}
