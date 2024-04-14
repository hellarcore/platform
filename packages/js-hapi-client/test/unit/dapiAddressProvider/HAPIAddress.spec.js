const HAPIAddress = require('../../../lib/hapiAddressProvider/HAPIAddress');
const HAPIAddressHostMissingError = require(
  '../../../lib/hapiAddressProvider/errors/HAPIAddressHostMissingError',
);

describe('HAPIAddress', () => {
  let host;
  let port;

  beforeEach(() => {
    host = '127.0.0.1';
    port = HAPIAddress.DEFAULT_PORT + 1;
  });

  describe('#constructor', () => {
    it('should construct HAPIAddress from string with host and both ports', () => {
      const hapiAddress = new HAPIAddress(`${host}:${port}:no-ssl`);

      expect(hapiAddress).to.be.an.instanceOf(HAPIAddress);
      expect(hapiAddress.host).to.equal(host);
      expect(hapiAddress.port).to.equal(port);
      expect(hapiAddress.proRegTxHash).to.be.undefined();
      expect(hapiAddress.banCount).to.equal(0);
      expect(hapiAddress.banStartTime).to.be.undefined();
      expect(hapiAddress.protocol).to.equal('http');
    });

    it('should construct HAPIAddress from string with host and HTTP port', () => {
      const hapiAddress = new HAPIAddress(`${host}:${port}`);

      expect(hapiAddress).to.be.an.instanceOf(HAPIAddress);
      expect(hapiAddress.host).to.equal(host);
      expect(hapiAddress.port).to.equal(port);
      expect(hapiAddress.proRegTxHash).to.be.undefined();
      expect(hapiAddress.banCount).to.equal(0);
      expect(hapiAddress.banStartTime).to.be.undefined();
    });

    it('should construct HAPIAddress from HAPIAddress', () => {
      const address = new HAPIAddress(host);

      const hapiAddress = new HAPIAddress(address);

      expect(hapiAddress).to.be.an.instanceOf(HAPIAddress);
      expect(hapiAddress.toJSON()).to.deep.equal(address.toJSON());
    });

    it('should construct HAPIAddress form RawHAPIAddress', () => {
      const hapiAddress = new HAPIAddress({
        host,
      });

      expect(hapiAddress).to.be.an.instanceOf(HAPIAddress);
      expect(hapiAddress.host).to.equal(host);
      expect(hapiAddress.port).to.equal(HAPIAddress.DEFAULT_PORT);
      expect(hapiAddress.banCount).to.equal(0);
      expect(hapiAddress.banStartTime).to.be.undefined();
    });

    it('should construct HAPIAddress with defined ports', () => {
      const proRegTxHash = 'proRegTxHash';

      const hapiAddress = new HAPIAddress({
        host,
        port,
        proRegTxHash,
      });

      expect(hapiAddress).to.be.an.instanceOf(HAPIAddress);
      expect(hapiAddress.banCount).to.equal(0);
      expect(hapiAddress.banStartTime).to.be.undefined();
      expect(hapiAddress.toJSON()).to.deep.equal({
        host,
        port,
        proRegTxHash,
        protocol: HAPIAddress.DEFAULT_PROTOCOL,
        allowSelfSignedCertificate: false,
      });
    });

    it('should not set banCount and banStartTime from RawHAPIAddress', async () => {
      const hapiAddress = new HAPIAddress({
        host,
        banCount: 100,
        banStartTime: 1000,
      });

      expect(hapiAddress).to.be.an.instanceOf(HAPIAddress);
      expect(hapiAddress.banCount).to.equal(0);
      expect(hapiAddress.banStartTime).to.be.undefined();
    });

    it('should throw HAPIAddressHostMissingError if host is missed', () => {
      try {
        // eslint-disable-next-line no-new
        new HAPIAddress('');

        expect.fail('should throw HAPIAddressHostMissingError');
      } catch (e) {
        expect(e).to.be.an.instanceOf(HAPIAddressHostMissingError);
      }
    });
  });

  describe('#getHost', () => {
    it('should return host', () => {
      const hapiAddress = new HAPIAddress(host);

      expect(hapiAddress.getHost()).to.equal(host);
    });
  });

  describe('#setHost', () => {
    it('should set host', () => {
      const otherHost = '192.168.1.1';

      const hapiAddress = new HAPIAddress(host);
      hapiAddress.setHost(otherHost);

      expect(hapiAddress.host).to.equal(otherHost);
    });
  });

  describe('#getPort', () => {
    it('should get port', () => {
      const hapiAddress = new HAPIAddress({
        host,
        port,
      });

      expect(hapiAddress.getPort()).to.equal(port);
    });
  });

  describe('#setPort', () => {
    it('should set port', () => {
      const hapiAddress = new HAPIAddress(host);
      hapiAddress.setPort(port);

      expect(hapiAddress.getPort()).to.equal(port);
    });
  });

  describe('#getProRegTxHash', () => {
    it('should get ProRegTxHash', () => {
      const proRegTxHash = 'proRegTxHash';

      const hapiAddress = new HAPIAddress({
        host,
        proRegTxHash,
      });

      expect(hapiAddress.getProRegTxHash()).to.equal(proRegTxHash);
    });
  });

  describe('#getBanStartTime', () => {
    it('should get ban start time', () => {
      const now = Date.now();

      const hapiAddress = new HAPIAddress(host);
      hapiAddress.banStartTime = now;

      const banStartTime = hapiAddress.getBanStartTime();
      expect(banStartTime).to.equal(now);
    });
  });

  describe('#getProtocol', () => {
    it('should get protocol', () => {
      const hapiAddress = new HAPIAddress(host);

      hapiAddress.protocol = 'http';

      const protocol = hapiAddress.getProtocol();
      expect(protocol).to.equal('http');
    });
  });

  describe('#getBanCount', () => {
    it('should get ban count', () => {
      const hapiAddress = new HAPIAddress(host);
      hapiAddress.banCount = 666;

      const banCount = hapiAddress.getBanCount();
      expect(banCount).to.equal(666);
    });
  });

  describe('#markAsBanned', () => {
    it('should mark address as banned', () => {
      const hapiAddress = new HAPIAddress(host);
      hapiAddress.markAsBanned();

      expect(hapiAddress.banCount).to.equal(1);
      expect(hapiAddress.banStartTime).to.be.greaterThan(0);
    });
  });

  describe('#markAsLive', () => {
    it('should mark address as live', () => {
      const hapiAddress = new HAPIAddress(host);
      hapiAddress.banCount = 1;
      hapiAddress.banStartTime = Date.now();

      hapiAddress.markAsLive();

      expect(hapiAddress.banCount).to.equal(0);
      expect(hapiAddress.banStartTime).to.be.undefined();
    });
  });

  describe('#isBanned', () => {
    it('should return true if address is banned', () => {
      const hapiAddress = new HAPIAddress(host);

      hapiAddress.banCount = 1;

      const isBanned = hapiAddress.isBanned();
      expect(isBanned).to.be.true();
    });

    it('should return false if address is not banned', () => {
      const hapiAddress = new HAPIAddress(host);

      const isBanned = hapiAddress.isBanned();
      expect(isBanned).to.be.false();
    });
  });

  describe('#isSelfSigned', () => {
    it('should return true if address uses self signed certificate', () => {
      const hapiAddress = new HAPIAddress(host);

      hapiAddress.allowSelfSignedCertificate = true;

      const isSelfSigned = hapiAddress.isSelfSignedCertificateAllowed();
      expect(isSelfSigned).to.be.true();
    });

    it('should return true if address doesn\'t use self signed certificate', () => {
      const hapiAddress = new HAPIAddress(host);

      hapiAddress.allowSelfSignedCertificate = false;

      const isSelfSigned = hapiAddress.isSelfSignedCertificateAllowed();
      expect(isSelfSigned).to.be.false();
    });
  });

  describe('#toJSON', () => {
    it('should return RawHAPIAddress', () => {
      const hapiAddress = new HAPIAddress(host);

      expect(hapiAddress.toJSON()).to.deep.equal({
        host: hapiAddress.getHost(),
        port: hapiAddress.getPort(),
        proRegTxHash: hapiAddress.getProRegTxHash(),
        protocol: HAPIAddress.DEFAULT_PROTOCOL,
        allowSelfSignedCertificate: false,
      });
    });
  });

  describe('toString', () => {
    it('should return a string representation', () => {
      const hapiAddress = new HAPIAddress(host);

      const hapiAddressString = `${hapiAddress.getProtocol()}://${hapiAddress.getHost()}:`
        + `${hapiAddress.getPort()}`;

      expect(`${hapiAddress}`).to.equal(hapiAddressString);
    });
  });
});
