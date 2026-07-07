import { Component, Prop, Part } from '@pictogrammers/element';
import PgOverlayMenu from '../overlayMenu/overlayMenu';
import PgMenuItem from '../menuItem/menuItem';

import template from './inputCombobox.html';
import style from './inputCombobox.css';

interface InputComboboxItem {
  label: string;
  value: string;
}

@Component({
  selector: 'pg-input-combobox',
  style,
  template
})
export default class PgInputCombobox extends HTMLElement {
  @Prop() options: InputComboboxItem[] = [];
  @Prop() value: string = '';
  @Prop() name: string = '';
  @Prop() placeholder: string = '';

  @Part() $container: HTMLDivElement;
  @Part() $input: HTMLInputElement;

  connectedCallback() {
    this.$container.addEventListener('mousedown', this.#handleMousedown.bind(this));
    this.$input.addEventListener('focus', this.#handleFocus.bind(this));
    this.$input.addEventListener('input', this.#handleInput.bind(this));
    this.$input.addEventListener('keydown', this.#handleKeydown.bind(this));
  }

  render(changes) {
    if (changes.value) {
      const item = this.options.find(x => x.value === this.value);
      this.$input.value = item ? item.label : '';
    }
    if (changes.placeholder) {
      this.$input.placeholder = this.placeholder;
    }
  }

  #menuOpen = false;
  #activeOverlay: PgOverlayMenu | null = null;

  #toMenuItems(items: InputComboboxItem[]) {
    return items.map(item => ({
      label: item.label,
      value: item.value,
      type: PgMenuItem,
    }));
  }

  #getFilteredItems(): InputComboboxItem[] {
    const query = this.$input.value.toLowerCase().trim();
    if (!query) return [...this.options];
    return this.options.filter(x => x.label.toLowerCase().includes(query));
  }

  async #openMenu() {
    if (this.#menuOpen || this.options.length === 0) return;
    this.#menuOpen = true;

    const filtered = this.#getFilteredItems();
    const menuItems = this.#toMenuItems(filtered);

    const prevMenus = new Set(Array.from(document.querySelectorAll('pg-overlay-menu')));
    const promise = PgOverlayMenu.open({
      source: this.$container,
      items: menuItems,
      preventFocus: true,
    });
    const newEl = Array.from(document.querySelectorAll('pg-overlay-menu')).find(
      el => !prevMenus.has(el as PgOverlayMenu)
    ) as PgOverlayMenu | null;
    this.#activeOverlay = newEl ?? null;

    const result = await promise;
    this.#menuOpen = false;
    this.#activeOverlay = null;

    if (result !== undefined) {
      const { item } = result;
      if (item) {
        this.$input.value = item.label;
        this.dispatchEvent(new CustomEvent('change', {
          detail: { value: item.value, label: item.label }
        }));
      }
    }
  }

  #handleMousedown(e: MouseEvent) {
    if (e.target !== this.$input) {
      e.preventDefault();
      this.$input.focus();
    }
  }

  #handleFocus() {
    this.#openMenu();
  }

  #handleInput() {
    if (this.#menuOpen && this.#activeOverlay) {
      const filtered = this.#getFilteredItems();
      if (filtered.length === 0) {
        this.#activeOverlay.close(undefined);
        return;
      }
      const menuItems = (this.#activeOverlay as any).$menu?.items;
      if (menuItems) {
        menuItems.splice(0, menuItems.length, ...this.#toMenuItems(filtered));
      }
    } else {
      this.#openMenu();
    }
  }

  #handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (this.#activeOverlay) {
          (this.#activeOverlay as any).$menu?.focus(0);
        } else {
          this.#openMenu();
        }
        break;
      case 'Escape':
        if (this.#activeOverlay) {
          this.#activeOverlay.close(undefined);
        }
        break;
    }
  }

  focus() {
    this.$input.focus();
  }
}
