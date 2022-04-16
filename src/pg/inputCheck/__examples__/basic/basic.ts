import { Component, Part, Prop } from '@pictogrammers/element';
import PgInputCheck from 'pg/inputCheck/inputCheck';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-check-basic',
  template
})
export default class XPgInputCheckBasic extends HTMLElement {

  @Part() $input: PgInputCheck;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$input.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    var value = e.target.value;
    this.$value.innerText = value;
  }
}