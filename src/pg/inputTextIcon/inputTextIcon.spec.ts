import { selectComponent } from '@pictogrammers/element';

import './inputTextIcon';
import PgInputTextIcon from './inputTextIcon';

const PG_INPUT_TEXT_ICON = 'pg-input-text-icon';

describe('pg-input-text-icon', () => {

  beforeEach(() => {
    var c = document.createElement(PG_INPUT_TEXT_ICON);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_INPUT_TEXT_ICON)).toBeDefined();
  });

  it('should only expose known props', () => {
    const { symbols } = customElements.get(PG_INPUT_TEXT_ICON);
    const props = Object.keys(symbols);
    expect(props).toContain('path');
  });

  it('should default path to square icon', () => {
    const component = selectComponent<PgInputTextIcon>(PG_INPUT_TEXT_ICON);
    const { $icon } = component;
    expect($icon.path).toEqual('M3,3V21H21V3');
  });

  it('should set path to circle', () => {
    const circle = 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z';
    const component = selectComponent<PgInputTextIcon>(PG_INPUT_TEXT_ICON);
    component.path = circle;
    const { $icon } = component;
    expect($icon.path).toEqual(circle);
  });

});
