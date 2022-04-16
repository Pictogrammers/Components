import { Component, Part, Prop } from '@pictogrammers/element';
import PgInputUserSelect from '../../inputUserSelect';
import { users } from './constants';

import template from './basic.html';

@Component({
  selector: 'x-pg-input-user-select-basic',
  template
})
export default class XPgInputUserSelectBasic extends HTMLElement {

  @Part() $input: PgInputUserSelect;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$input.options = users;
    this.$input.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e: CustomEvent) {
    const { name, value } = e.detail;
    this.$value.innerText = `${name} - ${value}`;
  }
}