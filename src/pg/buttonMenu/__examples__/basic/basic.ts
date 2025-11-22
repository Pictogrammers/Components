import { Component, Part } from '@pictogrammers/element';
import PgButtonMenu from '../../buttonMenu';
import PgMenuItemIcon from '../../../menuItemIcon/menuItemIcon';

import template from './basic.html';

const IconAccount = 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z';

@Component({
  selector: 'x-pg-button-menu-basic',
  template
})
export default class XPgButtonMenuBasic extends HTMLElement {

  @Part() $menu: PgButtonMenu;
  @Part() $value: HTMLSpanElement;

  connectedCallback() {
    this.$menu.label = 'Options';
    this.$menu.items = [{
      value: 'item1',
      label: 'Item 1',
      icon: IconAccount,
      type: PgMenuItemIcon,
      items: [{
        value: 'subitem1',
        label: 'Sub Item 1',
        icon: IconAccount,
        type: PgMenuItemIcon
      }]
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