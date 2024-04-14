import providers from '../providers.js';
import { DockerStatusEnum } from '../enums/dockerStatus.js';
import { ServiceStatusEnum } from '../enums/serviceStatus.js';
import determineStatus from '../determineStatus.js';
import ContainerIsNotPresentError from '../../docker/errors/ContainerIsNotPresentError.js';

/**
 * @returns {getPlatformScopeFactory}
 * @param {DockerCompose} dockerCompose
 * @param {createRpcClient} createRpcClient
 * @param {getConnectionHost} getConnectionHost
 */
export default function getPlatformScopeFactory(
  dockerCompose,
  createRpcClient,
  getConnectionHost,
) {
  async function getMNSync(config) {
    const rpcClient = createRpcClient({
      port: config.get('core.rpc.port'),
      user: config.get('core.rpc.user'),
      pass: config.get('core.rpc.password'),
      host: await getConnectionHost(config, 'core', 'core.rpc.host'),
    });

    const {
      result: {
        IsSynced: isSynced,
      },
    } = await rpcClient.mnsync('status');

    return isSynced;
  }

  async function getTenderhellarInfo(config, isCoreSynced) {
    const info = {
      p2pPortState: null,
      httpPortState: null,
      dockerStatus: null,
      serviceStatus: null,
      version: null,
      listening: null,
      catchingUp: null,
      latestBlockHash: null,
      latestBlockHeight: null,
      latestBlockTime: null,
      latestAppHash: null,
      peers: null,
      moniker: null,
      network: null,
    };
    try {
      if (!(await dockerCompose.isServiceRunning(config, 'drive_tenderhellar'))) {
        info.dockerStatus = DockerStatusEnum.not_started;
        info.serviceStatus = ServiceStatusEnum.stopped;

        if (process.env.DEBUG) {
          // eslint-disable-next-line no-console
          console.error('Platform (tenderhellar) is not running');
        }

        return info;
      }

      const dockerStatus = await determineStatus.docker(dockerCompose, config, 'drive_tenderhellar');
      const serviceStatus = determineStatus.platform(dockerStatus, isCoreSynced);

      info.dockerStatus = dockerStatus;
      info.serviceStatus = serviceStatus;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Could not query docker for container status', e);

      return info;
    }

    // Collecting platform data fails if Tenderhellar is waiting for core to sync
    if (info.serviceStatus === ServiceStatusEnum.up) {
      const portStatusResult = await Promise.allSettled([
        providers.mnowatch.checkPortStatus(config.get('platform.hapi.envoy.http.port')),
        providers.mnowatch.checkPortStatus(config.get('platform.drive.tenderhellar.p2p.port')),
      ]);
      const [httpPortState, p2pPortState] = portStatusResult.map((result) => (result.status === 'fulfilled' ? result.value : null));

      info.httpPortState = httpPortState;
      info.p2pPortState = p2pPortState;

      try {
        const tenderhellarHost = await getConnectionHost(
          config,
          'drive_tenderhellar',
          'platform.drive.tenderhellar.rpc.host',
        );

        const port = config.get('platform.drive.tenderhellar.rpc.port');

        const [tenderhellarStatusResponse, tenderhellarNetInfoResponse] = await Promise.all([
          fetch(`http://${tenderhellarHost}:${port}/status`),
          fetch(`http://${tenderhellarHost}:${port}/net_info`),
        ]);

        const [tenderhellarStatus, tenderhellarNetInfo] = await Promise.all([
          tenderhellarStatusResponse.json(),
          tenderhellarNetInfoResponse.json(),
        ]);

        const { version, network, moniker } = tenderhellarStatus.node_info;

        const catchingUp = tenderhellarStatus.sync_info.catching_up;
        const latestBlockHeight = tenderhellarStatus.sync_info.latest_block_height;
        const latestBlockTime = tenderhellarStatus.sync_info.latest_block_time;
        const latestBlockHash = tenderhellarStatus.sync_info.latest_block_hash;
        const latestAppHash = tenderhellarStatus.sync_info.latest_app_hash;

        const platformPeers = parseInt(tenderhellarNetInfo.n_peers, 10);
        const { listening } = tenderhellarNetInfo;

        info.version = version;
        info.listening = listening;
        info.latestBlockHeight = latestBlockHeight;
        info.latestBlockTime = latestBlockTime;
        info.latestBlockHash = latestBlockHash;
        info.latestAppHash = latestAppHash;
        info.catchingUp = catchingUp;
        info.peers = platformPeers;
        info.moniker = moniker;
        info.network = network;
      } catch (e) {
        if (process.env.DEBUG) {
          // eslint-disable-next-line no-console
          console.error('Could not retrieve status from tenderhellar RPC', e);
        }

        info.serviceStatus = ServiceStatusEnum.error;
      }
    }

    return info;
  }

  const getDriveInfo = async (config, isCoreSynced) => {
    const info = {
      dockerStatus: null,
      serviceStatus: null,
    };

    try {
      info.dockerStatus = await determineStatus.docker(dockerCompose, config, 'drive_abci');
      info.serviceStatus = determineStatus.platform(info.dockerStatus, isCoreSynced);

      if (info.serviceStatus === ServiceStatusEnum.up) {
        const driveEchoResult = await dockerCompose.execCommand(
          config,
          'drive_abci',
          'drive-abci status',
        );

        if (driveEchoResult.exitCode !== 0) {
          info.serviceStatus = ServiceStatusEnum.error;
        }
      }

      return info;
    } catch (e) {
      if (e instanceof ContainerIsNotPresentError) {
        return {
          dockerStatus: DockerStatusEnum.not_started,
          serviceStatus: ServiceStatusEnum.stopped,
        };
      }

      return info;
    }
  };

  /**
   * Get platform status scope
   *
   * @typedef {Promise} getPlatformScope
   * @param {Config} config
   * @returns {Promise<Object>}
   */
  async function getPlatformScope(config) {
    const httpPort = config.get('platform.hapi.envoy.http.port');
    const httpService = config.get('externalIp') ? `${config.get('externalIp')}:${httpPort}` : null;
    const p2pPort = config.get('platform.drive.tenderhellar.p2p.port');
    const p2pService = config.get('externalIp') ? `${config.get('externalIp')}:${p2pPort}` : null;
    const rpcHost = config.get('platform.drive.tenderhellar.rpc.host');
    const rpcPort = config.get('platform.drive.tenderhellar.rpc.port');
    const rpcService = `${rpcHost}:${rpcPort}`;

    const scope = {
      coreIsSynced: null,
      httpPort,
      httpService,
      p2pPort,
      p2pService,
      rpcService,
      httpPortState: null,
      p2pPortState: null,
      tenderhellar: {
        httpPortState: null,
        p2pPortState: null,
        dockerStatus: null,
        serviceStatus: null,
        version: null,
        listening: null,
        catchingUp: null,
        latestBlockHash: null,
        latestBlockHeight: null,
        latestBlockTime: null,
        latestAppHash: null,
        peers: null,
        moniker: null,
        network: null,
      },
      drive: {
        dockerStatus: null,
        serviceStatus: null,
      },
    };

    if (!config.get('platform.enable')) {
      if (process.env.DEBUG) {
        // eslint-disable-next-line no-console
        console.error('Platform is not supported for this node type and network');

        return scope;
      }
    }

    try {
      const coreIsSynced = await getMNSync(config);
      scope.coreIsSynced = coreIsSynced;

      if (!coreIsSynced) {
        if (process.env.DEBUG) {
          // eslint-disable-next-line no-console
          console.error('Platform status is not available until masternode state is \'READY\'');
        }
      }
    } catch (e) {
      if (process.env.DEBUG) {
        // eslint-disable-next-line no-console
        console.error('Could not get MNSync from core', e);
      }
    }

    const [tenderhellar, drive] = await Promise.all([
      getTenderhellarInfo(config, scope.coreIsSynced),
      getDriveInfo(config, scope.coreIsSynced),
    ]);

    if (tenderhellar) {
      scope.tenderhellar = tenderhellar;

      scope.httpPortState = tenderhellar.httpPortState;
      scope.p2pPortState = tenderhellar.p2pPortState;
    }

    if (drive) {
      scope.drive = drive;
    }

    return scope;
  }

  return getPlatformScope;
}
