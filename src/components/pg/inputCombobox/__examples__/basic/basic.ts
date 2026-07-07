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
      { label: 'Dipper Pines', value: 'Dipper Pines' },
      { label: 'Mabel Pines', value: 'Mabel Pines' },
      { label: 'Stanley "Grunkle Stan" Pines', value: 'Stanley Pines' },
      { label: 'Soos Ramirez', value: 'Soos Ramirez' },
      { label: 'Wendy Corduroy', value: 'Wendy Corduroy' },
      { label: 'Bill Cipher', value: 'Bill Cipher' },
      { label: 'Stanford Pines', value: 'Stanford Pines' },
    ];
    this.$input.addEventListener('change', this.#handleChange.bind(this));
  }

  #handleChange(e: any) {
    const { value } = e.detail;
    this.$input.value = value;
    this.$value.textContent = value;
  }
}
