import { Component, Part, Prop } from '@pictogrammers/element';

import PgMenu from '../../../menu/menu';
import PgMenuDivider from '../../menuDivider';

import template from './basic.html';

@Component({
  selector: 'x-pg-menu-divider-basic',
  template
})
export default class XPgMenuDividerBasic extends HTMLElement {
  @Part() $menu: PgMenu;

  connectedCallback() {
    this.$menu.items = [{
      label: 'Item 1',
      value: 'item1'
    },
    {
      type: PgMenuDivider
    },
    {
      label: 'Item 2',
      value: 'item2'
    }];
  }
}