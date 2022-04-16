import { Component, Part, Prop } from '@pictogrammers/element';
import PgInputText from '../../inputText';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-text-basic',
  template
})
export default class XPgInputTextBasic extends HTMLElement {

  @Part() $input: PgInputText;
  @Part() $value1: HTMLSpanElement;
  @Part() $value2: HTMLSpanElement;

  connectedCallback() {
    this.$input.addEventListener('change', this.handleChange.bind(this));
    this.$input.addEventListener('input', this.handleInput.bind(this));
  }

  handleChange(e: CustomEvent) {
    const { value } = e.detail;
    this.$value1.innerText = value;
  }

  handleInput(e: CustomEvent) {
    const { value } = e.detail;
    this.$value2.innerText = value;
  }
}