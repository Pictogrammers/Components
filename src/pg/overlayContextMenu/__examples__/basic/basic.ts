import { Component, Part, Prop } from '@pictogrammers/element';

import PgMenuItemIcon from '../../../menuItemIcon/menuItemIcon';
import PgMenuDivider from '../../../menuDivider/menuDivider';
import PgOverlayContextMenu from '../../overlayContextMenu';

import template from './basic.html';
import style from './basic.css';

const IconFile = 'M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z';
const IconFolder = 'M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z';

@Component({
  selector: 'x-pg-overlay-context-menu-basic',
  template,
  style
})
export default class XPgOverlayContextMenuBasic extends HTMLElement {
  @Part() $area: HTMLDivElement;
  @Part() $result: HTMLSpanElement;
  @Part() $input: HTMLSpanElement;

  connectedCallback() {
    this.$area.addEventListener('contextmenu', this.#handleContextMenu.bind(this));
  }

  #value = null;

  async #handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    const items = [{
      label: 'Add File',
      value: 'item1',
      icon: IconFile,
      type: PgMenuItemIcon
    },
    {
      label: 'Add Folder',
      value: 'item2',
      icon: IconFolder,
      type: PgMenuItemIcon
    },
    {
      type: PgMenuDivider
    },
    {
      label: 'More Items',
      value: 'item3',
      icon: IconFile,
      type: PgMenuItemIcon
    }];
    const result = await PgOverlayContextMenu.open({
      source: this.$area,
      x: e.clientX,
      y: e.clientY,
      value: this.#value,
      items,
      oninput: (value) => {
        this.$input.textContent = value;
      }
    });
    if (result !== undefined) {
      this.#value = result;
    }
    this.$result.textContent = JSON.stringify(result);
  }
}