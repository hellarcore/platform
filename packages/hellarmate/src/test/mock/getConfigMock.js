export default function getConfigMock(sinon) {
  const configMock = {
    get: sinon.stub(),
    getName: sinon.stub(),
    toEnvs: sinon.stub(),
    getOptions: sinon.stub(),
  };

  configMock.get.withArgs('core.rpc.host').returns('127.0.0.1');
  configMock.get.withArgs('docker.network.privateInterface').returns('127.0.0.1');
  configMock.get.withArgs('docker.network.privateInterface').returns('127.0.0.1');
  configMock.get.withArgs('platform.hapi.envoy.http.port').returns('8100');
  configMock.get.withArgs('externalIp').returns('127.0.0.1');
  configMock.get.withArgs('platform.drive.tenderhellar.p2p.port').returns('8101');
  configMock.get.withArgs('platform.hapi.envoy.http.host').returns('0.0.0.0');
  configMock.get.withArgs('platform.hapi.envoy.http.port').returns('8102');
  configMock.get.withArgs('platform.drive.tenderhellar.rpc.host').returns('127.0.0.1');
  configMock.get.withArgs('platform.drive.tenderhellar.rpc.port').returns('8103');
  configMock.get.withArgs('platform.enable').returns(true);
  configMock.get.withArgs('core.log.file.path').returns('/Users/user/.hellarmate/logs/base/core.log');

  return configMock;
}
