/* eslint-disable dot-notation */
/* eslint-disable quote-props */
import { Flags } from '@oclif/core';
import { OUTPUT_FORMATS } from '../../constants.js';
import colors from '../../status/colors.js';
import ConfigBaseCommand from '../../oclif/command/ConfigBaseCommand.js';
import printObject from '../../printers/printObject.js';

export default class PlatformStatusCommand extends ConfigBaseCommand {
  static description = 'Show Platform status details';

  static flags = {
    ...ConfigBaseCommand.flags,
    format: Flags.string({
      description: 'display output format',
      default: OUTPUT_FORMATS.PLAIN,
      options: Object.values(OUTPUT_FORMATS),
    }),
  };

  /**
   * @param {Object} args
   * @param {Object} flags
   * @param {DockerCompose} dockerCompose
   * @param {createRpcClient} createRpcClient
   * @param {Config} config
   * @param {getPlatformScope} getPlatformScope
   * @return {Promise<void>}
   */
  async runWithDependencies(
    args,
    flags,
    dockerCompose,
    createRpcClient,
    config,
    getPlatformScope,
  ) {
    const plain = {
      'HTTP service': 'n/a',
      'HTTP port': 'n/a',
      'P2P service': 'n/a',
      'P2P port': 'n/a',
      'RPC service': 'n/a',
      'Tenderhellar Docker Status': 'n/a',
      'Tenderhellar Service Status': 'n/a',
      'Drive Docker Status': 'n/a',
      'Drive Service Status': 'n/a',
      'Network': 'n/a',
      'Tenderhellar Version': 'n/a',
      'Block height': 'n/a',
      'Peer count': 'n/a',
      'App hash': 'n/a',
    };

    // Collect platform data
    const scope = await getPlatformScope(config);

    if (flags.format === OUTPUT_FORMATS.PLAIN) {
      const {
        httpService,
        httpPort,
        httpPortState,
        p2pService,
        p2pPort,
        p2pPortState,
        rpcService,
        tenderhellar,
        drive,
      } = scope;

      plain['HTTP service'] = httpService || 'n/a';
      plain['HTTP port'] = `${httpPort} ${httpPortState ? colors.portState(httpPortState)(httpPortState) : ''}`;
      plain['P2P service'] = p2pService || 'n/a';
      plain['P2P port'] = `${p2pPort} ${p2pPortState ? colors.portState(p2pPortState)(p2pPortState) : ''}`;
      plain['RPC service'] = rpcService || 'n/a';

      const { dockerStatus: tenderhellarDockerStatus } = tenderhellar;
      const { serviceStatus: tenderhellarServiceStatus } = tenderhellar;

      const { dockerStatus: driveDockerStatus } = drive;
      const { serviceStatus: driveServiceStatus } = drive;

      plain['Tenderhellar Docker Status'] = colors.docker(tenderhellarDockerStatus)(tenderhellarDockerStatus) || 'n/a';
      plain['Tenderhellar Service Status'] = colors.status(tenderhellarServiceStatus)(tenderhellarServiceStatus) || 'n/a';

      plain['Drive Docker Status'] = colors.docker(driveDockerStatus)(driveDockerStatus) || 'n/a';
      plain['Drive Service Status'] = colors.status(driveServiceStatus)(driveServiceStatus) || 'n/a';

      if (tenderhellar.version) {
        const {
          version: tenderhellarVersion,
          latestBlockHeight: platformBlockHeight,
          latestAppHash: platformLatestAppHash,
          peers: platformPeers,
          network: tenderhellarNetwork,
        } = tenderhellar;

        plain['Network'] = tenderhellarNetwork || 'n/a';
        plain['Tenderhellar Version'] = tenderhellarVersion || 'n/a';
        plain['Block height'] = platformBlockHeight || 'n/a';
        plain['Peer count'] = platformPeers || 'n/a';
        plain['App hash'] = platformLatestAppHash || 'n/a';
      }

      return printObject(plain, flags.format);
    }

    return printObject(scope, flags.format);
  }
}
