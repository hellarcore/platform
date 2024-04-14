const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const lohellarGet = require('lohellar/get');

/**
 * Load GRPC package definition
 *
 * @param {string} protoPath
 * @param {string} [namespace]
 *
 * @return {*}
 */
function loadPackageDefinition(protoPath, namespace = undefined) {
  const definition = protoLoader.loadSync(protoPath, {
    keepCase: false,
    longs: String,
    enums: String,
    bytes: Uint8Array,
    defaults: true,
  });

  const packageDefinition = grpc.loadPackageDefinition(definition);

  if (namespace) {
    return lohellarGet(packageDefinition, namespace);
  }

  return packageDefinition;
}

module.exports = loadPackageDefinition;
