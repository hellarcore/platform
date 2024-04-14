const WalletLibError = require('./WalletLibError');

class InvalidhellarcoreTransaction extends WalletLibError {
  constructor(tx, reason = 'A hellarcore Transaction object or valid rawTransaction is required') {
    super(`${reason}: ${tx.toString()}`);
  }
}

module.exports = InvalidhellarcoreTransaction;
