import { Component, Part } from '@pictogrammers/element';
import PgInputPills from '../../inputPills';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-pills-basic',
  template,
})
export default class XPgInputPillsBasic extends HTMLElement {

  @Part() $input: PgInputPills;
  @Part() $add: HTMLButtonElement;
  @Part() $value: HTMLSpanElement;

  #count: number = 3;

  connectedCallback() {
    this.$input.items.push({
      label: 'Item 1',
      value: 'item1',
    }, {
      label: 'Item 2',
      value: 'item2',
    }, {
      label: 'Item 3',
      value: 'item3',
    });
    this.$input.addEventListener('change', this.handleChange.bind(this));
    this.$add.addEventListener('click', this.handleAdd.bind(this));
  }

  handleAdd() {
    this.#count += 1;
    this.$input.items.push({
      label: `Item ${this.#count}`,
      value: `item${this.#count}`,
    });
  }

  handleChange(e: any) {
    const { value, items } = e.detail;
    this.$value.textContent = `removed "${value}", ${items.length} remaining`;
  }
}
