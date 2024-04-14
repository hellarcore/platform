const HAPIClient = require('@hellarpro/hapi-client');

const _ = require('lohellar');

const HAPIClientTransport = require('./HAPIClientTransport/HAPIClientTransport');

/**
 *
 * @param {HAPIClientOptions|Transport|HAPIClientTransport} options
 * @returns {Transport|HAPIClientTransport}
 */
function createTransportFromOptions(options) {
  if (!_.isPlainObject(options)) {
    // Return transport instance
    return options;
  }

  const client = new HAPIClient(options);

  return new HAPIClientTransport(client);
}

module.exports = createTransportFromOptions;
