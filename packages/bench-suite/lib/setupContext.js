const { convertCreditsToSatoshi } = require('@hellarpro/wasm-hpp/lib/utils/creditsConverter');

const createClientWithFundedWallet = require('./client/createClientWithFundedWallet');

/**
 * @param {Mocha} mocha
 * @param {AbstractBenchmark[]} benchmarks
 * @param {Object} options
 */
function setupContext(mocha, benchmarks, options) {
  const context = mocha.suite.ctx;

  // Create and fund client if required
  const requiredCredits = benchmarks.reduce(
    (sum, benchmark) => benchmark.getRequiredCredits() + sum,
    0,
  );

  if (requiredCredits > 0) {
    let satoshis = convertCreditsToSatoshi(requiredCredits);

    if (satoshis < 10000) {
      satoshis = 10000;
    }

    mocha.suite.beforeAll('Create and connect client', async () => {
      context.hellar = await createClientWithFundedWallet(
        satoshis + 5000,
        options.client,
      );
    });

    mocha.suite.beforeAll('Create identity', async () => {
      context.identity = await context.hellar.platform.identities.register(satoshis);
    });

    mocha.suite.afterAll('Disconnect client', async () => {
      if (context.hellar) {
        await context.hellar.disconnect();
      }
    });
  }
}

module.exports = setupContext;
