import { Component, Part } from '@pictogrammers/element';
import PgNodeEditorEnum from '../../nodeEditorEnum';

import template from './basic.html';

@Component({
  selector: 'x-pg-node-editor-enum-basic',
  template,
})
export default class XPgNodesEditorEnumBasic extends HTMLElement {

  @Part() $input: PgNodeEditorEnum;
  @Part() $value1: HTMLDivElement;
  @Part() $value2: HTMLDivElement;

  connectedCallback() {
    this.$input.options = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' },
    ];
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
