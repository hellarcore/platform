const { expect } = require('chai');

const { Identifier } = require('@hellarpro/wasm-hpp');

const {
  Networks,
} = require('@hellarpro/hellarcore-lib');

// eslint-disable-next-line
const Hellar = require(typeof process === 'undefined' ? '../../src/index.ts' : '../../');

describe('SDK', function suite() {
  this.timeout(700000);

  let account;
  let hpnsContractId;
  let clientInstance;

  beforeEach(async () => {
    hpnsContractId = Identifier.from(process.env.HPNS_CONTRACT_ID);

    const clientOpts = {
      seeds: process.env.HAPI_SEED.split(','),
      network: process.env.NETWORK,
      wallet: {
        mnemonic: null,
      },
      apps: {
        hpns: {
          contractId: hpnsContractId,
        },
      },
    };

    clientInstance = new Hellar.Client(clientOpts);
  });

  it('should init a Client', async () => {
    expect(clientInstance.network).to.equal(process.env.NETWORK);

    expect(clientInstance.defaultAccountIndex).to.equal(0);
    expect(clientInstance.getApps().has('hpns')).to.be.true;
    expect(clientInstance.getApps().get('hpns')).to.deep.equal({
      contractId: hpnsContractId,
      contract: undefined,
    });

    const network = Networks.get(process.env.NETWORK).name;
    expect(clientInstance.wallet.network).to.equal(network);

    expect(clientInstance.wallet.offlineMode).to.equal(false);

    expect(clientInstance.platform.hpp).to.exist;

    expect(clientInstance.platform.client).to.exist;
  });

  it('should initiate Wallet account', async () => {
    account = await clientInstance.getWalletAccount();

    expect(account.index).to.equal(0);
  });

  it('should sign and verify a message', async () => {
    const idKey = account.identities.getIdentityHDKeyByIndex(0, 0);
    // This transforms from a Wallet-Lib.PrivateKey to a hellarcore-lib.PrivateKey.
    // It will quickly be annoying to perform this,
    // and we therefore need to find a better solution for that.
    const privateKey = Hellar.Core.PrivateKey(idKey.privateKey);
    const message = Hellar.Core.Message('hello, world');
    const signed = message.sign(privateKey);
    const verify = message.verify(idKey.privateKey.toAddress().toString(), signed.toString());
    expect(verify).to.equal(true);
  });

  it('should disconnect', async () => {
    await clientInstance.disconnect();
  });
});
