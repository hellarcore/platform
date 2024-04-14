import { Transaction } from '@hellarpro/hellarcore-lib';
import HAPIClient from '@hellarpro/hapi-client';
import { StateTransitionTypes } from '@hellarpro/wasm-hpp';

import { createFakeInstantLock } from '../../utils/createFakeIntantLock';
import getResponseMetadataFixture from '../fixtures/getResponseMetadataFixture';
import { createDapiClientMock } from './createDapiClientMock';

import { wait } from '../../utils/wait';

const GetIdentityResponse = require('@hellarpro/hapi-client/lib/methods/platform/getIdentity/GetIdentityResponse');

const TxStreamMock = require('@hellarpro/wallet-lib/src/test/mocks/TxStreamMock');
const TxStreamDataResponseMock = require('@hellarpro/wallet-lib/src/test/mocks/TxStreamDataResponseMock');
const TransportMock = require('@hellarpro/wallet-lib/src/test/mocks/TransportMock');

function makeTxStreamEmitISLocksForTransactions(transportMock, txStreamMock) {
  transportMock.sendTransaction.callsFake((txString) => {
    const transaction = new Transaction(txString);
    const isLock = createFakeInstantLock(transaction.hash);

    setImmediate(() => {
      // Emit IS lock for the transaction
      txStreamMock.emit(
        TxStreamMock.EVENTS.data,
        new TxStreamDataResponseMock(
          { instantSendLockMessages: [isLock.toBuffer()] },
        ),
      );
    });

    // Emit the same transaction back to the client so it will know about the change transaction
    txStreamMock.emit(
      TxStreamMock.EVENTS.data,
      new TxStreamDataResponseMock(
        { rawTransactions: [transaction.toBuffer()] },
      ),
    );

    return transaction.hash;
  });
}

/**
 * Makes stub remember the identity from the ST and respond with it
 * @param {Client} client
 * @param hapiClientMock
 */
async function makeGetIdentityRespondWithIdentity(client, hapiClientMock) {
  hapiClientMock.platform.broadcastStateTransition.callsFake(async (stBuffer) => {
    const interceptedIdentityStateTransition = await client
      .platform.hpp.stateTransition.createFromBuffer(stBuffer);

    if (interceptedIdentityStateTransition.getType() === StateTransitionTypes.IdentityCreate) {
      const identityToResolve = await client
        .platform.hpp.identity.create(
          interceptedIdentityStateTransition.getIdentityId(),
          interceptedIdentityStateTransition
            .getPublicKeys(),
        );

      identityToResolve.setBalance(
        interceptedIdentityStateTransition.getAssetLockProof().getOutput().satoshis,
      );

      hapiClientMock.platform.getIdentity.withArgs(identityToResolve.getId())
        .resolves(new GetIdentityResponse(
          identityToResolve.toBuffer(),
          getResponseMetadataFixture(),
        ));
    }
  });
}

export async function createAndAttachTransportMocksToClient(client, sinon) {
  await client.platform.initialize();

  const txStreamMock = new TxStreamMock();
  const transportMock = new TransportMock(sinon, txStreamMock);
  const hapiClientMock = createDapiClientMock(sinon);

  // Mock wallet-lib transport to intercept transactions
  client.wallet.transport = transportMock;
  // Mock hapi client for platform endpoints
  client.hapiClient = hapiClientMock;
  client.platform.fetcher.hapiClient = hapiClientMock;

  // Starting account sync
  const accountPromise = client.wallet.getAccount();
  // Breaking the event loop to emit an event
  await wait(0);

  // Simulate headers sync finish
  const { blockHeadersProvider } = client.wallet.transport.client;
  blockHeadersProvider.emit(HAPIClient.BlockHeadersProvider.EVENTS.HISTORICAL_DATA_OBTAINED);
  await wait(0);

  // Emitting TX stream end event to mark finish of the tx sync
  txStreamMock.emit(TxStreamMock.EVENTS.end);

  // Wait for account to resolve
  await accountPromise;

  // Putting data in transport stubs
  transportMock.getIdentitiesByPublicKeyHashes.resolves([]);
  makeTxStreamEmitISLocksForTransactions(transportMock, txStreamMock);
  await makeGetIdentityRespondWithIdentity(client, hapiClientMock);

  return { txStreamMock, transportMock, hapiClientMock };
}
