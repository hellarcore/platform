const { Block } = require('@hellarpro/hellarcore-lib');
const logger = require('../../../logger');

module.exports = async function getBlockByHeight(height) {
  logger.silly(`HAPIClient.getBlockByHeight[${height}]`);

  return new Block(await this.client.core.getBlockByHeight(height));
};
