const HAPIClientError = require('../../errors/HAPIClientError');

class HAPIAddressHostMissingError extends HAPIClientError {
  constructor() {
    super('Host is required for HAPI address');
  }
}

module.exports = HAPIAddressHostMissingError;
