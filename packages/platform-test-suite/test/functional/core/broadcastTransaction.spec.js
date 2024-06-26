const Hellar = require('hellar');

const createClientWithFundedWallet = require('../../../lib/test/createClientWithFundedWallet');

const { Core: { PrivateKey } } = Hellar;

describe('Core', () => {
  describe('broadcastTransaction', () => {
    let client;

    before(async () => {
      client = await createClientWithFundedWallet(200000);
    });

    after(async () => {
      if (client) {
        await client.disconnect();
      }
    });

    it('should sent transaction and return transaction ID', async () => {
      const account = await client.getWalletAccount();

      const transaction = account.createTransaction({
        recipient: new PrivateKey().toAddress(process.env.NETWORK),
        satoshis: 10000,
      });

      const transactionId = await account.broadcastTransaction(transaction);

      expect(transactionId).to.be.a('string');
    });
  });
});
