const logger = require('../../../logger');

module.exports = async function getStatus() {
  logger.silly('HAPIClientTransport.getStatus');

  return this.client.core.getStatus();
};
