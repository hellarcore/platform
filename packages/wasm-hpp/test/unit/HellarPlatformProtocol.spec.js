const crypto = require('crypto');

const { HellarPlatformProtocol, getLatestProtocolVersion } = require('../..');
const { default: loadWasmDpp } = require('../..');

describe('HellarPlatformProtocol', () => {
  let hpp;

  beforeEach(async () => {
    await loadWasmDpp();

    hpp = new HellarPlatformProtocol(
      { generate: () => crypto.randomBytes(32) },
      getLatestProtocolVersion(),
    );
  });

  describe.skip('constructor', () => {
    it('should set default protocol version', () => {
      hpp = new HellarPlatformProtocol();

      expect(hpp.protocolVersion).to.equal(getLatestProtocolVersion());
    });
  });

  describe.skip('setProtocolVersion', () => {
    it('should set protocol version', () => {
      expect(hpp.protocolVersion).to.equal(getLatestProtocolVersion());

      hpp.setProtocolVersion(42);

      expect(hpp.protocolVersion).to.equal(42);
    });
  });

  describe.skip('getProtocolVersion', () => {
    it('should get protocol version', () => {
      expect(hpp.protocolVersion).to.equal(getLatestProtocolVersion());

      hpp.setProtocolVersion(42);

      expect(hpp.protocolVersion).to.equal(42);
    });
  });
});
