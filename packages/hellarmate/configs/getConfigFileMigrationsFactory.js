/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';

import {
  NETWORK_LOCAL,
  NETWORK_TESTNET,
  NETWORK_MAINNET,
  SSL_PROVIDERS,
} from '../src/constants.js';

/**
 * @param {HomeDir} homeDir
 * @param {DefaultConfigs} defaultConfigs
 * @returns {getConfigFileMigrations}
 */
export default function getConfigFileMigrationsFactory(homeDir, defaultConfigs) {
  /**
   * @typedef {function} getConfigFileMigrations
   * @returns {Object}
   */
  function getConfigFileMigrations() {
    const base = defaultConfigs.get('base');
    const testnet = defaultConfigs.get('testnet');

    return {
      '0.24.0': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            // Update images
            options.core.docker.image = base.get('core.docker.image');

            options.core.sentinel.docker.image = base.get('core.sentinel.docker.image');

            options.hellarmate.helper.docker.image = base.get('hellarmate.helper.docker.image');

            options.platform.drive.tenderhellar.docker.image = base.get('platform.drive.tenderhellar.docker.image');

            options.platform.drive.abci.docker.image = base.get('platform.drive.abci.docker.image');

            options.platform.hapi.api.docker.image = base.get('platform.hapi.api.docker.image');

            options.platform.hapi.envoy.docker.image = base.get('platform.hapi.envoy.docker.image');
          });

        return configFile;
      },
      '0.24.12': (configFile) => {
        let i = 0;
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            // Update hellarmate helper port
            options.hellarmate.helper.api.port = base.get('hellarmate.helper.api.port');

            // Add pprof config
            options.platform.drive.tenderhellar.pprof = base.get('platform.drive.tenderhellar.pprof');

            // Set different ports for local netwrok if exists
            if (options.group === 'local') {
              options.platform.drive.tenderhellar.pprof.port += i * 100;

              i++;
            }
          });

        return configFile;
      },
      '0.24.13': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.core.docker.image = base.get('core.docker.image');
          });

        return configFile;
      },
      '0.24.15': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.docker.network.bindIp = base.get('docker.network.bindIp');

            if (options.network === 'testnet') {
              options.platform.drive.tenderhellar
                .genesis.initial_core_chain_locked_height = testnet.get('platform.drive.tenderhellar.genesis.initial_core_chain_locked_height');
            }
          });

        return configFile;
      },
      '0.24.16': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.platform.hapi.envoy.docker = base.get('platform.hapi.envoy.docker');

            options.platform.hapi.api.docker.build = base.get('platform.hapi.api.docker.build');

            options.platform.drive.abci.docker.build = base.get('platform.drive.abci.docker.build');

            options.hellarmate.helper.docker.build = base.get('hellarmate.helper.docker.build');

            delete options.hellarmate.helper.docker.image;
            delete options.core.reindex;

            if (options.network === 'testnet') {
              options.platform.drive.tenderhellar.genesis.chain_id = testnet.get('platform.drive.tenderhellar.genesis.chain_id');
            }
          });

        return configFile;
      },
      '0.24.17': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.docker.baseImage = base.get('docker.baseImage');
          });

        return configFile;
      },
      '0.24.20': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.core.docker.image = base.get('core.docker.image');
          });
        return configFile;
      },
      '0.24.22': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            if (options.core.masternode.enable) {
              options.platform.drive.tenderhellar.mode = 'validator';
            } else {
              options.platform.drive.tenderhellar.mode = 'full';
            }
          });
        return configFile;
      },
      '0.25.0-dev.18': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            delete options.core.sentinel;

            if ([NETWORK_LOCAL, NETWORK_TESTNET].includes(options.network)) {
              options.core.docker.image = base.get('core.docker.image');
            }
          });
        return configFile;
      },
      '0.25.0-dev.29': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([name, options]) => {
            if (options.network !== NETWORK_MAINNET) {
              options.core.docker.image = base.get('core.docker.image');

              options.platform.hapi.api.docker.image = base.get('platform.hapi.api.docker.image');
              options.platform.drive.abci.docker.image = base.get('platform.drive.abci.docker.image');
              options.platform.drive.tenderhellar.docker.image = base.get('platform.drive.tenderhellar.docker.image');
            }

            if (options.platform.drive.abci.log.jsonFile.level === 'fatal') {
              options.platform.drive.abci.log.jsonFile.level = 'error';
            }

            if (options.platform.drive.abci.log.prettyFile.level === 'fatal') {
              options.platform.drive.abci.log.prettyFile.level = 'error';
            }

            if (options.network === NETWORK_TESTNET) {
              options.platform.drive.tenderhellar.genesis.chain_id = testnet.get('platform.drive.tenderhellar.genesis.chain_id');
              options.platform.drive.tenderhellar
                .genesis.initial_core_chain_locked_height = testnet.get('platform.drive.tenderhellar.genesis.initial_core_chain_locked_height');
            }

            if (defaultConfigs.has(name) && !options.platform.drive.tenderhellar.metrics) {
              options.platform.drive.tenderhellar.metrics = defaultConfigs.get(name).get('platform.drive.tenderhellar.metrics');
            }
          });
        return configFile;
      },
      '0.25.0-dev.30': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            if (options.network === NETWORK_TESTNET) {
              options.platform.drive.tenderhellar.p2p.seeds = testnet.get('platform.drive.tenderhellar.p2p.seeds');
            }
          });
        return configFile;
      },
      '0.25.0-dev.32': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            if (options.network !== NETWORK_MAINNET) {
              options.core.docker.image = base.get('core.docker.image');
            }

            if (options.network === NETWORK_TESTNET) {
              options.platform.drive.tenderhellar.genesis.chain_id = testnet.get('platform.drive.tenderhellar.genesis.chain_id');
              options.platform.drive.tenderhellar.genesis.genesis_time = testnet.get('platform.drive.tenderhellar.genesis.genesis_time');
            }
          });
        return configFile;
      },
      '0.25.0-dev.33': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.platform.drive.abci.epochTime = base.get('platform.drive.abci.epochTime');
            options.platform.drive.tenderhellar.docker.image = base.get('platform.drive.tenderhellar.docker.image');
            options.platform.drive.tenderhellar.log.path = null;

            if (options.platform.drive.abci.log.jsonFile.level === 'fatal') {
              options.platform.drive.abci.log.jsonFile.level = 'error';
            }

            if (options.platform.drive.abci.log.prettyFile.level === 'fatal') {
              options.platform.drive.abci.log.prettyFile.level = 'error';
            }

            if (options.network === NETWORK_TESTNET) {
              options.platform.drive.tenderhellar.genesis.chain_id = testnet.get('platform.drive.tenderhellar.genesis.chain_id');
              options.platform.drive.tenderhellar.genesis.genesis_time = testnet.get('platform.drive.tenderhellar.genesis.genesis_time');
              options.platform.drive.tenderhellar.genesis
                .initial_core_chain_locked_height = testnet.get('platform.drive.tenderhellar.genesis.initial_core_chain_locked_height');
            }

            if (options.network !== NETWORK_MAINNET) {
              options.core.docker.image = base.get('core.docker.image');
            }
          });

        return configFile;
      },
      '0.25.3': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([name, options]) => {
            if (options.network === NETWORK_TESTNET && name !== 'base') {
              options.platform.drive.abci.epochTime = testnet.get('platform.drive.abci.epochTime');
            }
            options.platform.drive.abci.docker.image = base.get('platform.drive.abci.docker.image');
            options.platform.hapi.api.docker.image = base.get('platform.hapi.api.docker.image');
          });

        return configFile;
      },
      '0.25.4': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            delete options.platform.drive.abci.log;

            options.platform.drive.abci.logs = base.get('platform.drive.abci.logs');
          });

        return configFile;
      },
      '0.25.7': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([name, options]) => {
            if (options.network !== NETWORK_MAINNET) {
              const filenames = ['private.key', 'bundle.crt', 'bundle.csr', 'csr.pem'];

              for (const filename of filenames) {
                const oldFilePath = homeDir.joinPath('ssl', name, filename);
                const newFilePath = homeDir.joinPath(
                  name,
                  'platform',
                  'hapi',
                  'envoy',
                  'ssl',
                  filename,
                );

                if (fs.existsSync(oldFilePath)) {
                  fs.mkdirSync(path.dirname(newFilePath), { recursive: true });
                  fs.copyFileSync(oldFilePath, newFilePath);
                  fs.rmSync(oldFilePath, { recursive: true });
                }
              }
            }
          });

        if (fs.existsSync(homeDir.joinPath('ssl'))) {
          fs.rmSync(homeDir.joinPath('ssl'), { recursive: true });
        }

        return configFile;
      },
      '0.25.11': (configFile) => {
        if (configFile.configs.base) {
          configFile.configs.base.core.docker.image = base.get('core.docker.image');
        }
        if (configFile.configs.local) {
          configFile.configs.local.platform.hapi.envoy.ssl.provider = SSL_PROVIDERS.SELF_SIGNED;
        }

        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.platform.drive.tenderhellar.log.level = 'info';

            if (options.network !== NETWORK_MAINNET && options.network !== NETWORK_TESTNET) {
              options.core.docker.image = base.get('core.docker.image');
            }

            options.core.docker.commandArgs = [];
          });

        return configFile;
      },
      '0.25.12': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([name, options]) => {
            options.platform.drive.tenderhellar.docker.image = base.get('platform.drive.tenderhellar.docker.image');

            if (options.network === NETWORK_TESTNET) {
              options.core.docker.image = base.get('core.docker.image');

              if (name !== base.getName()) {
                options.platform.drive.tenderhellar.genesis.chain_id = testnet.get('platform.drive.tenderhellar.genesis.chain_id');
                options.platform.drive.tenderhellar.genesis.initial_core_chain_locked_height = testnet.get('platform.drive.tenderhellar.genesis.initial_core_chain_locked_height');
                options.platform.drive.tenderhellar.genesis.genesis_time = testnet.get('platform.drive.tenderhellar.genesis.genesis_time');
              }
            }
          });

        return configFile;
      },
      '0.25.16-rc.1': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([name, options]) => {
            options.core.insight = base.get('core.insight');
            options.core.docker.image = base.get('core.docker.image');

            if (options.network === NETWORK_TESTNET && name !== base.getName()) {
              options.platform.drive.tenderhellar.genesis.chain_id = testnet.get('platform.drive.tenderhellar.genesis.chain_id');
              options.platform.drive.tenderhellar.genesis.initial_core_chain_locked_height = testnet.get('platform.drive.tenderhellar.genesis.initial_core_chain_locked_height');
              options.platform.drive.tenderhellar.genesis.genesis_time = testnet.get('platform.drive.tenderhellar.genesis.genesis_time');
            }
          });

        return configFile;
      },
      '0.25.16-rc.5': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([name, options]) => {
            if (options.network === NETWORK_TESTNET && name !== base.getName()) {
              options.platform.drive.tenderhellar.genesis.chain_id = testnet.get('platform.drive.tenderhellar.genesis.chain_id');
              options.platform.drive.tenderhellar.genesis.initial_core_chain_locked_height = testnet.get('platform.drive.tenderhellar.genesis.initial_core_chain_locked_height');
              options.platform.drive.tenderhellar.genesis.genesis_time = testnet.get('platform.drive.tenderhellar.genesis.genesis_time');
            }
          });

        return configFile;
      },
      '0.25.16-rc.6': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.core.docker.image = base.get('core.docker.image');
          });

        return configFile;
      },
      '0.25.16-rc.7': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.platform.drive.tenderhellar.docker.image = base.get('platform.drive.tenderhellar.docker.image');

            delete options.docker.network.bindIp;

            options.core.p2p.host = base.get('core.p2p.host');
            options.core.rpc.host = base.get('core.rpc.host');
            options.platform.hapi.envoy.http.host = base.get('platform.hapi.envoy.http.host');
            options.platform.drive.tenderhellar.p2p.host = base.get('platform.drive.tenderhellar.p2p.host');
            options.platform.drive.tenderhellar.rpc.host = base.get('platform.drive.tenderhellar.rpc.host');
            options.platform.drive.tenderhellar.metrics.host = base.get('platform.drive.tenderhellar.metrics.host');
          });

        return configFile;
      },
      '0.25.19': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([, options]) => {
            options.platform.drive.tenderhellar.docker.image = base.get('platform.drive.tenderhellar.docker.image');
          });

        return configFile;
      },
      '0.25.20': (configFile) => {
        Object.entries(configFile.configs)
          .forEach(([name, options]) => {
            options.platform.hapi.envoy.http.connectTimeout = base.get('platform.hapi.envoy.http.connectTimeout');
            options.platform.hapi.envoy.http.responseTimeout = base.get('platform.hapi.envoy.http.responseTimeout');

            options.platform.drive.tenderhellar.rpc.maxOpenConnections = base.get('platform.drive.tenderhellar.rpc.maxOpenConnections');

            let defaultConfigName = 'base';
            if (options.group === 'local' || name === 'local') {
              defaultConfigName = 'local';
            }
            const defaultConfig = defaultConfigs.get(defaultConfigName);

            options.platform.drive.tenderhellar.p2p.flushThrottleTimeout = defaultConfig.get('platform.drive.tenderhellar.p2p.flushThrottleTimeout');
            options.platform.drive.tenderhellar.p2p.maxPacketMsgPayloadSize = defaultConfig.get('platform.drive.tenderhellar.p2p.maxPacketMsgPayloadSize');
            options.platform.drive.tenderhellar.p2p.sendRate = defaultConfig.get('platform.drive.tenderhellar.p2p.sendRate');
            options.platform.drive.tenderhellar.p2p.recvRate = defaultConfig.get('platform.drive.tenderhellar.p2p.recvRate');

            options.platform.drive.tenderhellar.mempool = base.get('platform.drive.tenderhellar.mempool');
            options.platform.drive.tenderhellar.consensus.peer = base.get('platform.drive.tenderhellar.consensus.peer');
            options.platform.drive.tenderhellar.consensus.unsafeOverride = base.get('platform.drive.tenderhellar.consensus.unsafeOverride');
          });

        return configFile;
      },
    };
  }

  return getConfigFileMigrations;
}
