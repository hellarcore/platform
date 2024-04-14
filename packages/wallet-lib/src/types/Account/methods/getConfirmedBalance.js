const { duffsToHellar, calculateDuffBalance } = require('../../../utils');

/**
 * Return the confirmed balance of an account.
 * @param {boolean} [displayDuffs=true] - Set the returned format : Duff/hellar.
 * @return {number} Balance in hellar
 */
function getConfirmedBalance(displayDuffs = true) {
  const {
    walletId, storage, accountPath, network,
  } = this;

  const { addresses } = storage.getWalletStore(walletId).getPathState(accountPath);

  const chainStore = storage.getChainStore(network);
  const totalSat = (calculateDuffBalance(Object.values(addresses), chainStore, 'confirmed'));
  return (displayDuffs) ? totalSat : duffsToHellar(totalSat);
}

module.exports = getConfirmedBalance;
