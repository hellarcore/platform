const {
  server: {
    error: {
      InvalidArgumentGrpcError,
    },
  },
} = require('@hellarpro/grpc-common');

const {
  v0: {
    GetIdentityBalanceResponse,
  },
} = require('@hellarpro/hapi-grpc');

/**
 * @param {DriveClient} driveClient
 *
 * @return {getIdentityBalanceHandler}
 */
function getIdentityBalanceHandlerFactory(driveClient) {
  /**
   * @typedef getIdentityBalanceHandler
   *
   * @param {Object} call
   *
   * @return {Promise<GetIdentityBalanceResponse>}
   */
  async function getIdentityBalanceHandler(call) {
    const { request } = call;

    if (!request.getV0().getId()) {
      throw new InvalidArgumentGrpcError('identity id is not specified');
    }

    const identityResponseBuffer = await driveClient
      .fetchIdentityBalance(request);

    return GetIdentityBalanceResponse.deserializeBinary(identityResponseBuffer);
  }

  return getIdentityBalanceHandler;
}

module.exports = getIdentityBalanceHandlerFactory;
