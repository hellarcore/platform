const HAPIAddressHostMissingError = require('./errors/HAPIAddressHostMissingError');

class HAPIAddress {
  /**
   * @param {RawHAPIAddress|HAPIAddress|string} address
   */
  constructor(address) {
    if (address instanceof HAPIAddress) {
      // eslint-disable-next-line no-constructor-return
      return new HAPIAddress(address.toJSON());
    }

    if (typeof address === 'string') {
      const [host, port, ssl] = address.split(':');

      // eslint-disable-next-line no-param-reassign
      address = {
        host,
        port: port ? parseInt(port, 10) : HAPIAddress.DEFAULT_PORT,
        protocol: ssl === 'no-ssl' ? 'http' : HAPIAddress.DEFAULT_PROTOCOL,
        allowSelfSignedCertificate: ssl === 'self-signed',
      };
    }

    if (!address.host) {
      throw new HAPIAddressHostMissingError();
    }

    this.protocol = address.protocol || HAPIAddress.DEFAULT_PROTOCOL;
    this.host = address.host;
    this.port = address.port || HAPIAddress.DEFAULT_PORT;
    this.proRegTxHash = address.proRegTxHash;
    this.allowSelfSignedCertificate = address.allowSelfSignedCertificate || false;

    this.banCount = 0;
    this.banStartTime = undefined;
  }

  /**
   * Get protocol
   * @returns {string}
   */
  getProtocol() {
    return this.protocol;
  }

  /**
   * Get host
   * @returns {string}
   */
  getHost() {
    return this.host;
  }

  /**
   * Set host
   * @param {string} host
   * @returns {HAPIAddress}
   */
  setHost(host) {
    this.host = host;

    return this;
  }

  /**
   * Get port
   * @returns {number}
   */
  getPort() {
    return this.port;
  }

  /**
   * Set port
   * @param {number} port
   * @returns {HAPIAddress}
   */
  setPort(port) {
    this.port = port;

    return this;
  }

  /**
   * Get ProRegTx hash
   * @returns {string}
   */
  getProRegTxHash() {
    return this.proRegTxHash;
  }

  /**
   * @returns {number}
   */
  getBanStartTime() {
    return this.banStartTime;
  }

  /**
   * @returns {number}
   */
  getBanCount() {
    return this.banCount;
  }

  /**
   * Mark address as banned
   * @returns {HAPIAddress}
   */
  markAsBanned() {
    this.banCount += 1;
    this.banStartTime = Date.now();

    return this;
  }

  /**
   * Mark address as live
   * @returns {HAPIAddress}
   */
  markAsLive() {
    this.banCount = 0;
    this.banStartTime = undefined;

    return this;
  }

  /**
   * @returns {boolean}
   */
  isBanned() {
    return this.banCount > 0;
  }

  /**
   * @returns {boolean}
   */
  isSelfSignedCertificateAllowed() {
    return this.allowSelfSignedCertificate;
  }

  /**
   * Return HAPIAddress as plain object
   * @returns {RawHAPIAddress}
   */
  toJSON() {
    return {
      protocol: this.getProtocol(),
      host: this.getHost(),
      port: this.getPort(),
      proRegTxHash: this.getProRegTxHash(),
      allowSelfSignedCertificate: this.isSelfSignedCertificateAllowed(),
    };
  }

  toString() {
    return `${this.getProtocol()}://${this.getHost()}:${this.getPort()}`;
  }
}

HAPIAddress.DEFAULT_PORT = 443;
HAPIAddress.DEFAULT_PROTOCOL = 'https';

/**
 * @typedef {object} RawHAPIAddress
 * @property {string} protocol
 * @property {string} host
 * @property {number} [port=443]
 * @property {string} [proRegTxHash]
 * @property {bool} [selfSigned]
 */

module.exports = HAPIAddress;
