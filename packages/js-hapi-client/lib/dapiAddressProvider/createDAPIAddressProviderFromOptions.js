const networks = require('@hellarpro/hellarcore-lib/lib/networks');

const HAPIAddress = require('./HAPIAddress');

const ListHAPIAddressProvider = require('./ListHAPIAddressProvider');

const SimplifiedMasternodeListProvider = require('../SimplifiedMasternodeListProvider/SimplifiedMasternodeListProvider');
const SimplifiedMasternodeListHAPIAddressProvider = require('./SimplifiedMasternodeListHAPIAddressProvider');

const JsonRpcTransport = require('../transport/JsonRpcTransport/JsonRpcTransport');
const requestJsonRpc = require('../transport/JsonRpcTransport/requestJsonRpc');
const createJsonTransportError = require('../transport/JsonRpcTransport/createJsonTransportError');

const HAPIClientError = require('../errors/HAPIClientError');

const networkConfigs = require('../networkConfigs');

/**
 * @typedef {createHAPIAddressProviderFromOptions}
 * @param {HAPIClientOptions} options
 * @returns {
 *    HAPIAddressProvider|
 *    ListHAPIAddressProvider|
 *    SimplifiedMasternodeListHAPIAddressProvider|
 *    null
 * }
 */
function createHAPIAddressProviderFromOptions(options) {
  if (options.network && !networks.get(options.network)) {
    throw new HAPIClientError(`Invalid network '${options.network}'`);
  }

  if (options.hapiAddressProvider) {
    if (options.hapiAddresses) {
      throw new HAPIClientError("Can't use 'hapiAddresses' with 'hapiAddressProvider' option");
    }

    if (options.seeds) {
      throw new HAPIClientError("Can't use 'seeds' with 'hapiAddressProvider' option");
    }

    if (options.hapiAddressesWhiteList) {
      throw new HAPIClientError("Can't use 'hapiAddressesWhiteList' with 'hapiAddressProvider' option");
    }

    return options.hapiAddressProvider;
  }

  if (options.hapiAddresses) {
    if (options.seeds) {
      throw new HAPIClientError("Can't use 'seeds' with 'hapiAddresses' option");
    }

    if (options.hapiAddressesWhiteList) {
      throw new HAPIClientError("Can't use 'hapiAddressesWhiteList' with 'hapiAddresses' option");
    }

    return new ListHAPIAddressProvider(
      options.hapiAddresses.map((rawAddress) => new HAPIAddress(rawAddress)),
      options,
    );
  }

  if (options.seeds) {
    let hapiAddressesWhiteList = options.hapiAddressesWhiteList || [];

    // Since we don't have PoSe atm, 3rd party masternodes sometimes provide wrong data
    // that breaks test suite and application logic. Temporary solution is to hardcode
    // reliable DCG testnet masternodes to connect. Should be removed when PoSe is introduced.
    const network = networks.get(options.network);
    let isRegtest = false;
    if (network) {
      isRegtest = network.regtestEnabled;
    }

    if (options.network === 'testnet' && hapiAddressesWhiteList.length === 0 && !isRegtest) {
      hapiAddressesWhiteList = networkConfigs.testnet.hapiAddressesWhiteList;
    }

    const listHAPIAddressProvider = new ListHAPIAddressProvider(
      options.seeds.map((rawAddress) => new HAPIAddress(rawAddress)),
      options,
    );

    const jsonRpcTransport = new JsonRpcTransport(
      createHAPIAddressProviderFromOptions,
      requestJsonRpc,
      listHAPIAddressProvider,
      createJsonTransportError,
      options,
    );

    const smlProvider = new SimplifiedMasternodeListProvider(
      jsonRpcTransport,
      { network: options.network },
    );

    return new SimplifiedMasternodeListHAPIAddressProvider(
      smlProvider,
      listHAPIAddressProvider,
      hapiAddressesWhiteList.map((rawAddress) => new HAPIAddress(rawAddress)),
    );
  }

  if (options.network) {
    if (!networkConfigs[options.network]) {
      throw new HAPIClientError(`There is no connection config for network '${options.network}'`);
    }

    const networkConfig = { ...options, ...networkConfigs[options.network] };

    return createHAPIAddressProviderFromOptions(networkConfig);
  }

  return null;
}

module.exports = createHAPIAddressProviderFromOptions;
