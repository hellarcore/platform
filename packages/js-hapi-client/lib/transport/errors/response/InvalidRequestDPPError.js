const ResponseError = require('./ResponseError');

class InvalidRequestDPPError extends ResponseError {
  /**
   *
   * @param {AbstractConsensusError} consensusError
   * @param {object} data
   * @param {HAPIAddress} hapiAddress
   */
  constructor(consensusError, data, hapiAddress) {
    super(consensusError.getCode(), consensusError.message, data, hapiAddress);

    this.consensusError = consensusError;
  }

  /**
   * @returns {AbstractConsensusError}
   */
  getConsensusError() {
    return this.consensusError;
  }
}

module.exports = InvalidRequestDPPError;
