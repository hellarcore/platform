const AbstractTransport = require('../AbstractTransport');

/**
 * @implements {Transport}
 */
class HAPIClientTransport extends AbstractTransport {
  constructor(client) {
    super();

    this.client = client;
  }
}

HAPIClientTransport.prototype.getBestBlock = require('./methods/getBestBlock');
HAPIClientTransport.prototype.getBestBlockHeader = require('./methods/getBestBlockHeader');
HAPIClientTransport.prototype.getBestBlockHash = require('./methods/getBestBlockHash');
HAPIClientTransport.prototype.getBestBlockHeight = require('./methods/getBestBlockHeight');
HAPIClientTransport.prototype.getBlockByHash = require('./methods/getBlockByHash');
HAPIClientTransport.prototype.getBlockByHeight = require('./methods/getBlockByHeight');
HAPIClientTransport.prototype.getBlockHeaderByHash = require('./methods/getBlockHeaderByHash');
HAPIClientTransport.prototype.getBlockHeaderByHeight = require('./methods/getBlockHeaderByHeight');
HAPIClientTransport.prototype.getStatus = require('./methods/getStatus');
HAPIClientTransport.prototype.getTransaction = require('./methods/getTransaction');
HAPIClientTransport.prototype.sendTransaction = require('./methods/sendTransaction');
HAPIClientTransport.prototype.getIdentitiesByPublicKeyHashes = require('./methods/getIdentitiesByPublicKeyHashes');
HAPIClientTransport.prototype.subscribeToTransactionsWithProofs = require('./methods/subscribeToTransactionsWithProofs');

module.exports = HAPIClientTransport;
