const grpcErrorCodes = require('@hellarpro/grpc-common/lib/server/error/GrpcErrorCodes');

const ResponseError = require('../../errors/response/ResponseError');

class NotFoundError extends ResponseError {
  /**
   *
   * @param {string} message
   * @param {object} data
   * @param {HAPIAddress} hapiAddress
   */
  constructor(message, data, hapiAddress) {
    super(grpcErrorCodes.NOT_FOUND, message, data, hapiAddress);
  }
}

module.exports = NotFoundError;
