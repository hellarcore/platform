const { Block } = require('@hellarpro/hellarcore-lib');
const logger = require('../../../logger');

module.exports = async function getBlockByHash(blockHash) {
  logger.silly(`HAPIClient.getBlockByHash[${blockHash}]`);

  return new Block(await this.client.core.getBlockByHash(blockHash));
};
