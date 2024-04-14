const hellarcore = require('@hellarpro/hellarcore-lib');

module.exports = function getNetwork(network) {
  return hellarcore.Networks[network].toString() || hellarcore.Networks.testnet.toString();
};
