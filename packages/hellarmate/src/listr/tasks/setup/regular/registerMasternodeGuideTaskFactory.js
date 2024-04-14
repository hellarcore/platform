import { Listr } from 'listr2';
import deriveTenderhellarNodeId from '../../../../tenderhellar/deriveTenderhellarNodeId.js';
import getConfigurationOutputFromContext from './getConfigurationOutputFromContext.js';

/**
 * @param {DefaultConfigs} defaultConfigs
 * @param {registerMasternodeWithCoreWallet} registerMasternodeWithCoreWallet
 * @param {registerMasternodeWithDMT} registerMasternodeWithDMT
 * @return {registerMasternodeGuideTask}
 */
export default function registerMasternodeGuideTaskFactory(
  defaultConfigs,
  registerMasternodeWithCoreWallet,
  registerMasternodeWithDMT,
) {
  /**
   * @typedef {registerMasternodeGuideTask}
   * @return {Listr}
   */
  async function registerMasternodeGuideTask() {
    const REGISTRARS = {
      CORE: 'hellarcore',
      // TODO: Disabled until additional functionality like signing protx and so on is
      //  implemented there
      // ANDROID: 'hellarAndroid',
      // IOS: 'hellarIOS',
      DMT: 'dmt',
    };

    return new Listr([
      {
        title: 'Register masternode',
        task: async (ctx, task) => {
          const registrar = await task.prompt([
            {
              type: 'select',
              header: `  For security reasons, Hellar masternodes should never store masternode owner or
  collateral private keys. Hellarmate therefore cannot register a masternode for you
  directly. Instead, we will generate RPC commands that you can use in Hellar Core
  or other external tools where keys are handled securely. During this process,
  hellarmate can optionally generate configuration elements as necessary, such as
  the BLS operator key and the node id.

  Hellar Masternode Tool (DMT) - Recommended for mainnet masternodes
                               so the collateral can be stored
                               on a hardware wallet for maximum security.

  Hellar Core Wallet           - Recommended for testnet and devnet masternodes
                               where more flexibility is required.\n`,
              message: 'Which wallet will you use to store keys for your masternode?',
              choices: [
                { name: REGISTRARS.DMT, message: 'Hellar Masternode Tool' },
                { name: REGISTRARS.CORE, message: 'Hellar Core Wallet' },
              ],
              initial: REGISTRARS.DMT,
            },
          ]);

          // TODO: Refactor. It should be done as a separate tasks
          let state;
          if (registrar === REGISTRARS.CORE) {
            state = await registerMasternodeWithCoreWallet(ctx, task, defaultConfigs);
          } else if (registrar === REGISTRARS.DMT) {
            state = await registerMasternodeWithDMT(ctx, task);
          }

          ctx.config.set('core.masternode.operator.privateKey', state.operator.privateKey);

          ctx.config.set('externalIp', state.ipAndPorts.ip);
          ctx.config.set('core.p2p.port', state.ipAndPorts.coreP2PPort);

          if (ctx.isHP) {
            ctx.config.set('platform.drive.tenderhellar.node.id', deriveTenderhellarNodeId(state.platformNodeKey));
            ctx.config.set('platform.drive.tenderhellar.node.key', state.platformNodeKey);

            ctx.config.set('platform.hapi.envoy.http.port', state.ipAndPorts.platformHTTPPort);
            ctx.config.set('platform.drive.tenderhellar.p2p.port', state.ipAndPorts.platformP2PPort);
          }

          // eslint-disable-next-line no-param-reassign
          task.output = await getConfigurationOutputFromContext(ctx);
        },
        options: {
          persistentOutput: true,
        },
      },
    ]);
  }

  return registerMasternodeGuideTask;
}
