import { selectComponent, getProps } from '@pictogrammers/element';

import './inputNumber';
import PgInputText from './inputNumber';

const PG_INPUT_TEXT = 'pg-input-text';

describe('pg-input-text', () => {

  beforeEach(() => {
    var c = document.createElement(PG_INPUT_TEXT);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_INPUT_TEXT)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getProps(PG_INPUT_TEXT);
    expect(props.length).toBe(3);
    expect(props).toContain('name');
    expect(props).toContain('value');
    expect(props).toContain('placeholder');
  });

  it('should default value to empty', () => {
    const component = selectComponent<PgInputText>(PG_INPUT_TEXT);
    const { $input } = component;
    expect($input.value).toEqual('');
  });

  it('should set value to "Hello World!"', () => {
    const component = selectComponent<PgInputText>(PG_INPUT_TEXT);
    component.value = 'Hello World!';
    const { $input } = component;
    expect($input.value).toEqual('Hello World!');
  });

  it('should default placeholder to empty', () => {
    const component = selectComponent<PgInputText>(PG_INPUT_TEXT);
    const { $input } = component;
    expect($input.placeholder).toEqual('');
  });

  it('should set placeholder to "Hello World!"', () => {
    const component = selectComponent<PgInputText>(PG_INPUT_TEXT);
    component.placeholder = 'Hello World!';
    const { $input } = component;
    expect($input.placeholder).toEqual('Hello World!');
  });

});
