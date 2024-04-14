const Hellar = require('hellar');

const { contractId } = require('@hellarpro/hpns-contract/lib/systemIds');

const getHAPISeeds = require('./getHAPISeeds');

function createClientWithoutWallet() {
  return new Hellar.Client({
    seeds: getHAPISeeds(),
    network: process.env.NETWORK,
    timeout: 25000,
    apps: {
      hpns: {
        contractId,
      },
    },
  });
}

module.exports = createClientWithoutWallet;
