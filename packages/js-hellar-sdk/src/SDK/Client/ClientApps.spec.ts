import { Identifier } from '@hellarpro/wasm-hpp';
import { expect } from 'chai';
import { ClientApps } from './ClientApps';
import 'mocha';

describe('ClientApps', () => {
  let apps;
  it('constructor', () => {
    apps = new ClientApps();
    expect(apps.apps).to.deep.equal({});
  });
  it('.set', () => {
    apps.set('hpns', {
      contractId: '3VvS19qomuGSbEYWbTsRzeuRgawU3yK4fPMzLrbV62u8',
      contract: { someField: true },
    });
    apps.set('tutorialContract', {
      contractId: '3VvS19qomuGSbEYWbTsRzeuRgawU3yK4fPMzLrbV62u8',
      contract: { someField: true },
    });
  });
  it('should get', () => {
    const getByName = apps.get('hpns');
    expect(getByName).to.deep.equal({
      contractId: Identifier.from('3VvS19qomuGSbEYWbTsRzeuRgawU3yK4fPMzLrbV62u8'),
      contract: { someField: true },
    });
  });

  it('should .getNames()', () => {
    const names = apps.getNames();
    expect(names).to.deep.equal(['hpns', 'tutorialContract']);
  });
  it('should .has', () => {
    expect(apps.has('hpns')).to.equal(true);
    expect(apps.has('tutorialContract')).to.equal(true);
    expect(apps.has('tutorialContractt')).to.equal(false);
  });
});
