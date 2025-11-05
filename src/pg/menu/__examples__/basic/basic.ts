import { Component, Part, Prop } from '@pictogrammers/element';
import PgMenu from '../../menu';

import PgMenuDivider from '../../../menuDivider/menuDivider';

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
    },
    {
      type: PgMenuDivider
    },
    {
      label: 'Item 3',
      value: 'item3'
    }];
    this.$menu.addEventListener('select', this.#handleSelect.bind(this));
  }

  previousItem: any = null;
  #handleSelect(e: any) {
    const { item } = e.detail;
    if (this.previousItem !== null) {
      this.previousItem.checked = false;
    }
    item.checked = true;
    this.previousItem = item;
    // update clicked result
    this.$result.textContent = JSON.stringify(e.detail);
  }
}