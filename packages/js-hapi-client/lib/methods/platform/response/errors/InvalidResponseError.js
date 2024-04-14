const HAPIClientError = require('../../../../errors/HAPIClientError');

class InvalidResponseError extends HAPIClientError {
  constructor(message) {
    super(`Invalid response: ${message}`);
  }
}

module.exports = InvalidResponseError;
