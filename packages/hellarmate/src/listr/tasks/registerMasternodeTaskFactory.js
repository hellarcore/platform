import { Listr } from 'listr2';

import { Observable } from 'rxjs';

import {
  NETWORK_LOCAL,
  MASTERNODE_COLLATERAL_AMOUNT,
  HPMN_COLLATERAL_AMOUNT,
} from '../../constants.js';

/**
 *
 * @param {startCore} startCore
 * @param {createNewAddress} createNewAddress
 * @param {generateToAddress} generateToAddress
 * @param {generateBlocks} generateBlocks
 * @param {waitForCoreSync} waitForCoreSync
 * @param {importPrivateKey} importPrivateKey
 * @param {getAddressBalance} getAddressBalance
 * @param {sendToAddress} sendToAddress
 * @param {waitForConfirmations} waitForConfirmations
 * @param {registerMasternode} registerMasternode
 * @param {waitForBalanceToConfirm} waitForBalanceToConfirm
 * @return {registerMasternodeTask}
 */
export default function registerMasternodeTaskFactory(
  startCore,
  createNewAddress,
  generateToAddress,
  generateBlocks,
  waitForCoreSync,
  importPrivateKey,
  getAddressBalance,
  sendToAddress,
  waitForConfirmations,
  registerMasternode,
  waitForBalanceToConfirm,
) {
  /**
   * @typedef {registerMasternodeTask}
   * @param {Config} config
   * @param {boolean} [hp=false] - Register high-performance(evo) masternode
   * @param {string} [operatorReward='0.00']
   * @return {Listr}
   */
  function registerMasternodeTask(config, hp = false, operatorReward = '0.00') {
    const collateralAmount = hp ? HPMN_COLLATERAL_AMOUNT : MASTERNODE_COLLATERAL_AMOUNT;

    return new Listr([
      {
        title: 'Start Core',
        enabled: (ctx) => {
          ctx.coreServicePassed = Boolean(ctx.coreService);

          return !ctx.coreServicePassed;
        },
        task: async (ctx) => {
          ctx.coreServicePassed = false;
          ctx.coreService = await startCore(
            config,
            { wallet: true, addressIndex: true },
          );
        },
      },
      {
        title: 'Import funding private key',
        task: async (ctx, task) => {
          await importPrivateKey(ctx.coreService, ctx.fundingPrivateKeyString);

          // eslint-disable-next-line no-param-reassign
          task.output = `${ctx.fundingPrivateKeyString} imported.`;
        },
        options: { persistentOutput: true },
      },
      {
        title: 'Sync Core with network',
        enabled: () => config.get('network') !== NETWORK_LOCAL,
        task: async (ctx) => (
          new Observable(async (observer) => {
            await waitForCoreSync(
              ctx.coreService,
              (verificationProgress) => {
                const { percent, headers, blocks } = verificationProgress;
                observer.next(`${(percent * 100).toFixed(2)}% complete (${blocks} / ${headers})`);
              },
            );

            observer.complete();

            return this;
          })
        ),
      },
      {
        title: 'Check funding address balance',
        task: async (ctx, task) => {
          // eslint-disable-next-line no-param-reassign
          task.title = `Check funding address ${ctx.fundingAddress} balance`;

          const balance = await getAddressBalance(ctx.coreService, ctx.fundingAddress);

          if (balance <= collateralAmount) {
            throw new Error(`You need to have more than ${collateralAmount} Hellar on your funding address`);
          }
        },
      },
      {
        title: 'Create a new collateral address',
        task: async (ctx, task) => {
          ctx.collateral = await createNewAddress(ctx.coreService);

          // eslint-disable-next-line no-param-reassign
          task.output = `Address: ${ctx.collateral.address}\nPrivate key: ${ctx.collateral.privateKey}`;
        },
        options: { persistentOutput: true },
      },
      {
        title: 'Create a new owner addresses',
        task: async (ctx, task) => {
          ctx.owner = await createNewAddress(ctx.coreService);

          // eslint-disable-next-line no-param-reassign
          task.output = `Address: ${ctx.owner.address}\nPrivate key: ${ctx.owner.privateKey}`;
        },
        options: { persistentOutput: true },
      },
      {
        title: 'Create a new reward addresses',
        task: async (ctx, task) => {
          ctx.reward = await createNewAddress(ctx.coreService);

          // eslint-disable-next-line no-param-reassign
          task.output = `Address: ${ctx.reward.address}\nPrivate key: ${ctx.reward.privateKey}`;
        },
        options: { persistentOutput: true },
      },
      {
        title: 'Send 0.1 hellar from funding address to reward address',
        task: async (ctx) => {
          ctx.collateralTxId = await sendToAddress(
            ctx.coreService,
            ctx.fundingPrivateKeyString,
            ctx.fundingAddress,
            ctx.reward.address,
            0.1,
          );
        },
        options: { persistentOutput: true },
      },
      {
        title: 'Wait for balance to confirm',
        task: async (ctx) => (
          new Observable(async (observer) => {
            await waitForBalanceToConfirm(
              ctx.coreService,
              config.get('network'),
              ctx.reward.address,
              (balance) => {
                observer.next(`${balance} hellar to confirm`);
              },
            );
            observer.complete();

            return this;
          })
        ),
      },
      {
        title: `Send ${collateralAmount} hellar from funding address to collateral address`,
        task: async (ctx, task) => {
          ctx.collateralTxId = await sendToAddress(
            ctx.coreService,
            ctx.fundingPrivateKeyString,
            ctx.fundingAddress,
            ctx.collateral.address,
            collateralAmount,
          );

          // eslint-disable-next-line no-param-reassign
          task.output = `Collateral transaction ID: ${ctx.collateralTxId}`;
        },
        options: { persistentOutput: true },
      },
      {
        title: 'Wait for 1 confirmation',
        enabled: () => config.get('network') !== NETWORK_LOCAL,
        task: async (ctx) => (
          new Observable(async (observer) => {
            await waitForConfirmations(
              ctx.coreService,
              ctx.collateralTxId,
              1,
              (confirmations) => {
                observer.next(`${confirmations} ${confirmations > 1 ? 'confirmations' : 'confirmation'}`);
              },
            );

            observer.complete();

            return this;
          })
        ),
      },
      {
        title: 'Wait for balance to confirm',
        enabled: () => config.get('network') === NETWORK_LOCAL,
        task: async (ctx) => (
          new Observable(async (observer) => {
            await waitForBalanceToConfirm(
              ctx.coreService,
              config.get('network'),
              ctx.collateral.address,
              (balance) => {
                observer.next(`${balance} hellar to confirm`);
              },
            );

            observer.complete();

            return this;
          })
        ),
      },
      {
        title: 'Broadcast masternode registration transaction',
        task: async (ctx, task) => {
          ctx.proTxHash = await registerMasternode(
            ctx.coreService,
            ctx.collateralTxId,
            ctx.owner.address,
            ctx.operator.publicKey,
            ctx.reward.address,
            operatorReward,
            config,
            hp,
          );

          // eslint-disable-next-line no-param-reassign
          task.output = `ProRegTx transaction ID: ${ctx.proTxHash}\n`
          + `Owner Private Key: ${ctx.owner.privateKey}`;
        },
        options: { persistentOutput: true },
      },
      {
        title: 'Wait for 1 confirmation',
        enabled: () => config.get('network') !== NETWORK_LOCAL,
        task: async (ctx) => (
          new Observable(async (observer) => {
            await waitForConfirmations(
              ctx.coreService,
              ctx.collateralTxId,
              1,
              (confirmations) => {
                observer.next(`${confirmations} ${confirmations > 1 ? 'confirmations' : 'confirmation'}`);
              },
            );

            observer.complete();

            return this;
          })
        ),
      },
      {
        title: 'Mine 1 block to confirm',
        enabled: () => config.get('network') === NETWORK_LOCAL,
        task: async (ctx) => (
          new Observable(async (observer) => {
            await generateBlocks(
              ctx.coreService,
              1,
              config.get('network'),
              (blocks) => {
                observer.next(`${blocks} ${blocks > 1 ? 'blocks' : 'block'} mined`);
              },
            );

            observer.complete();

            return this;
          })
        ),
      },
      {
        title: 'Stop Core',
        enabled: (ctx) => !ctx.coreServicePassed,
        task: async (ctx) => ctx.coreService.stop(),
      },
    ]);
  }

  return registerMasternodeTask;
}
