const { Metadata } = require('@grpc/grpc-js/build/src/metadata');
const CorePromiseClient = require('./clients/core/v0/nodejs/CorePromiseClient');
const PlatformPromiseClient = require('./clients/platform/v0/nodejs/PlatformPromiseClient');

const protocCoreMessages = require('./clients/core/v0/nodejs/core_protoc');
const protocPlatformMessages = require('./clients/platform/v0/nodejs/platform_protoc');

const getCoreDefinition = require('./lib/getCoreDefinition');
const getPlatformDefinition = require('./lib/getPlatformDefinition');
const parseMetadata = require('./lib/utils/parseMetadata');

const {
  org: {
    hellar: {
      platform: {
        hapi: {
          v0: pbjsCoreMessages,
        },
      },
    },
  },
} = require('./clients/core/v0/nodejs/core_pbjs');

const {
  org: {
    hellar: {
      platform: {
        hapi: {
          v0: pbjsPlatformMessages,
        },
      },
    },
  },
} = require('./clients/platform/v0/nodejs/platform_pbjs');

module.exports = {
  getCoreDefinition,
  getPlatformDefinition,
  v0: {
    CorePromiseClient,
    PlatformPromiseClient,
    pbjs: {

      ...pbjsCoreMessages,
      ...pbjsPlatformMessages,
    },
    ...protocCoreMessages,
    ...protocPlatformMessages,
  },
  parseMetadata,
  Metadata,
};
