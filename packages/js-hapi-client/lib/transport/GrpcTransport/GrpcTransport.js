const logger = require('../../logger');

const MaxRetriesReachedError = require('../errors/response/MaxRetriesReachedError');
const NoAvailableAddressesForRetryError = require('../errors/response/NoAvailableAddressesForRetryError');
const NoAvailableAddressesError = require('../errors/NoAvailableAddressesError');
const TimeoutError = require('./errors/TimeoutError');
const RetriableResponseError = require('../errors/response/RetriableResponseError');

class GrpcTransport {
  /**
   * @param {createHAPIAddressProviderFromOptions} createHAPIAddressProviderFromOptions
   * @param {
   *    ListHAPIAddressProvider|
   *    SimplifiedMasternodeListHAPIAddressProvider|
   *    HAPIAddressProvider
   * } hapiAddressProvider
   * @param {createGrpcTransportError} createGrpcTransportError
   * @param {HAPIClientOptions} globalOptions
   */
  constructor(
    createHAPIAddressProviderFromOptions,
    hapiAddressProvider,
    createGrpcTransportError,
    globalOptions,
  ) {
    this.createHAPIAddressProviderFromOptions = createHAPIAddressProviderFromOptions;
    this.hapiAddressProvider = hapiAddressProvider;
    this.createGrpcTransportError = createGrpcTransportError;
    this.globalOptions = globalOptions;

    this.lastUsedAddress = null;
    this.logger = logger.getForId(globalOptions.loggerOptions.identifier);
  }

  /**
   * Make request to HAPI node
   * @param {Function} ClientClass
   * @param {string} method
   * @param {object} requestMessage
   * @param {HAPIClientOptions} [options]
   * @returns {Promise<object>}
   */
  async request(ClientClass, method, requestMessage, options = { }) {
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

    const url = this.makeGrpcUrlFromAddress(address);
    const client = new ClientClass(url);

    const requestOptions = {};
    if (options.timeout !== undefined) {
      requestOptions.deadline = new Date();
      requestOptions.deadline.setMilliseconds(
        requestOptions.deadline.getMilliseconds() + options.timeout,
      );
    }

    this.logger.debug(`GRPC Request ${method} to ${address.toString()}`, { options });

    try {
      const result = await client[method](requestMessage, {}, requestOptions);

      this.lastUsedAddress = address;

      address.markAsLive();

      return result;
    } catch (error) {
      this.lastUsedAddress = address;

      this.logger.error(`GRPC Request ${method} to ${address.toString()} failed with error: ${error.message}`);

      // for unknown errors
      if (error.code === undefined) {
        throw error;
      }

      const responseError = await this.createGrpcTransportError(error, address);

      if (!(responseError instanceof RetriableResponseError)) {
        throw responseError;
      }

      if (options.throwDeadlineExceeded && responseError instanceof TimeoutError) {
        throw responseError;
      }

      if (options.retries === 0) {
        throw new MaxRetriesReachedError(responseError);
      }

      const hasAddresses = await hapiAddressProvider.hasLiveAddresses();
      if (!hasAddresses) {
        throw new NoAvailableAddressesForRetryError(responseError);
      }

      return this.request(
        ClientClass,
        method,
        requestMessage,
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

  /**
   *
   *Get gRPC url string
   * @private
   * @param {HAPIAddress} address
   * @returns {string}
   */
  makeGrpcUrlFromAddress(address) {
    let protocol = address.getProtocol();
    // For NodeJS Client
    if (typeof process !== 'undefined'
      && process.versions != null
      && process.versions.node != null
      && address.isSelfSignedCertificateAllowed()) {
      protocol = 'http';
    }

    return `${protocol}://${address.getHost()}:${address.getPort()}`;
  }
}

module.exports = GrpcTransport;
