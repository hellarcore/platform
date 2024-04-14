const logger = require('../../../logger');

module.exports = async function getBestBlock() {
  logger.silly('HAPIClientTransport.getBestBlock');

  return this.getBlockByHash(await this.getBestBlockHash());
};
