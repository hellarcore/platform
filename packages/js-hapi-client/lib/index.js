require('../polyfills/fetch-polyfill');

const HAPIClient = require('./HAPIClient');

const NotFoundError = require('./transport/GrpcTransport/errors/NotFoundError');
const BlockHeadersProvider = require('./BlockHeadersProvider/BlockHeadersProvider');

HAPIClient.Errors = {
  NotFoundError,
};

HAPIClient.BlockHeadersProvider = BlockHeadersProvider;

module.exports = HAPIClient;
