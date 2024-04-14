const HAPIClientError = require('../../../errors/HAPIClientError');

class ResponseError extends HAPIClientError {
  /**
   * @param {number} code
   * @param {string} message
   * @param {object} data
   * @param {HAPIAddress} hapiAddress
   */
  constructor(code, message, data, hapiAddress) {
    super(message);

    this.code = code;
    this.data = data;
    this.hapiAddress = hapiAddress;
  }

  /**
   * @returns {HAPIAddress}
   */
  getHAPIAddress() {
    return this.hapiAddress;
  }

  /**
   * @returns {number}
   */
  getCode() {
    return this.code;
  }

  /**
   * @returns {object}
   */
  getData() {
    return this.data;
  }
}

module.exports = ResponseError;
