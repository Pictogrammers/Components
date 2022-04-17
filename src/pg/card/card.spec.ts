import { selectComponent, getAttributes } from '@pictogrammers/element';

import './card';
import PgCard from './card';

const PG_CARD = 'pg-card';

describe('pg-card', () => {

  beforeEach(() => {
    var c = document.createElement(PG_CARD);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_CARD)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getAttributes(PG_CARD);
    expect(props.length).toBe(0);
  });

});
