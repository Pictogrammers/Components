import { selectComponent } from '@pictogrammers/element';

import './buttonGroup';
import PgButtonGroup from './buttonGroup';

const PG_BUTTON_GROUP = 'pg-button-group';

describe('pg-button-group', () => {

  beforeEach(() => {
    var c = document.createElement(PG_BUTTON_GROUP);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_BUTTON_GROUP)).toBeDefined();
  });

  it('should only expose known props', () => {
    const { symbols } = customElements.get(PG_BUTTON_GROUP);
    const props = Object.keys(symbols);
    expect(props.length).toBe(0);
  });

});
