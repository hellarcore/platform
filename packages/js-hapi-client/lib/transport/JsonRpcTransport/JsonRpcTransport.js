const logger = require('../../logger');

const MaxRetriesReachedError = require('../errors/response/MaxRetriesReachedError');
const NoAvailableAddressesForRetryError = require('../errors/response/NoAvailableAddressesForRetryError');
const NoAvailableAddressesError = require('../errors/NoAvailableAddressesError');
const RetriableResponseError = require('../errors/response/RetriableResponseError');

class JsonRpcTransport {
  /**
   * @param {createHAPIAddressProviderFromOptions} createHAPIAddressProviderFromOptions
   * @param {requestJsonRpc} requestJsonRpc
   * @param {
   *    ListHAPIAddressProvider|
   *    SimplifiedMasternodeListHAPIAddressProvider|
   *    HAPIAddressProvider
   * } hapiAddressProvider
   * @param {createJsonTransportError} createJsonTransportError
   * @param {HAPIClientOptions} globalOptions
   */
  constructor(
    createHAPIAddressProviderFromOptions,
    requestJsonRpc,
    hapiAddressProvider,
    createJsonTransportError,
    globalOptions,
  ) {
    this.createHAPIAddressProviderFromOptions = createHAPIAddressProviderFromOptions;
    this.requestJsonRpc = requestJsonRpc;
    this.hapiAddressProvider = hapiAddressProvider;
    this.globalOptions = globalOptions;

    this.createJsonTransportError = createJsonTransportError;

    this.logger = logger.getForId(globalOptions.loggerOptions.identifier);

    this.lastUsedAddress = null;
  }

  /**
   * Make request to HAPI node
   * @param {string} method
   * @param {object} [params]
   * @param {HAPIClientOptions} [options]
   * @returns {Promise<object>}
   */
  async request(method, params = {}, options = {}) {
    const hapiAddressProvider = this.createHAPIAddressProviderFromOptions(options)
      || this.hapiAddressProvider;

    const address = await hapiAddressProvider.getLiveAddress();

    if (!address) {
      throw new NoAvailableAddressesError();
    }

    // eslint-disable-next-line no-param-reassign
    options = {
      retries: this.globalOptions.retries,
      timeout: this.globalOptions.timeout,
      ...options,
    };

    const requestOptions = {};
    if (options.timeout !== undefined) {
      requestOptions.timeout = options.timeout;
    }

    this.logger.debug(`JSON-RPC Request ${method} to ${address.toString()}`, { options });

    try {
      const result = await this.requestJsonRpc(
        address.getProtocol(),
        address.getHost(),
        address.getPort(),
        address.isSelfSignedCertificateAllowed(),
        method,
        params,
        requestOptions,
      );

      this.lastUsedAddress = address;

      address.markAsLive();

      return result;
    } catch (error) {
      this.lastUsedAddress = address;

      if (error.code === undefined) {
        throw error;
      }

      const responseError = this.createJsonTransportError(error, address);

      if (!(responseError instanceof RetriableResponseError)) {
        throw responseError;
      }

      address.markAsBanned();

      if (options.retries === 0) {
        throw new MaxRetriesReachedError(responseError);
      }

      const hasAddresses = await hapiAddressProvider.hasLiveAddresses();
      if (!hasAddresses) {
        throw new NoAvailableAddressesForRetryError(responseError);
      }

      return this.request(
        method,
        params,
        {
          ...options,
          retries: options.retries - 1,
        },
      );
    }
  }

  /**
   * Get last used address
   * @returns {HAPIAddress|null}
   */
  getLastUsedAddress() {
    return this.lastUsedAddress;
  }
}

module.exports = JsonRpcTransport;
