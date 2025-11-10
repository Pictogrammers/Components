import { Component, Part, Prop } from '@pictogrammers/element';

import PgMenuItemIcon from '../../../menuItemIcon/menuItemIcon';
import PgMenuDivider from '../../../menuDivider/menuDivider';
import PgOverlayContextMenu from '../../overlayContextMenu';

import template from './basic.html';
import style from './basic.css';

const IconFile = 'M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z';
const IconFolder = 'M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z';
const IconLeft = 'M3,3H21V5H3V3M3,7H15V9H3V7M3,11H21V13H3V11M3,15H15V17H3V15M3,19H21V21H3V19Z';
const IconCenter = 'M3,3H21V5H3V3M7,7H17V9H7V7M3,11H21V13H3V11M7,15H17V17H7V15M3,19H21V21H3V19Z';
const IconRight = 'M3,3H21V5H3V3M9,7H21V9H9V7M3,11H21V13H3V11M9,15H21V17H9V15M3,19H21V21H3V19Z';

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
    console.log('context');
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
      label: 'Text Alignment',
      value: 'item3',
      icon: IconLeft,
      type: PgMenuItemIcon,
      items: [{
          label: 'Left',
          value: 'left',
          icon: IconLeft,
          type: PgMenuItemIcon,
          check: true
      }, {
          label: 'Center',
          value: 'center',
          icon: IconCenter,
          type: PgMenuItemIcon,
          check: false
      }, {
          label: 'Right',
          value: 'right',
          icon: IconRight,
          type: PgMenuItemIcon,
          check: false
      }]
    }];
    const result = await PgOverlayContextMenu.open({
      source: this.$area,
      x: e.clientX,
      y: e.clientY,
      value: this.#value,
      items
    });
    if (result !== undefined) {
      this.#value = result;
    }
    this.$result.textContent = JSON.stringify(result);
  }
}