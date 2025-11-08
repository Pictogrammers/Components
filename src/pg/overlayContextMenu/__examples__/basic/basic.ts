import { Component, Part, Prop } from '@pictogrammers/element';

import PgMenuItem from '../../../menuItem/menuItem';
import PgMenuDivider from '../../../menuDivider/menuDivider';
import PgOverlayContextMenu from '../../overlayContextMenu';

import template from './basic.html';
import style from './basic.css';

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

  #menuOpen = false;
  async #handleContextMenu(e: any) {
    if (this.#menuOpen) { return; }
    e.preventDefault();
    const items = [{
      label: 'Item 1',
      value: 'item1',
      type: PgMenuItem
    },
    {
      label: 'Item 2',
      value: 'item2',
      type: PgMenuItem
    },
    {
      type: PgMenuDivider
    },
    {
      label: 'Item 3',
      value: 'item3',
      type: PgMenuItem
    }];
    this.#menuOpen = true;
    const result = await PgOverlayContextMenu.open({
      source: this.$area,
      value: this.#value,
      items,
      oninput: (value) => {
        this.$input.textContent = value;
      }
    });
    if (result !== undefined) {
      this.#value = result;
    }
    this.$result.textContent = result;
    this.#menuOpen = false;
  }
}