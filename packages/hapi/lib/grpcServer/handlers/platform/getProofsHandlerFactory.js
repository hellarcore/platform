const {
  v0: {
    GetProofsResponse,
  },
} = require('@hellarpro/hapi-grpc');

/**
 * @param {DriveClient} driveClient
 *
 * @return {getProofsHandler}
 */
function getProofsHandlerFactory(driveClient) {
  /**
   * @typedef getProofsHandler
   *
   * @param {Object} call
   *
   * @return {Promise<GetProofsResponse>}
   */
  async function getProofsHandler(call) {
    const { request } = call;

    const proofsResponseBuffer = await driveClient.fetchProofs(request);

    return GetProofsResponse.deserializeBinary(proofsResponseBuffer);
  }

  return getProofsHandler;
}

module.exports = getProofsHandlerFactory;
