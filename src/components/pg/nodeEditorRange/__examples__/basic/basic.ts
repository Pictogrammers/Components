import { Component, Part } from '@pictogrammers/element';
import PgNodeEditorRange from '../../nodeEditorRange';

import template from './basic.html';

@Component({
  selector: 'x-pg-node-editor-range-basic',
  template,
})
export default class XPgNodeEditorRangeBasic extends HTMLElement {

  @Part() $input: PgNodeEditorRange;
  @Part() $value1: HTMLDivElement;
  @Part() $value2: HTMLDivElement;

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
