const {
  v0: {
    GetBlockRequest,
    CorePromiseClient,
  },
} = require('@hellarpro/hapi-grpc');

/**
 * @param {GrpcTransport} grpcTransport
 * @returns {getBlockByHeight}
 */
function getBlockByHeightFactory(grpcTransport) {
  /**
   * Get block by height
   * @typedef {getBlockByHeight}
   * @param {number} height
   * @param {HAPIClientOptions} [options]
   * @returns {Promise<null|Buffer>}
   */
  async function getBlockByHeight(height, options = {}) {
    const getBlockRequest = new GetBlockRequest();
    getBlockRequest.setHeight(height);

    const response = await grpcTransport.request(
      CorePromiseClient,
      'getBlock',
      getBlockRequest,
      options,
    );

    const blockBinaryArray = response.getBlock();

    return Buffer.from(blockBinaryArray);
  }

  return getBlockByHeight;
}

module.exports = getBlockByHeightFactory;
