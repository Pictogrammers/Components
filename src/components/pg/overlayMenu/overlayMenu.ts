import { Component, Part, Prop } from '@pictogrammers/element';

import PgMenu from '../menu/menu';
import PgOverlay from '../overlay/overlay';

import template from './overlayMenu.html';
import style from './overlayMenu.css';

@Component({
  selector: 'pg-overlay-menu',
  template,
  style
})
export default class PgOverlayMenu extends PgOverlay {
  @Part() $overlay: HTMLDivElement;
  @Part() $menu: PgMenu;

  @Prop() source: HTMLElement | null = null;
  @Prop() default: any = null;
  @Prop() items: any[] = [];
  @Prop() value: any = null;

  render(changes) {

  }

  connectedCallback() {
    this.$menu.items = this.items;
    this.$menu.addEventListener('select', this.#handleSelect.bind(this));
    this.$overlay.popover = 'auto';
    if (this.source !== null) {
      // @ts-ignore
      this.$overlay.showPopover({
        source: this.source
      });
    }
    this.$overlay.addEventListener('toggle', this.#toggle.bind(this));
    // Position
    const rect = this.source?.getBoundingClientRect();
    let x = 0, y = 0;
    const value = this.value === null || typeof this.value !== 'object'
      ? this.value
      : this.value.value;
    // value is an item in the items list
    const index = this.value === null
      ? 0
      : this.items.findIndex(x => x.value === value);
    // Focus
    this.$menu.focus(index);
  }

  #toggle(e: ToggleEvent) {
    if (e.newState === 'closed') {
      this.close();
      this.source?.focus();
    }
  }

  disconnectedCallback() {
  }

  #handleSelect(e: any) {
    // e.detail.item.index = e.detail.index;
    const { indexes, item } = e.detail;
    this.close({
      indexes,
      item
    });
    this.source?.focus();
  }
}