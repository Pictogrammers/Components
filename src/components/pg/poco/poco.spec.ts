import { selectComponent, getProps } from '@pictogrammers/element';

import './poco';
import PgPoco from './poco';

const PG_POCO = 'pg-poco';

describe('pg-poco', () => {

  beforeEach(() => {
    var c = document.createElement(PG_POCO);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_POCO)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getProps(PG_POCO);
    expect(props.length).toBe(2);
  });

});
