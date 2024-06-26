import path from 'path';

import HPNSContract from '@hellarpro/hpns-contract/lib/systemIds.js';

import HellarPayContract from '@hellarpro/hellarpay-contract/lib/systemIds.js';

import FeatureFlagsContract from '@hellarpro/feature-flags-contract/lib/systemIds.js';

import MasternodeRewardSharesContract from '@hellarpro/masternode-reward-shares-contract/lib/systemIds.js';

import WithdrawalsContract from '@hellarpro/withdrawals-contract/lib/systemIds.js';

import semver from 'semver';

import fs from 'fs';
import {
  NETWORK_TESTNET, PACKAGE_ROOT_DIR,
} from '../../src/constants.js';
import Config from '../../src/config/Config.js';

const { contractId: hpnsContractId, ownerId: hpnsOwnerId } = HPNSContract;

const { contractId: hellarpayContractId } = HellarPayContract;

const { contractId: featureFlagsContractId, ownerId: featureFlagsOwnerId } = FeatureFlagsContract;
const { contractId: masternodeRewardSharesContractId } = MasternodeRewardSharesContract;
const { contractId: withdrawalsContractId } = WithdrawalsContract;

const { version } = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT_DIR, 'package.json'), 'utf8'));

/**
 * @param {HomeDir} homeDir
 * @returns {getBaseConfig}
 */
export default function getBaseConfigFactory(homeDir) {
  const prereleaseTag = semver.prerelease(version) === null ? '' : `-${semver.prerelease(version)[0]}`;
  const dockerImageVersion = `${semver.major(version)}.${semver.minor(version)}${prereleaseTag}`;

  /**
   * @typedef {function} getBaseConfig
   * @returns {Config}
   */
  function getBaseConfig() {
    const options = {
      description: 'base config for use as template',
      group: null,
      docker: {
        network: {
          subnet: '0.0.0.0/0',
        },
        baseImage: {
          build: {
            enabled: false,
            context: path.join(PACKAGE_ROOT_DIR, '..', '..'),
            dockerFile: path.join(PACKAGE_ROOT_DIR, '..', '..', 'Dockerfile'),
            target: '',
          },
        },
      },
      core: {
        insight: {
          enabled: false,
          ui: {
            enabled: false,
            docker: {
              image: 'hellarpay/insight:latest',
            },
          },
          docker: {
            image: 'hellarpay/insight-api:latest',
          },
          port: 3001,
        },
        docker: {
          image: 'hellarpay/hellard:20', commandArgs: [],
        },
        p2p: {
          host: '0.0.0.0',
          port: 9999,
          seeds: [],
        },
        rpc: {
          host: '127.0.0.1',
          port: 9998,
          user: 'hellarrpc',
          password: 'rpcpassword',
          allowIps: ['127.0.0.1', '172.16.0.0/12', '192.168.0.0/16'],
        },
        spork: {
          address: null, privateKey: null,
        },
        masternode: {
          enable: true,
          operator: {
            privateKey: null,
          },
        },
        miner: {
          enable: false, interval: '2.5m', mediantime: null, address: null,
        },
        devnet: {
          name: null, minimumDifficultyBlocks: 0, powTargetSpacing: 150,
        },
        log: {
          file: {
            categories: [], path: homeDir.joinPath('logs', 'base', 'core.log'),
          },
        },
        logIps: 0,
        indexes: true,
      },
      platform: {
        hapi: {
          envoy: {
            docker: {
              image: 'hellarpay/envoy:1.22.11',
            },
            http: {
              host: '0.0.0.0',
              port: 443,
              connectTimeout: '5s',
              responseTimeout: '15s',
            },
            rateLimiter: {
              maxTokens: 300, tokensPerFill: 150, fillInterval: '60s', enabled: true,
            },
            ssl: {
              enabled: false,
              provider: 'zerossl',
              providerConfigs: {
                zerossl: {
                  apiKey: null, id: null,
                },
              },
            },
          },
          api: {
            docker: {
              image: `hellarpay/hapi:${dockerImageVersion}`,
              build: {
                enabled: false,
                context: path.join(PACKAGE_ROOT_DIR, '..', '..'),
                dockerFile: path.join(PACKAGE_ROOT_DIR, '..', '..', 'Dockerfile'),
                target: 'hapi',
              },
            },
          },
        },
        drive: {
          abci: {
            docker: {
              image: `hellarpay/drive:${dockerImageVersion}`,
              build: {
                enabled: false,
                context: path.join(PACKAGE_ROOT_DIR, '..', '..'),
                dockerFile: path.join(PACKAGE_ROOT_DIR, '..', '..', 'Dockerfile'),
                target: 'drive-abci',
              },
            },
            logs: {
              stdout: {
                destination: 'stdout', level: 'info', format: 'compact', color: true,
              },
            },
            validatorSet: {
              llmqType: 4,
            },
            epochTime: 788400,
          },
          tenderhellar: {
            mode: 'full',
            docker: {
              image: 'hellarpay/tenderhellar:fix-ordered-map',
            },
            p2p: {
              host: '0.0.0.0',
              port: 26656,
              persistentPeers: [],
              seeds: [],
              flushThrottleTimeout: '100ms',
              maxPacketMsgPayloadSize: 10240,
              sendRate: 5120000,
              recvRate: 5120000,
            },
            rpc: {
              host: '127.0.0.1',
              port: 26657,
              maxOpenConnections: 900,
            },
            pprof: {
              enabled: false, port: 6060,
            },
            metrics: {
              enabled: false,
              host: '127.0.0.1',
              port: 26660,
            },
            mempool: {
              size: 5000,
              maxTxsBytes: 1073741824,
            },
            consensus: {
              createEmptyBlocks: true,
              createEmptyBlocksInterval: '3m',
              peer: {
                gossipSleepDuration: '100ms',
                queryMaj23SleepDuration: '2s',
              },
              unsafeOverride: {
                propose: {
                  timeout: null,
                  delta: null,
                },
                vote: {
                  timeout: null,
                  delta: null,
                },
                commit: {
                  timeout: null,
                  bypass: null,
                },
              },
            },
            log: {
              level: 'info', format: 'plain', path: null,
            },
            node: {
              id: null, key: null,
            },
            genesis: {
              consensus_params: {
                block: {
                  max_bytes: '22020096', max_gas: '-1', time_iota_ms: '5000',
                },
                evidence: {
                  max_age: '100000', max_age_num_blocks: '100000', max_age_duration: '172800000000000',
                },
                validator: {
                  pub_key_types: ['bls12381'],
                },
                version: {
                  app_version: '1',
                },
              },
            },
            moniker: null,
          },
        },
        hpns: {
          contract: {
            id: hpnsContractId,
          },
          ownerId: hpnsOwnerId,
          masterPublicKey: null,
          secondPublicKey: null,
        },
        hellarpay: {
          contract: {
            id: hellarpayContractId,
          },
          masterPublicKey: null,
          secondPublicKey: null,
        },
        featureFlags: {
          contract: {
            id: featureFlagsContractId,
          },
          ownerId: featureFlagsOwnerId,
          masterPublicKey: null,
          secondPublicKey: null,
        },
        sourcePath: null,
        masternodeRewardShares: {
          contract: {
            id: masternodeRewardSharesContractId,
          },
          masterPublicKey: null,
          secondPublicKey: null,
        },
        withdrawals: {
          contract: {
            id: withdrawalsContractId,
          },
          masterPublicKey: null,
          secondPublicKey: null,
        },
        enable: true,
      },
      hellarmate: {
        helper: {
          docker: {
            build: {
              enabled: false,
              context: path.join(PACKAGE_ROOT_DIR, '..', '..'),
              dockerFile: path.join(PACKAGE_ROOT_DIR, '..', '..', 'Dockerfile'),
              target: 'hellarmate-helper',
            },
          },
          api: {
            enable: false, port: 9100,
          },
        },
      },
      externalIp: null,
      network: NETWORK_TESTNET,
      environment: 'production',
    };

    return new Config('base', options);
  }

  return getBaseConfig;
}
