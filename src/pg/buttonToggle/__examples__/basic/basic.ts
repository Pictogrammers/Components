import { Component, Part, Prop } from '@pictogrammers/element';
import PgButtonToggle from '../../buttonToggle';

import template from './basic.html';

@Component({
  selector: 'x-pg-button-toggle-basic',
  template
})
export default class XPgButtonToggleBasic extends HTMLElement {

  @Part() $button: PgButtonToggle;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(e) {
    const { active } = e.detail;
    this.$value.innerText = `${active}`;
  }
}