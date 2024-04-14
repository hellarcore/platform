const ListHAPIAddressProvider = require('../../../lib/hapiAddressProvider/ListHAPIAddressProvider');
const HAPIAddress = require('../../../lib/hapiAddressProvider/HAPIAddress');

describe('ListHAPIAddressProvider', () => {
  let listHAPIAddressProvider;
  let addresses;
  let options;
  let bannedAddress;
  let notBannedAddress;

  beforeEach(() => {
    bannedAddress = new HAPIAddress('192.168.1.1');
    bannedAddress.markAsBanned();

    notBannedAddress = new HAPIAddress('192.168.1.2');

    addresses = [
      bannedAddress,
      notBannedAddress,
    ];

    options = {};

    listHAPIAddressProvider = new ListHAPIAddressProvider(
      addresses,
      options,
    );
  });

  describe('#constructor', () => {
    it('should set base ban time option', () => {
      const baseBanTime = 1000;

      listHAPIAddressProvider = new ListHAPIAddressProvider(
        addresses,
        { baseBanTime },
      );

      expect(listHAPIAddressProvider.options.baseBanTime).to.equal(baseBanTime);
    });

    it('should set default base ban time option if not passed', () => {
      listHAPIAddressProvider = new ListHAPIAddressProvider(
        addresses,
      );

      expect(listHAPIAddressProvider.options.baseBanTime).to.equal(60 * 1000);
    });
  });

  describe('#getLiveAddresses', () => {
    it('should return live addresses', () => {
      const bannedInThePastAddress = new HAPIAddress('192.168.1.3');
      bannedInThePastAddress.banCount = 1;
      bannedInThePastAddress.banStartTime = Date.now() - 3 * 60 * 1000;

      const bannedManyTimesAddress = new HAPIAddress('192.168.1.4');
      bannedManyTimesAddress.banCount = 3;
      bannedManyTimesAddress.banStartTime = Date.now() - 2 * 60 * 1000;

      listHAPIAddressProvider = new ListHAPIAddressProvider([
        bannedAddress,
        notBannedAddress,
        bannedInThePastAddress,
        bannedManyTimesAddress,
      ]);

      const liveAddresses = listHAPIAddressProvider.getLiveAddresses();

      expect(liveAddresses).to.have.lengthOf(2);
      expect(liveAddresses[0]).to.equal(notBannedAddress);
      expect(liveAddresses[1]).to.equal(bannedInThePastAddress);
    });

    it('should return empty array if all addresses are banned', () => {
      listHAPIAddressProvider.addresses.forEach((address) => {
        address.markAsBanned();
      });

      const liveAddresses = listHAPIAddressProvider.getLiveAddresses();

      expect(liveAddresses).to.have.lengthOf(0);
    });
  });

  describe('#getLiveAddress', () => {
    it('should return random live address', async () => {
      const address = await listHAPIAddressProvider.getLiveAddress();

      expect(address).to.equal(notBannedAddress);
    });

    it('should return undefined when there are no live addresses', async () => {
      listHAPIAddressProvider.addresses.forEach((address) => {
        address.markAsBanned();
      });

      const address = await listHAPIAddressProvider.getLiveAddress();

      expect(address).to.be.undefined();
    });

    it('should return modified address for localhost node', async () => {
      options = {
        network: 'local',
      };

      listHAPIAddressProvider = new ListHAPIAddressProvider(
        addresses,
        options,
      );

      const liveAddress = await listHAPIAddressProvider.getLiveAddress();

      expect(liveAddress.host).to.equal('127.0.0.1');
      expect(liveAddress.protocol).to.equal('https');
      expect(liveAddress.allowSelfSignedCertificate).to.be.true();
    });
  });

  describe('#hasLiveAddresses', () => {
    it('should return true if we have at least one unbanned address', async () => {
      const hasAddresses = await listHAPIAddressProvider.hasLiveAddresses();

      expect(hasAddresses).to.be.true();
    });

    it('should return false if all addresses are banned', async () => {
      listHAPIAddressProvider.addresses.forEach((address) => {
        address.markAsBanned();
      });

      const hasAddresses = await listHAPIAddressProvider.hasLiveAddresses();

      expect(hasAddresses).to.be.false();
    });
  });

  describe('#getAllAddresses', () => {
    it('should get all addresses', () => {
      const allAddresses = listHAPIAddressProvider.getAllAddresses();

      expect(allAddresses).to.deep.equal(listHAPIAddressProvider.addresses);
    });
  });

  describe('#setAddresses', () => {
    it('should set addresses and overwrite previous', () => {
      addresses = [
        notBannedAddress,
      ];
      listHAPIAddressProvider.setAddresses(addresses);

      expect(listHAPIAddressProvider.addresses).to.deep.equal(addresses);
    });
  });
});
