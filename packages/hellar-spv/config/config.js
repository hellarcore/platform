const HellarUtil = require('@hellarpro/hellar-util');
const utils = require('../lib/utils');

module.exports = {
  getLowDiffGenesis() {
    // Custom genesis to test with lower difficulty
    return utils.normalizeHeader({
      version: 1,
      previousblockhash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleroot: HellarUtil.nullHash.toString('hex'),
      time: 1504510163,
      bits: '1fffffff',
      nonce: 2307,
    });
  },
  getTestnetGenesis() {
    // Custom genesis to test with lower difficulty
    return utils.normalizeHeader({
      version: 1,
      previousblockhash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleroot: 'e0028eb9648db56b1ac77cf090b99048a8007e2bb64b68f092c03c7f56a662c7',
      time: 1390666206,
      bits: '1e0ffff0',
      nonce: 3861367235,
    });
  },
  getDevnetGenesis() {
    // Custom genesis to test with lower difficulty
    return utils.normalizeHeader({
      version: 1,
      previousblockhash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleroot: 'e0028eb9648db56b1ac77cf090b99048a8007e2bb64b68f092c03c7f56a662c7',
      time: 1417713337,
      bits: '207fffff',
      nonce: 1096447,
    });
  },
  getRegtestGenesis() {
    return utils.normalizeHeader({
      version: 1,
      previousblockhash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleroot: 'e0028eb9648db56b1ac77cf090b99048a8007e2bb64b68f092c03c7f56a662c7',
      time: 1417713337,
      bits: '207fffff',
      nonce: 1096447,
    });
  },
  getLivenetGenesis() {
    return utils.normalizeHeader({
      version: 1,
      previousblockhash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleroot: 'e0028eb9648db56b1ac77cf090b99048a8007e2bb64b68f092c03c7f56a662c7',
      time: 1390095618,
      bits: '1e0ffff0',
      nonce: 28917698,
    });
  },
};
