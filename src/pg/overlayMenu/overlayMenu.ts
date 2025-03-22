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
    if (changes.items) {
      if (this.value !== null) {
        this.items.forEach(item => item.checked = false);
        this.items.find(item => item.value === this.value.value).checked = true;
      }
      this.$menu.items = this.items;
    }
  }

  connectedCallback() {
    this.$menu.addEventListener('select', this.#handleSelect.bind(this));
    this.$overlay.popover = 'auto';
    if (this.source !== null) {
      // @ts-ignore
      this.$overlay.showPopover({
        source: this.source
      });
    }
    this.$overlay.addEventListener('toggle', this.#toggle.bind(this));
    // Position (replace with css once Firefox supports it)
    const rect = this.source?.getBoundingClientRect();
    let x = rect?.left ?? 0, y = rect?.top ?? 0;
    this.$overlay.style.minWidth = `${rect?.width}px`;
    const value = this.value === null || typeof this.value !== 'object'
      ? this.value
      : this.value.value;
    // value is an item in the items list
    const index = this.value === null
      ? -1
      : this.items.findIndex(x => x.value === value);
    if (index !== -1) {
      const height = this.$menu.getItemHeight(index);
      // Overlap item
      y -= this.$menu.getItemOffset(0, index);
      if (rect?.height !== height && rect?.height) {
        y += (rect.height - height) / 2;
      }
    } else if (this.items.length > 0) {
      // insert default if defined
      if (this.default) {
        this.default.checked = true;
        this.$menu.items.unshift(this.default);
      }
      // focus first item
      const height = this.$menu.getItemHeight(0);
      y -= this.$menu.getItemOffset(0, 0);
      if (rect?.height !== height && rect?.height) {
        y += (rect.height - height) / 2;
      }
    }
    this.$overlay.style.translate = `${x}px ${y}px`;
    // Focus
    this.$menu.focus(index);
  }

  #toggle(e: ToggleEvent) {
    if (e.newState === 'closed') {
      this.close();
    }
  }

  disconnectedCallback() {
  }

  #handleSelect(e: any) {
    e.detail.item.index = e.detail.index;
    this.close(e.detail.item);
  }
}