import { selectComponent, getAttributes } from '@pictogrammers/element';

import './icon';
import PgIcon from './icon';

const PG_ICON = 'pg-icon';
const ICON = 'M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z';
const DEFAULT_ICON = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

describe('pg-icon', () => {

  beforeEach(() => {
    var c = document.createElement(PG_ICON);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_ICON)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getAttributes(PG_ICON);
    expect(props.length).toBe(1);
    expect(props).toContain('path');
  });

  it('should default path value', () => {
    const component = selectComponent<PgIcon>(PG_ICON);
    const { $path } = component;
    expect($path.getAttribute('d')).toEqual(DEFAULT_ICON);
  });

  it('path should be set', async () => {
    const component = selectComponent<PgIcon>(PG_ICON);
    const { $path } = component;
    await component.setAttribute('path', ICON);
    expect($path.getAttribute('d')).toEqual(ICON);
  });

});
