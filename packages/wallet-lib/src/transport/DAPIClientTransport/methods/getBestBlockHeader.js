const logger = require('../../../logger');

module.exports = async function getBestBlockHeader() {
  logger.silly('HAPIClientTransport.getBestBlockHeader');

  return this.getBlockHeaderByHash(await this.getBestBlockHash());
};
