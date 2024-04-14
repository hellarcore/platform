import path from 'path';
import os from 'os';
import convertObjectToEnvs from './convertObjectToEnvs.js';
import { HELLARMATE_HELPER_DOCKER_IMAGE } from '../constants.js';

/**
 * @param {ConfigFile} configFile
 * @param {HomeDir} homeDir
 * @param {getConfigProfiles} getConfigProfiles
 * @return {generateEnvs}
 */
export default function generateEnvsFactory(configFile, homeDir, getConfigProfiles) {
  /**
   * @typedef {function} generateEnvs
   * @param {Config} config
   * @returns {{
   * COMPOSE_DOCKER_CLI_BUILD: number,
   * CONFIG_NAME: string,
   * DOCKER_BUILDKIT: number,
   * COMPOSE_PROJECT_NAME: string,
   * COMPOSE_FILE: string,
   * COMPOSE_PATH_SEPARATOR: string,
   * CORE_LOG_DIRECTORY_PATH: string
   * }}
   */
  function generateEnvs(config) {
    const dynamicComposePath = homeDir.joinPath(
      config.getName(),
      'dynamic-compose.yml',
    );

    const dockerComposeFiles = ['docker-compose.yml', dynamicComposePath];

    const profiles = getConfigProfiles(config);

    if (config.get('hellarmate.helper.docker.build.enabled')) {
      dockerComposeFiles.push('docker-compose.build.hellarmate_helper.yml');
    }

    if (config.get('platform.enable')) {
      if (config.get('platform.drive.abci.docker.build.enabled')) {
        dockerComposeFiles.push('docker-compose.build.drive_abci.yml');
      }

      if (config.get('platform.hapi.api.docker.build.enabled')) {
        dockerComposeFiles.push('docker-compose.build.hapi_api.yml');
        dockerComposeFiles.push('docker-compose.build.hapi_tx_filter_stream.yml');
      }
    }

    if (config.get('core.insight.enabled')) {
      let insightComposeFile = 'docker-compose.insight_api.yml';
      if (config.get('core.insight.ui.enabled')) {
        insightComposeFile = 'docker-compose.insight_ui.yml';
      }
      dockerComposeFiles.push(insightComposeFile);
    }

    // we need this for compatibility with old configs
    const projectIdWithPrefix = configFile.getProjectId() ? `_${configFile.getProjectId()}` : '';

    const { uid, gid } = os.userInfo();

    // Determine logs directory to mount into tenderhellar container
    let tenderhellarLogDirectoryPath = homeDir.joinPath('logs', config.get('network'));
    const tenderhellarLogFilePath = config.get('platform.drive.tenderhellar.log.path');
    if (tenderhellarLogFilePath !== null) {
      tenderhellarLogDirectoryPath = path.dirname(tenderhellarLogFilePath);
    }

    return {
      HELLARMATE_HOME_DIR: homeDir.getPath(),
      LOCAL_UID: uid,
      LOCAL_GID: gid,
      COMPOSE_PROJECT_NAME: `hellarmate${projectIdWithPrefix}_${config.getName()}`,
      CONFIG_NAME: config.getName(),
      COMPOSE_FILE: dockerComposeFiles.join(':'),
      COMPOSE_PROFILES: profiles.join(','),
      COMPOSE_PATH_SEPARATOR: ':',
      DOCKER_BUILDKIT: 1,
      COMPOSE_DOCKER_CLI_BUILD: 1,
      CORE_LOG_DIRECTORY_PATH: path.dirname(
        config.get('core.log.file.path'),
      ),
      HELLARMATE_HELPER_DOCKER_IMAGE,
      PLATFORM_DRIVE_TENDERHELLAR_LOG_DIRECTORY_PATH: tenderhellarLogDirectoryPath,
      ...convertObjectToEnvs(config.getOptions()),
    };
  }

  return generateEnvs;
}
