import { Component, Part } from '@pictogrammers/element';
import PgButtonMenu from '../../buttonMenu';

import template from './basic.html';

@Component({
  selector: 'x-pg-button-menu-basic',
  template
})
export default class XPgButtonMenuBasic extends HTMLElement {

  @Part() $menu: PgButtonMenu;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$menu.items = [{
      value: 'item1',
      label: 'Item 1'
    }, {
      value: 'item2',
      label: 'Item 2'
    }];
    this.$menu.value = this.$menu.items[0];
    this.$menu.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e: any) {
    const { active } = e.detail;
    this.$value.textContent = `${active}`;
  }
}