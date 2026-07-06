import { Component, Part } from '@pictogrammers/element';
import PgInputCombobox from '../../inputCombobox';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-combobox-basic',
  template
})
export default class XPgInputComboboxBasic extends HTMLElement {

  @Part() $input: PgInputCombobox;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$input.options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' },
      { label: 'Date', value: 'date' },
      { label: 'Elderberry', value: 'elderberry' },
      { label: 'Fig', value: 'fig' },
      { label: 'Grape', value: 'grape' },
    ];
    this.$input.addEventListener('change', this.#handleChange.bind(this));
  }

  #handleChange(e: any) {
    const { value } = e.detail;
    this.$input.value = value;
    this.$value.textContent = value;
  }
}
