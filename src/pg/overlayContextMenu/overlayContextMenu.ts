import { Component, Part, Prop } from '@pictogrammers/element';

import PgMenu from '../menu/menu';
import PgOverlay from '../overlay/overlay';

import template from './overlayContextMenu.html';
import style from './overlayContextMenu.css';

// Only allow a single open context menu
const stack: PgOverlayContextMenu[] = [];

@Component({
  selector: 'pg-overlay-context-menu',
  template,
  style
})
export default class PgOverlayContextMenu extends PgOverlay {
  @Part() $overlay: HTMLDivElement;
  @Part() $menu: PgMenu;

  @Prop() source: HTMLElement | null = null;
  @Prop() x: number = 0;
  @Prop() y: number = 0;
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
    stack.pop()?.close();
    stack.push(this);
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
    const x =  this.x - (rect?.left || 0),
      y = this.y - (rect?.top || 0);
    // ToDo: update to CSS Variables
    this.$overlay.style.setProperty('--pg-overlay-menu-_x', `${x}px`);
    this.$overlay.style.setProperty('--pg-overlay-menu-_y', `${y}px`);
    // Focus
    this.$menu.focus(0);
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
    e.detail.item.index = e.detail.index;
    this.close(e.detail.item);
    this.source?.focus();
  }
}