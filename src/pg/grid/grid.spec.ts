import { selectComponent, getProps } from '@pictogrammers/element';

import './grid';
import PgGrid from './grid';

const PG_GRID = 'pg-grid';

(window as any).ResizeObserver = class {
  constructor(callback) { }
  observe(ele) { }
};

describe('pg-grid', () => {

  beforeEach(() => {
    var c = document.createElement(PG_GRID);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(PG_GRID)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getProps(PG_GRID);
    expect(props.length).toBe(6);
    expect(props).toContain('icons');
    expect(props).toContain('size');
    expect(props).toContain('padding');
    expect(props).toContain('gap');
    expect(props).toContain('width');
    expect(props).toContain('height');
  });

  it('should be empty', () => {
    const component = selectComponent<PgGrid>(PG_GRID);
    const {
      $grid
    } = component;
    expect($grid.innerHTML).toEqual('');
  });

  // ToDo: test pg-scroll first
  /*
  it('should contain 1 icons', async () => {
    const component = selectComponent<PgGrid>(PG_GRID);
    const {
      $grid
    } = component;
    component.icons = [{
      id: 'uuid',
      name: 'foo',
      data: 'M3,3V21H21V3'
    }];
    console.log(component.shadowRoot?.innerHTML);
    expect($grid.innerHTML).toEqual('');
  });
  */

});
