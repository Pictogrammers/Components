import { selectComponent, getProps } from '@pictogrammers/element';

import './modification';
import PgModification from './modification';

const PG_MODIFICATION = 'pg-modification';

describe('pg-modification', () => {

  beforeEach(() => {
    var c = document.createElement(PG_MODIFICATION);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_MODIFICATION)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getProps(PG_MODIFICATION);
    expect(props.length).toBe(3);
    expect(props).toContain('modifications');
    expect(props).toContain('edit');
    expect(props).toContain('github');
  });

});
