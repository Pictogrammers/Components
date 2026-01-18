import { Component, Part, Prop } from '@pictogrammers/element';
import PgInputFileLocal from '../../inputFileLocal';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-file-local-basic',
  template
})
export default class XPgInputFileLocalBasic extends HTMLElement {

  @Part() $input: PgInputFileLocal;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$input.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e: CustomEvent) {
    const { name, value } = e.detail;
    this.$value.innerText = `${name} - ${value}`;
  }
}