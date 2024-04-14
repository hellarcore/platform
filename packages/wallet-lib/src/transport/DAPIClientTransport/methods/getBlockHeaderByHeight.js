const logger = require('../../../logger');

module.exports = async function getBlockHeaderByHeight(blockHeight) {
  logger.silly(`HAPIClient.getBlockHeaderByHeight[${blockHeight}]`);
  return (await this.getBlockByHeight(blockHeight)).header;
};
