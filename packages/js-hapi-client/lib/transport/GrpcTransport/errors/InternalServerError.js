const RetriableResponseError = require('../../errors/response/RetriableResponseError');

class InternalServerError extends RetriableResponseError {
  /**
   * @param {number} code
   * @param {string} message
   * @param {object} data
   * @param {HAPIAddress} hapiAddress
   */
  constructor(code, message, data, hapiAddress) {
    super(code, message, data, hapiAddress);

    // Replace current stack with remote stack from HAPI/Drive
    if (data.stack) {
      this.stack = `[REMOTE STACK] ${data.stack}`;
    }
  }
}

module.exports = InternalServerError;
