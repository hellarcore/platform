const Hellar = require('hellar');

let storageAdapter;

if (typeof window === 'undefined') {
  // eslint-disable-next-line global-require
  const { NodeForage } = require('nodeforage');
  storageAdapter = new NodeForage({
    dir: process.env.FAUCET_WALLET_STORAGE_DIR || process.cwd(),
    name: `faucet-wallet-${process.env.FAUCET_ADDRESS}`,
  });
} else {
  // eslint-disable-next-line global-require
  storageAdapter = require('localforage');
}

const { contractId } = require('@hellarpro/hpns-contract/lib/systemIds');

const getHAPISeeds = require('./getHAPISeeds');

let faucetClient;

function createFaucetClient() {
  const seeds = getHAPISeeds();

  const clientOpts = {
    seeds,
    network: process.env.NETWORK,
    apps: {
      hpns: {
        contractId,
      },
    },
  };

  const walletOptions = {
    privateKey: process.env.FAUCET_PRIVATE_KEY,
  };

  if (process.env.FAUCET_WALLET_USE_STORAGE === 'true') {
    walletOptions.adapter = storageAdapter;
  }

  if (process.env.SKIP_SYNC_BEFORE_HEIGHT) {
    walletOptions.unsafeOptions = {
      skipSynchronizationBeforeHeight: process.env.SKIP_SYNC_BEFORE_HEIGHT,
    };
  }

  faucetClient = new Hellar.Client({
    ...clientOpts,
    wallet: walletOptions,
  });

  return faucetClient;
}

module.exports = createFaucetClient;
