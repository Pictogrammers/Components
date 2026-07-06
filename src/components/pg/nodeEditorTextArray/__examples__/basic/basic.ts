import { Component, Part } from '@pictogrammers/element';
import PgNodeEditorTextArray from '../../nodeEditorTextArray';

import template from './basic.html';

@Component({
  selector: 'x-pg-node-editor-text-array-basic',
  template,
})
export default class XPgNodeEditorTextArrayBasic extends HTMLElement {

  @Part() $input: PgNodeEditorTextArray;
  @Part() $value1: HTMLDivElement;

  connectedCallback() {
    this.$input.label = 'Tags';
    this.$input.value = ['hello', 'world'];
    this.$input.addEventListener('change', this.#handleChange.bind(this));
  }

  #handleChange(e: CustomEvent) {
    const { value } = e.detail;
    this.$value1.textContent = JSON.stringify(value);
  }
}
