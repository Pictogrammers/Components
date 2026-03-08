import { Component, Part, Prop } from '@pictogrammers/element';
import PgInputRadio from '../../inputRadio';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-radio-basic',
  template,
})
export default class XPgInputRadioBasic extends HTMLElement {

  @Part() $input: PgInputRadio;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$input.items.push({
      label: 'Item 1',
      value: 'item1',
    }, {
      label: 'Item 2',
      value: 'item2',
    });
    this.$input.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e: any) {
    const { value } = e.detail;
    this.$input.value = value;
    this.$value.textContent = value;
  }
}
