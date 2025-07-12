import { Component, Part, Prop } from '@pictogrammers/element';
import PgMenu from '../../menu';

import template from './basic.html';

@Component({
  selector: 'x-pg-menu-basic',
  template
})
export default class XPgMenuBasic extends HTMLElement {
  @Part() $menu: PgMenu;
  @Part() $result: HTMLSpanElement;

  connectedCallback() {
    this.$menu.items = [{
      label: 'Item 1',
      value: 'item1'
    },
    {
      label: 'Item 2',
      value: 'item2'
    }];
    this.$menu.addEventListener('select', this.#handleSelect.bind(this));
  }

  #handleSelect(e: any) {
    // update clicked result
    this.$result.textContent = JSON.stringify(e.detail);
  }
}