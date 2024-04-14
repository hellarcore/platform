const createClientWithoutWallet = require('../../../lib/test/createClientWithoutWallet');

describe('Platform', () => {
  describe('ProtocolVersion', () => {
    let client;

    before(async () => {
      client = await createClientWithoutWallet();
    });

    after(async () => {
      if (client) {
        await client.disconnect();
      }
    });

    describe('getProtocolVersionUpgradeState', () => {
      it('should return protocol version', async () => {
        const response = await client.hapiClient.platform.getProtocolVersionUpgradeState();

        expect(response.getVersionEntries()).to.be.an('array');
      });
    });

    describe('getProtocolVersionUpgradeVoteStatus', () => {
      it('should return protocol version', async () => {
        const response = await client
          .hapiClient.platform.getProtocolVersionUpgradeVoteStatus(
            process.env.MASTERNODE_OWNER_PRO_REG_TX_HASH,
            1,
          );

        expect(response.getVersionSignals()).to.be.an('array');
      });
    });
  });
});
