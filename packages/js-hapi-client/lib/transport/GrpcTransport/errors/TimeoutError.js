const grpcErrorCodes = require('@hellarpro/grpc-common/lib/server/error/GrpcErrorCodes');

const RetriableResponseError = require('../../errors/response/RetriableResponseError');

class TimeoutError extends RetriableResponseError {
  /**
   * @param {string} message
   * @param {object} data
   * @param {HAPIAddress} hapiAddress
   */
  constructor(message, data, hapiAddress) {
    super(grpcErrorCodes.DEADLINE_EXCEEDED, message, data, hapiAddress);
  }
}

module.exports = TimeoutError;
