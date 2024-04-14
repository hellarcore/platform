import hellarcoreLib from '@hellarpro/hellarcore-lib';
import { toHellar } from '../../util/satoshiConverter.js';
import { NETWORK_LOCAL } from '../../constants.js';
import wait from '../../util/wait.js';

const { PrivateKey } = hellarcoreLib;
/**
 *
 * @typedef waitForBalanceToConfirm
 * @param {CoreService} coreService
 * @param {string} network
 * @param {string} address
 * @param {function(balance: number)} [progressCallback]
 * @returns {Promise<void>}
 */
export default async function waitForBalanceToConfirm(
  coreService,
  network,
  address,
  progressCallback = () => {},
) {
  const privateKey = new PrivateKey();
  const randomAddress = privateKey.toAddress(network).toString();

  let balanceImmature = 0;
  do {
    if (network === NETWORK_LOCAL) {
      await coreService.getRpcClient().generateToAddress(1, randomAddress, 10000000);
    } else {
      await wait(2000);
    }

    ({ result: { balance_immature: balanceImmature } } = await coreService
      .getRpcClient()
      .getAddressBalance({
        addresses: [address],
      }));

    await progressCallback(toHellar(balanceImmature));
  } while (balanceImmature > 0);
}
