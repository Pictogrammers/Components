import { Component, Part } from '@pictogrammers/element';
import PgInputTextarea from '../../inputTextarea';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-textarea-basic',
  template,
})
export default class XPgInputTextareaBasic extends HTMLElement {

  @Part() $input: PgInputTextarea;
  @Part() $value1: HTMLSpanElement;
  @Part() $value2: HTMLSpanElement;
  @Part() $value3: HTMLSpanElement;

  connectedCallback() {
    this.$input.addEventListener('change', this.#handleChange.bind(this));
    this.$input.addEventListener('input', this.#handleInput.bind(this));
    this.$input.addEventListener('caret', this.#handleCaret.bind(this));
  }

  #handleChange(e: CustomEvent) {
    const { value } = e.detail;
    this.$value1.textContent = value;
  }

  #handleInput(e: CustomEvent) {
    const { value } = e.detail;
    this.$value2.textContent = value;
  }

  #handleCaret(e: CustomEvent) {
    const { column, row } = e.detail;
    this.$value3.textContent = `${column}, ${row}`;
  }
}