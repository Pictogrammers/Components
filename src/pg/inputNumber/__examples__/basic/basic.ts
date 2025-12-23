import { Component, Part, Prop } from '@pictogrammers/element';
import PgInputNumber from '../../inputNumber';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-number-basic',
  template
})
export default class XPgInputNumberBasic extends HTMLElement {

  @Part() $input: PgInputNumber;
  @Part() $value1: HTMLSpanElement;
  @Part() $value2: HTMLSpanElement;

  connectedCallback() {
    this.$input.addEventListener('change', this.#handleChange.bind(this));
    this.$input.addEventListener('input', this.#handleInput.bind(this));
  }

  #handleChange(e: CustomEvent) {
    const { value } = e.detail;
    this.$value1.textContent = value;
  }

  #handleInput(e: CustomEvent) {
    const { value } = e.detail;
    this.$value2.textContent = value;
  }
}