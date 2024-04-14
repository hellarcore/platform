import { EventEmitter } from 'events';
import { Account, Wallet } from '@hellarpro/wallet-lib';
import HAPIClientTransport from '@hellarpro/wallet-lib/src/transport/HAPIClientTransport/HAPIClientTransport';
import { Network } from '@hellarpro/hellarcore-lib';
import HAPIClient from '@hellarpro/hapi-client';
import { contractId as hpnsContractId } from '@hellarpro/hpns-contract/lib/systemIds';
import { contractId as hellarpayContractId } from '@hellarpro/hellarpay-contract/lib/systemIds';
import { contractId as masternodeRewardSharesContractId } from '@hellarpro/masternode-reward-shares-contract/lib/systemIds';
import { Platform } from './Platform';
import { ClientApps, ClientAppsOptions } from './ClientApps';

export interface WalletOptions extends Wallet.IWalletOptions {
  defaultAccountIndex?: number;
}

/**
 * Interface Client Options
 *
 * @param {ClientApps?} [apps] - applications
 * @param {WalletOptions} [wallet] - Wallet options
 * @param {HAPIAddressProvider} [hapiAddressProvider] - HAPI Address Provider instance
 * @param {Array<RawHAPIAddress|HAPIAddress|string>} [hapiAddresses] - HAPI addresses
 * @param {string[]|RawHAPIAddress[]} [seeds] - HAPI seeds
 * @param {string|Network} [network=evonet] - Network name
 * @param {number} [timeout=2000]
 * @param {number} [retries=3]
 * @param {number} [baseBanTime=60000]
 */
export interface ClientOpts {
  apps?: ClientAppsOptions,
  wallet?: WalletOptions,
  hapiAddressProvider?: any,
  hapiAddresses?: any[],
  seeds?: any[],
  network?: Network | string,
  timeout?: number,
  retries?: number,
  baseBanTime?: number,
  driveProtocolVersion?: number,
  blockHeadersProviderOptions?: any,
  blockHeadersProvider?: any
}

/**
 * Client class that wraps all components together
 * to allow integrated payments on both the Hellar Network (layer 1)
 * and the Hellar Platform (layer 2).
 */
export class Client extends EventEmitter {
  public network: string = 'testnet';

  public wallet: Wallet | undefined;

  public account: Account | undefined;

  public platform: Platform;

  public defaultAccountIndex: number | undefined = 0;

  private readonly hapiClient: HAPIClient;

  private readonly apps: ClientApps;

  private options: ClientOpts;

  /**
     * Construct some instance of SDK Client
     *
     * @param {ClientOpts} [options] - options for SDK Client
     */
  constructor(options: ClientOpts = {}) {
    super();

    this.options = options;

    this.network = this.options.network ? this.options.network.toString() : 'testnet';

    // Initialize HAPI Client
    const hapiClientOptions = {
      network: this.network,
      loggerOptions: {
        identifier: '',
      },
    };

    [
      'hapiAddressProvider',
      'hapiAddresses',
      'seeds',
      'timeout',
      'retries',
      'baseBanTime',
      'blockHeadersProviderOptions',
      'blockHeadersProvider',
    ].forEach((optionName) => {
      // eslint-disable-next-line
      if (this.options.hasOwnProperty(optionName)) {
        hapiClientOptions[optionName] = this.options[optionName];
      }
    });

    // Initialize a wallet if `wallet` option is preset
    if (this.options.wallet !== undefined) {
      if (this.options.wallet.network !== undefined
        && this.options.wallet.network !== this.network) {
        throw new Error('Wallet and Client networks are different');
      }

      this.wallet = new Wallet({
        transport: null,
        network: this.network,
        ...this.options.wallet,
      });

      // @ts-ignore
      this.wallet.on('error', (error, context) => (
        this.emit('error', error, { wallet: context })
      ));
    }

    hapiClientOptions.loggerOptions.identifier = this.wallet ? this.wallet.walletId : 'noid';

    this.hapiClient = new HAPIClient(hapiClientOptions);

    if (this.wallet) {
      this.wallet.transport = new HAPIClientTransport(this.hapiClient);
    }

    this.defaultAccountIndex = this.options.wallet?.defaultAccountIndex || 0;

    this.apps = new ClientApps({
      hpns: {
        contractId: hpnsContractId,
      },
      hellarpay: {
        contractId: hellarpayContractId,
      },
      masternodeRewardShares: {
        contractId: masternodeRewardSharesContractId,
      },
      ...this.options.apps,
    });

    this.platform = new Platform({
      client: this,
      network: this.network,
      driveProtocolVersion: this.options.driveProtocolVersion,
    });
  }

  /**
     * Get Wallet account
     *
     * @param {Account.Options} [options]
     * @returns {Promise<Account>}
     */
  async getWalletAccount(options: Account.Options = {}) : Promise<Account> {
    if (!this.wallet) {
      throw new Error('Wallet is not initialized, pass `wallet` option to Client');
    }

    options = {
      index: this.defaultAccountIndex,
      ...options,
    };

    return this.wallet.getAccount(options);
  }

  /**
     * disconnect wallet from Dapi
     * @returns {void}
     */
  async disconnect() {
    if (this.wallet) {
      await this.wallet.disconnect();
    }
  }

  /**
     * Get HAPI Client instance
     *
     * @returns {HAPIClient}
     */
  getHAPIClient() : HAPIClient {
    return this.hapiClient;
  }

  /**
     * fetch list of applications
     *
     * @remarks
     * check if returned value can be null on devnet
     *
     * @returns {ClientApps} applications list
     */
  getApps(): ClientApps {
    return this.apps;
  }
}

export default Client;
