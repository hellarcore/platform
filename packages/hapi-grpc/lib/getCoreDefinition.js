const path = require('path');

const { loadPackageDefinition } = require('@hellarpro/grpc-common');

function getCoreDefinition(version) {
  const protoPath = path.join(__dirname, `../protos/core/v${version}/core.proto`);

  return loadPackageDefinition(protoPath, `org.hellar.platform.hapi.v${version}.Core`);
}

module.exports = getCoreDefinition;
