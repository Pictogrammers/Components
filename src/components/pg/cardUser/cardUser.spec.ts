import { selectComponent, getProps } from '@pictogrammers/element';

import './cardUser';
import PgCardUser from './cardUser';

const PG_CARD_USER = 'pg-card-user';

describe('pg-card-user', () => {

  beforeEach(() => {
    var c = document.createElement(PG_CARD_USER);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_CARD_USER)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getProps(PG_CARD_USER);
    expect(props.length).toBe(1);
    expect(props).toContain('user');
  });

  /*
  it('should default path value', () => {
    const component = selectComponent<PgIcon>(PG_CARD_USER);
    const { $path } = component;
    expect($path.getAttribute('d')).toEqual(DEFAULT_ICON);
  });

  it('path should be set', async () => {
    const component = selectComponent<PgIcon>(PG_CARD_USER);
    const { $path } = component;
    await component.setAttribute('path', ICON);
    expect($path.getAttribute('d')).toEqual(ICON);
  });
  */

});
