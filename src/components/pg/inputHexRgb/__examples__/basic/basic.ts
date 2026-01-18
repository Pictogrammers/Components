import { Component, Part, Prop } from '@pictogrammers/element';
import PgInputHexRgb from '../../inputHexRgb';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-hex-rgb-basic',
  template
})
export default class XPgInputHexRgbBasic extends HTMLElement {

  @Part() $input: PgInputHexRgb;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$input.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e: CustomEvent) {
    var { value } = e.target as any;
    this.$value.innerText = `${value}`;
  }
}