const { each } = require('lohellar');
const {
  categorizeTransactions,
  // calculateTransactionFees,
} = require('../../../utils');

const sortbyTimeDescending = (a, b) => (b.time - a.time);
const sortByHeightDescending = (a, b) => (b.height - a.height);

/**
 * Get all the transaction history already formated
 * @return {TransactionsHistory}
 */
function getTransactionHistory() {
  const transactionHistory = [];

  const {
    walletId,
    walletType,
    index: accountIndex,
    storage,
    network,
  } = this;

  const transactions = this.getTransactions();

  const walletStore = storage.getWalletStore(walletId);
  const chainStore = storage.getChainStore(network);

  const transactionsWithMetadata = Object.keys(transactions).reduce((acc, hash) => {
    const { metadata } = chainStore.getTransaction(hash);
    acc.push([transactions[hash], metadata]);
    return acc;
  }, []);

  const categorizedTransactions = categorizeTransactions(
    transactionsWithMetadata,
    walletStore,
    accountIndex,
    walletType,
    network,
  );
  const sortedCategorizedTransactions = categorizedTransactions.sort(sortByHeightDescending);

  each(sortedCategorizedTransactions, (categorizedTransaction) => {
    const {
      transaction,
      from,
      to,
      type,
      time,
      isChainLocked,
      isInstantLocked,
      satoshisBalanceImpact,
      feeImpact,
    } = categorizedTransaction;
    const blockHash = categorizedTransaction.blockHash !== ''
      ? categorizedTransaction.blockHash
      : null;

    const normalizedTransactionHistory = {
      // Would require knowing the vout of this vin to determinate inputAmount.
      // This information could be fetched, but the necessity vs the cost is questionable.
      //   fees: calculateTransactionFees(categorizedTransaction.transaction),
      from,
      to,
      type,
      time: time || new Date(9999999999 * 1e3),
      txId: transaction.hash,
      blockHash,
      isChainLocked,
      isInstantLocked,
      satoshisBalanceImpact,
      feeImpact,
    };

    transactionHistory.push(normalizedTransactionHistory);
  });

  // Sort by decreasing time.
  return transactionHistory.sort(sortbyTimeDescending);
}

module.exports = getTransactionHistory;
