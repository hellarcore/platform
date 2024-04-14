const WrongHttpCodeError = require('./errors/WrongHttpCodeError');
const JsonRpcError = require('./errors/JsonRpcError');
const ServerError = require('../errors/response/ServerError');
const ResponseError = require('../errors/response/ResponseError');
const RetriableResponseError = require('../errors/response/RetriableResponseError');

/**
 * @typedef {createJsonTransportError}
 * @param {Error} error
 * @param {HAPIAddress} hapiAddress
 * @returns {ResponseError}
 */
function createJsonTransportError(error, hapiAddress) {
  if (error instanceof WrongHttpCodeError) {
    return new ServerError(
      error.getCode(),
      error.message,
      {},
      hapiAddress,
    );
  }

  if (error instanceof JsonRpcError) {
    /**
     * -32700 - Parse error - Invalid JSON was received by the server.
     * -32600 - Invalid Request - The JSON sent is not a valid Request object.
     * -32601 - Method not found - The method does not exist / is not available.
     * -32602 - Invalid params - Invalid method parameter(s).
     * -32603 - Internal error - Internal JSON-RPC error.
     * -32000 to -32099 - Server error - Reserved for implementation-defined server-errors.
     */
    if (error.code !== -32603 && !(error.code >= -32000 && error.code <= -32099)) {
      return new ResponseError(
        error.getCode(),
        error.getMessage(),
        error.getData(),
        hapiAddress,
      );
    }

    return new RetriableResponseError(
      error.getCode(),
      error.getMessage(),
      error.getData(),
      hapiAddress,
    );
  }

  if (!['ECONNABORTED', 'ECONNREFUSED', 'ETIMEDOUT'].includes(error.code)) {
    return new ResponseError(
      error.code,
      error.message,
      {},
      hapiAddress,
    );
  }

  return new RetriableResponseError(
    error.code,
    error.message,
    {},
    hapiAddress,
  );
}

module.exports = createJsonTransportError;
