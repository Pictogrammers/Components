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

  render(changes) {
    if (changes.items) {
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
    this.$menu.focus();
  }

  #toggle(e: ToggleEvent) {
    if (e.newState === 'closed') {
      this.close();
    }
  }

  disconnectedCallback() {
  }

  #handleSelect(e: any) {
    this.close(e.detail.index);
  }
}