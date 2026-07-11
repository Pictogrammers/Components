import { Component, Part, Prop } from '@pictogrammers/element';

import PgInputText from '../inputText/inputText';
import PgMenu from '../menu/menu';
import PgOverlay from '../overlay/overlay';

import template from './overlayContextMenu.html';
import style from './overlayContextMenu.css';

// Only allow a single open context menu
const stack: PgOverlayContextMenu[] = [];
const stack2: PgOverlayContextMenu[] = [];

@Component({
  selector: 'pg-overlay-context-menu',
  template,
  style
})
export default class PgOverlayContextMenu extends PgOverlay {
  @Part() $overlay: HTMLDivElement;
  @Part() $filter: PgInputText;
  @Part() $menu: PgMenu;

  @Prop() source: HTMLElement | null = null;
  @Prop() x: number = 0;
  @Prop() y: number = 0;
  @Prop() default: any = null;
  @Prop() items: any[] = [];
  @Prop() value: any = null;
  @Prop() filter: boolean = false;

  render(changes) {
    if (changes.items) {
      //if (this.value !== null) {
      //  this.items.forEach(item => item.checked = false);
      //  this.items.find(item => item.value === this.value.value).checked = true;
      //}
      this.$menu.items = this.items;
    }
    if (changes.filter) {
      this.$overlay.classList.toggle('filter', this.filter);
    }
  }

  connectedCallback() {
    stack.pop()?.close();
    stack.push(this);
    stack2.push(this);
    this.$menu.addEventListener('select', this.#handleSelect.bind(this));
    this.$menu.addEventListener('close', this.#handleClose.bind(this));
    this.$filter.addEventListener('input', this.#handleFilterInput.bind(this));
    this.$filter.addEventListener('keydown', this.#handleFilterKeyDown.bind(this));
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
    // Should return focus
    this.#handleDown = this.#down.bind(this);
    document.addEventListener('pointerdown', this.#handleDown);
    // Rendering children is after parent's connectedCallback
    queueMicrotask(() => {
      // Focus
      if (this.filter) {
        this.$filter.focus();
      } else {
        this.$menu.focus(0);
      }
    });
  }

  #handleFilterInput(e: any) {
    const text = e.detail.value.trim().toLowerCase();
    this.$menu.items = text === ''
      ? this.items
      : this.items.filter(item => item.label?.toLowerCase().includes(text));
  }

  #handleFilterKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      this.$menu.focus(0);
      e.preventDefault();
    }
  }

  #ignore = false;
  #handleDown;
  #down(e: MouseEvent) {
    this.#ignore = e.composedPath().includes(this.source as any);
  }

  #toggle(e: ToggleEvent) {
    if (e.newState === 'closed') {
      this.close();
      if (stack2.length === 0 && this.#ignore) {
        console.log(e);
        this.source?.focus();
      }
    }
  }

  disconnectedCallback() {
    stack2.pop();
    document.removeEventListener('pointerdown', this.#handleDown);
  }

  #handleClose(e: any) {
    this.close();
    this.source?.focus();
  }

  #handleSelect(e: any) {
    e.detail.item.index = e.detail.index;
    this.close(e.detail.item);
    this.source?.focus();
  }
}