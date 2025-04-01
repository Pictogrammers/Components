import { Component, Part, Prop } from '@pictogrammers/element';
import PgMenuItem from '../../menuItem';

import template from './basic.html';

@Component({
  selector: 'x-pg-menu-item-basic',
  template
})
export default class XPgMenuItemBasic extends HTMLElement {
  @Part() $item: PgMenuItem;

  connectedCallback() {
    this.$item.label = 'Item 1';
    this.$item.checked = false;
    this.$item.disabled = false;
  }
}