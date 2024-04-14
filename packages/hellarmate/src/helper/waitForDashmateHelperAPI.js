import wait from '../util/wait.js';

/**
 * Wait for Hellarmate helper HTTP API to start
 *
 * @typedef {waitForHellarmateHelperAPI}
 * @param {Config} config
 * @param {{maxRetries: number, delay: number}} [options] maxRetries default is 120s
 * @return {Promise<void>}
 */
export default async function waitForHellarmateHelperAPI(config, options =
{ maxRetries: 120, delay: 1000 }) {
  if (!config.get('hellarmate.helper.api.enable')) {
    throw new Error(`Hellarmate helper HTTP API is not enabled for ${config.getName()}`);
  }

  let retries = 0;
  let isReady = false;

  const { maxRetries, delay } = options;

  const host = '127.0.0.1';
  const port = config.get('hellarmate.helper.api.port');

  do {
    try {
      const response = await fetch(`http://${host}:${port}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'id',
          method: 'status',
          params: {
            format: 'json',
            config: config.getName(),
          },
        }),
      });

      isReady = response.status === 200;
    } catch (e) {
      ++retries;
    } finally {
      // just wait 1 second before next try
      await wait(delay);
    }
  } while (!isReady && retries < maxRetries);

  if (!isReady) {
    throw new Error('Could not connect to Hellarmate Helper HTTP API');
  }
}
