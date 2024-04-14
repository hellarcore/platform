const EventEmitter = require('events');

const GrpcTransport = require('./transport/GrpcTransport/GrpcTransport');
const JsonRpcTransport = require('./transport/JsonRpcTransport/JsonRpcTransport');

const CoreMethodsFacade = require('./methods/core/CoreMethodsFacade');
const PlatformMethodsFacade = require('./methods/platform/PlatformMethodsFacade');

const createHAPIAddressProviderFromOptions = require('./hapiAddressProvider/createHAPIAddressProviderFromOptions');
const requestJsonRpc = require('./transport/JsonRpcTransport/requestJsonRpc');
const createGrpcTransportError = require('./transport/GrpcTransport/createGrpcTransportError');
const createJsonTransportError = require('./transport/JsonRpcTransport/createJsonTransportError');

const BlockHeadersProvider = require('./BlockHeadersProvider/BlockHeadersProvider');
const createBlockHeadersProviderFromOptions = require('./BlockHeadersProvider/createBlockHeadersProviderFromOptions');

const logger = require('./logger');

const EVENTS = {
  ERROR: 'error',
};

class HAPIClient extends EventEmitter {
  /**
   * @param {HAPIClientOptions} [options]
   */
  constructor(options = {}) {
    super();

    this.options = {
      network: 'testnet',
      timeout: 10000,
      retries: 5,
      blockHeadersProviderOptions: BlockHeadersProvider.defaultOptions,
      loggerOptions: {
        identifier: '',
      },
      ...options,
    };

    this.hapiAddressProvider = createHAPIAddressProviderFromOptions(this.options);

    const grpcTransport = new GrpcTransport(
      createHAPIAddressProviderFromOptions,
      this.hapiAddressProvider,
      createGrpcTransportError,
      this.options,
    );

    const jsonRpcTransport = new JsonRpcTransport(
      createHAPIAddressProviderFromOptions,
      requestJsonRpc,
      this.hapiAddressProvider,
      createJsonTransportError,
      this.options,
    );

    this.core = new CoreMethodsFacade(jsonRpcTransport, grpcTransport);
    this.platform = new PlatformMethodsFacade(grpcTransport);
    this.logger = logger.getForId(this.options.loggerOptions.identifier);

    this.initBlockHeadersProvider();
  }

  /**
   * @private
   */
  initBlockHeadersProvider() {
    this.blockHeadersProvider = createBlockHeadersProviderFromOptions(this.options, this.core);

    this.blockHeadersProvider.on(BlockHeadersProvider.EVENTS.ERROR, (e) => {
      this.emit(EVENTS.ERROR, e);
    });
  }
}

HAPIClient.EVENTS = EVENTS;

/**
 * @typedef {HAPIClientOptions} HAPIClientOptions
 * @property {HAPIAddressProvider} [hapiAddressProvider]
 * @property {Array<RawHAPIAddress|HAPIAddress|string>} [hapiAddresses]
 * @property {Array<RawHAPIAddress|HAPIAddress|string>} [seeds]
 * @property {Array<RawHAPIAddress|HAPIAddress|string>} [hapiAddressesWhiteList]
 * @property {string|Network} [network=testnet]
 * @property {number} [timeout=2000]
 * @property {number} [retries=3]
 * @property {number} [baseBanTime=60000]
 * @property {boolean} [throwDeadlineExceeded]
 * @property {object} [loggerOptions]
 * @property {string} [loggerOptions.identifier]
 * @property {BlockHeadersProvider} [blockHeadersProvider]
 * @property {BlockHeadersProviderOptions} [blockHeadersProviderOptions]
 */

module.exports = HAPIClient;
