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
  @Prop() items = [];
  #uniqueId = 0;

  render(changes) {
    if (changes.items) {
      this.$menu.items = this.items;
    }
  }

  #handleMouseDown;
  connectedCallback() {
    this.#handleMouseDown = (e: any) => {
      if (e.target !== this) {
        this.close();
      }
    };
    document.addEventListener('mousedown', this.#handleMouseDown);
    this.$menu.addEventListener('select', this.#handleSelect.bind(this));
    this.$overlay.id = `overlayMenu${this.#uniqueId++}`;
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.#handleMouseDown);
  }

  #handleSelect(e: any) {
    this.close(e.detail.index);
    this.source?.focus();
  }
}