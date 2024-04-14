const Hellar = require('hellar');

const clone = require('lohellar/clone');

const fundWallet = require('@hellarpro/wallet-lib/src/utils/fundWallet');

/**
 * Create and fund HellarJS client
 *
 * @param {number} amount
 * @param {Object} config
 * @param {{host: string, port: string}[]} config.seeds
 * @param {string} config.network
 * @param {string} config.faucetPrivateKey
 * @param {number} [config.skipSyncBeforeHeight]
 *
 * @returns {Promise<Client>}
 */
async function createClientWithFundedWallet(amount, config) {
  let walletOptions = {
    waitForInstantLockTimeout: 120000,
  };

  if (config.skipSyncBeforeHeight) {
    walletOptions.unsafeOptions = {
      skipSynchronizationBeforeHeight: config.skipSyncBeforeHeight,
    };
  }

  const clientOpts = {
    seeds: config.seeds,
    network: config.network,
    wallet: walletOptions,
  };

  const faucetClient = new Hellar.Client({
    ...clientOpts,
    wallet: {
      ...walletOptions,
      privateKey: config.faucetPrivateKey,
    },
  });

  walletOptions = clone(walletOptions);

  const client = new Hellar.Client({
    ...clientOpts,
    wallet: walletOptions,
  });

  await fundWallet(faucetClient.wallet, client.wallet, amount);

  await faucetClient.disconnect();

  return client;
}

module.exports = createClientWithFundedWallet;
