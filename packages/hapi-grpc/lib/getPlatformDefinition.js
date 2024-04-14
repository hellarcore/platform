const path = require('path');

const { loadPackageDefinition } = require('@hellarpro/grpc-common');

function getPlatformDefinition(version) {
  const protoPath = path.join(__dirname, `../protos/platform/v${version}/platform.proto`);

  return loadPackageDefinition(protoPath, `org.hellar.platform.hapi.v${version}.Platform`);
}

module.exports = getPlatformDefinition;
