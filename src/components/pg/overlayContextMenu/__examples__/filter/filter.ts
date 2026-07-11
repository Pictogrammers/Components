import { Component, Part, Prop } from '@pictogrammers/element';

import PgMenuItemIcon from '../../../menuItemIcon/menuItemIcon';
import PgMenuDivider from '../../../menuDivider/menuDivider';
import PgOverlayContextMenu from '../../overlayContextMenu';

import template from './filter.html';
import style from './filter.css';
import PgMenuItem from 'components/pg/menuItem/menuItem';

@Component({
  selector: 'x-pg-overlay-context-menu-filter',
  template,
  style
})
export default class XPgOverlayContextMenuFilter extends HTMLElement {
  @Part() $area: HTMLDivElement;
  @Part() $result: HTMLSpanElement;

  connectedCallback() {
    this.$area.addEventListener('contextmenu', this.#handleContextMenu.bind(this));
  }

  #value = null;

  async #handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    const items = [{
      label: 'Add File',
      value: 'addFile',
      type: PgMenuItem,
    },
    {
      label: 'Add Folder',
      value: 'addFolder',
      type: PgMenuItem,
    },
    {
      type: PgMenuDivider
    },
    {
      label: 'Copy',
      value: 'copy',
      type: PgMenuItem,
    },
    {
      label: 'Paste',
      value: 'paste',
      type: PgMenuItem,
    },
    {
      label: 'Rename',
      value: 'rename',
      type: PgMenuItem,
    },
    {
      label: 'Delete',
      value: 'delete',
      type: PgMenuItem,
    },
    {
      type: PgMenuDivider
    },
    {
      label: 'Refresh',
      value: 'refresh',
      type: PgMenuItem,
    },
    {
      label: 'Download',
      value: 'download',
      type: PgMenuItem,
    }];
    const result = await PgOverlayContextMenu.open({
      source: this.$area,
      x: e.clientX,
      y: e.clientY,
      value: this.#value,
      filter: true,
      items
    });
    if (result !== undefined) {
      this.#value = result;
    }
    this.$result.textContent = JSON.stringify(result);
  }
}
