const HAPIClientError = require('../../errors/HAPIClientError');

class NoAvailableAddressesError extends HAPIClientError {
  constructor() {
    super('No available addresses');
  }
}

module.exports = NoAvailableAddressesError;
