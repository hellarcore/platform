import { Listr } from 'listr2';

/**
 * @return {configureTenderhellarTask}
 */
export default function configureTenderhellarTaskFactory() {
  /**
   * @typedef {configureTenderhellarTask}
   * @param {Config[]} configGroup
   * @return {Listr}
   */
  function configureTenderhellarTask(configGroup) {
    return new Listr([
      {
        task: async (ctx) => {
          const platformConfigs = configGroup.filter((config) => config.get('platform.enable'));

          const subTasks = [];

          // Interconnect Tenderhellar nodes
          subTasks.push({
            task: async () => {
              const randomChainIdPart = Math.floor(Math.random() * 60) + 1;
              const chainId = `hellarmate_local_${randomChainIdPart}`;

              const genesisTime = new Date().toISOString();

              platformConfigs.forEach((config, index) => {
                config.set('platform.drive.tenderhellar.genesis.genesis_time', genesisTime);
                config.set('platform.drive.tenderhellar.genesis.chain_id', chainId);
                config.set(
                  'platform.drive.tenderhellar.genesis.initial_core_chain_locked_height',
                  ctx.initialCoreChainLockedHeight,
                );

                const p2pPeers = platformConfigs
                  .filter((_, i) => i !== index)
                  .map((innerConfig) => {
                    const nodeId = innerConfig.get('platform.drive.tenderhellar.node.id');
                    const port = innerConfig.get('platform.drive.tenderhellar.p2p.port');

                    return {
                      id: nodeId,
                      host: config.get('externalIp'),
                      port,
                    };
                  });

                config.set('platform.drive.tenderhellar.p2p.persistentPeers', p2pPeers);

                config.set(
                  'platform.drive.tenderhellar.genesis.validator_quorum_type',
                  config.get('platform.drive.abci.validatorSet.llmqType'),
                );
              });
            },
          });

          return new Listr(subTasks);
        },
      },
    ]);
  }

  return configureTenderhellarTask;
}
