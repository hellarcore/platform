const { expect } = require('chai');

const HAPIClientTransport = require('../HAPIClientTransport');

describe('transports - HAPIClientTransport - .getStatus', function suite() {
  let fixture;
  let transport;
  let clientMock;

  beforeEach(() => {
    fixture = {
      coreVersion: 150000, protocolVersion: 70216, blocks: 9495, timeOffset: 0, connections: 16, proxy: '', difficulty: 0.001447319555790497, testnet: false, relayFee: 0.00001, errors: '', network: 'testnet',
    };

    clientMock = {
      core: {
        getStatus: () => fixture,
      }
    }

    transport = new HAPIClientTransport(clientMock);
  })

  afterEach(() => {
    transport.disconnect();
  })

  it('should work', async () => {
    const res = await transport.getStatus();

    expect(res).to.deep.equal(fixture);
  });
});
