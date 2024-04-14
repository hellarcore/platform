const logger = require('../../../logger');

module.exports = async function getBestBlockHash() {
  logger.silly('HAPIClientTransport.getBestBlockHash');

  return this.client.core.getBestBlockHash();
};
