const {
  v0: {
    GetProtocolVersionUpgradeStateResponse,
  },
} = require('@hellarpro/hapi-grpc');

/**
 * @param {DriveClient} driveClient
 *
 * @returns {getProtocolVersionUpgradeStateHandler}
 */
function getProtocolVersionUpgradeStateHandlerFactory(driveClient) {
  /**
   * @typedef getProtocolVersionUpgradeStateHandler
   *
   * @param {Object} call
   *
   * @return {Promise<GetProtocolVersionUpgradeStateResponse>}
   */
  async function getProtocolVersionUpgradeStateHandler(call) {
    const { request } = call;

    const versionUpgradeStateBuffer = await driveClient
      .fetchVersionUpgradeState(request);

    return GetProtocolVersionUpgradeStateResponse
      .deserializeBinary(versionUpgradeStateBuffer);
  }

  return getProtocolVersionUpgradeStateHandler;
}

module.exports = getProtocolVersionUpgradeStateHandlerFactory;
