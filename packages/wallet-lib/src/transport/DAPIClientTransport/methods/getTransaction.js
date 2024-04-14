const { Transaction } = require('@hellarpro/hellarcore-lib');
const NotFoundError = require('@hellarpro/hapi-client/lib/transport/GrpcTransport/errors/NotFoundError');
const { is } = require('../../../utils');
const logger = require('../../../logger');

/**
 * @param {string} txid
 * @returns {Promise<null|Transaction>}
 */
module.exports = async function getTransaction(txid) {
  logger.silly(`HAPIClient.getTransaction[${txid}]`);
  if (!is.txid(txid)) {
    throw new Error(`Received an invalid txid to fetch : ${txid}`);
  }
  try {
    const response = await this.client.core.getTransaction(txid);
    const {
      height,
      instantLocked,
      chainLocked,
    } = response;

    return {
      transaction: new Transaction(response.getTransaction()),
      blockHash: response.getBlockHash().toString('hex'),
      height,
      instantLocked,
      chainLocked,
    };
  } catch (e) {
    if (e instanceof NotFoundError) {
      return null;
    }

    throw e;
  }
};
