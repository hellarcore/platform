import dotenv from 'dotenv';
import { asValue } from 'awilix';
import createDIContainer from '../src/createDIContainer.js';

(async function main() {
  // Read environment variables from .env file
  dotenv.config();

  const args = process.argv.slice(2);

  if (args.length !== 1) {
    throw new Error('please specify config name: "yarn workspace hellarmate helper testnet"');
  }

  const [configName] = args;

  // eslint-disable-next-line no-console
  console.info('Starting hellarmate helper');

  const container = await createDIContainer(process.env);

  // Load configs
  /**
   * @type {ConfigFileJsonRepository}
   */
  const configFileRepository = container.resolve('configFileRepository');
  /**
   * @type {writeConfigTemplates}
   */
  const writeConfigTemplates = container.resolve('writeConfigTemplates');

  const configFile = await configFileRepository.read();

  // Persist config if it was migrated
  if (configFile.isChanged()) {
    await configFileRepository.write(configFile);

    configFile.getAllConfigs()
      .filter((config) => config.isChanged())
      .forEach(writeConfigTemplates);
  }

  const config = configFile.getConfig(configName);

  // Register config collection in the container
  container.register({
    configFile: asValue(configFile),
  });

  const provider = config.get('platform.hapi.envoy.ssl.provider');
  const isEnabled = config.get('platform.hapi.envoy.ssl.enabled');

  if (isEnabled && provider === 'zerossl') {
    const scheduleRenewZeroSslCertificate = container.resolve('scheduleRenewZeroSslCertificate');
    await scheduleRenewZeroSslCertificate(config);
  } else {
    // prevent infinite restarts
    setInterval(() => {
    }, 60 * 1000);
  }

  if (config.get('hellarmate.helper.api.enable')) {
    const createHttpApiServer = container.resolve('createHttpApiServer');

    const httpAPIServer = createHttpApiServer();

    const port = config.get('hellarmate.helper.api.port');

    httpAPIServer
      // eslint-disable-next-line no-console
      .listen(port, () => console.log(`Hellarmate JSON-RPC API started on port ${port}`));
  }
}());
