import { Listr } from 'listr2';
import wait from '../../../util/wait.js';

/**
 *
 * @param {createTenderhellarRpcClient} createTenderhellarRpcClient
 * @return {waitForNodeToBeReadyTask}
 */
export default function waitForNodeToBeReadyTaskFactory(
  createTenderhellarRpcClient,
) {
  /**
   * @typedef waitForNodeToBeReadyTask
   * @param {Config} config
   * @return {Promise<void>}
   */
  async function waitForNodeToBeReadyTask(config) {
    return new Listr([
      {
        title: `Wait for node ${config.getName()} to be ready`,
        task: async () => {
          const host = config.get('platform.drive.tenderhellar.rpc.host');
          const port = config.get('platform.drive.tenderhellar.rpc.port');

          const tenderhellarRpcClient = createTenderhellarRpcClient({ host, port });

          let success = false;
          do {
            const response = await tenderhellarRpcClient.request('status', {}).catch(() => {});

            if (response) {
              success = !response.result.sync_info.catching_up;
            }

            if (!success) {
              await wait(500);
            }
          } while (!success);
        },
      },
    ]);
  }

  return waitForNodeToBeReadyTask;
}
