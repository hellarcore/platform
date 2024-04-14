const path = require('path');
const dotenvSafe = require('dotenv-safe');
const dotenvExpand = require('dotenv-expand');
const { expect, use } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const chaiAsPromised = require('chai-as-promised');

const hellarcoreOptions = require('@hellarpro/dp-services-ctl/lib/services/hellarcore/hellarcoreOptions');

use(sinonChai);
use(chaiAsPromised);
use(dirtyChai);

process.env.NODE_ENV = 'test';

const dotenvConfig = dotenvSafe.config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});
dotenvExpand(dotenvConfig);

process.env.LOG_LEVEL = 'silent';

const rootPath = process.cwd();

const hapiContainerOptions = {
  volumes: [
    `${rootPath}/lib:/platform/packages/hapi/lib`,
    `${rootPath}/scripts:/platform/packages/hapi/scripts`,
  ],
};

const hapiOptions = {
  cacheNodeModules: true,
  localAppPath: rootPath,
  container: hapiContainerOptions,
};

if (process.env.SERVICE_IMAGE_HAPI) {
  hapiOptions.container = {
    image: process.env.SERVICE_IMAGE_HAPI,
    ...hapiContainerOptions,
  };
}

if (process.env.SERVICE_IMAGE_CORE) {
  hellarcoreOptions.setDefaultCustomOptions({
    container: {
      image: process.env.SERVICE_IMAGE_CORE,
    },
  });
}

exports.mochaHooks = {
  beforeEach() {
    if (!this.sinon) {
      this.sinon = sinon.createSandbox();
    } else {
      this.sinon.restore();
    }
  },

  afterEach() {
    this.sinon.restore();
  },
};

global.expect = expect;
