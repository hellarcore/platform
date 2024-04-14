const {
  v0: {
    GetDataContractResponse,
  },
} = require('@hellarpro/hapi-grpc');

/**
 * @implements StateRepository
 */
class DriveStateRepository {
  /**
   * @param {DriveClient} driveClient
   * @param {HellarPlatformProtocol} hpp
   */
  constructor(driveClient, hpp) {
    this.driveClient = driveClient;
    this.hpp = hpp;
  }

  /**
   * Fetches data contract from Drive
   * @param {Identifier} contractIdentifier
   * @return {Promise<DataContract>}
   */
  async fetchDataContract(contractIdentifier) {
    const dataContractProtoBuffer = await this.driveClient.fetchDataContract(
      contractIdentifier,
      false,
    );

    const dataContractResponse = GetDataContractResponse.deserializeBinary(
      dataContractProtoBuffer,
    );

    return this.hpp.dataContract.createFromBuffer(
      Buffer.from(dataContractResponse.getV0().getDataContract()),
      { skipValidation: true },
    );
  }
}

module.exports = DriveStateRepository;
