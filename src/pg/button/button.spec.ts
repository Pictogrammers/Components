import { selectComponent, getProps } from '@pictogrammers/element';

import './button';
import PgButton from './button';

const PG_BUTTON = 'pg-button';

describe('pg-button', () => {

  beforeEach(() => {
    var c = document.createElement(PG_BUTTON);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_BUTTON)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getProps(PG_BUTTON);
    expect(props.length).toBe(5);
    expect(props).toContain('active');
    expect(props).toContain('block');
    expect(props).toContain('start');
    expect(props).toContain('center');
    expect(props).toContain('end');
  });

});
