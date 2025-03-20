import { Component, Part, Prop } from '@pictogrammers/element';
import PgMenu from '../../menu';

import template from './basic.html';

@Component({
  selector: 'x-pg-menu-basic',
  template
})
export default class XPgMenuBasic extends HTMLElement {
  @Part() $menu: PgMenu;

  connectedCallback() {
    this.$menu.items = [{
      label: 'Item 1',
      value: 'item1'
    }];
  }
}