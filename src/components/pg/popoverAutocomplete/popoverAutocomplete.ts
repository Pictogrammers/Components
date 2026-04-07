import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgPopover from '../popover/popover';
import PgPopoverAutocompleteItem from '../popoverAutocompleteItem/popoverAutocompleteItem';

import template from './popoverAutocomplete.html';
import style from './popoverAutocomplete.css';

@Component({
  selector: 'pg-popover-autocomplete',
  style,
  template
})
export default class PgPopoverAutocomplete extends PgPopover {
  @Part() $items: HTMLDivElement;

  @Prop() items: { label: string; value: string }[] = [];

  #index: number = -1;
  #ignore: boolean = false;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: () => PgPopoverAutocompleteItem,
      create: ($item: PgPopoverAutocompleteItem, _item: { label: string; value: string }) => {
        $item.addEventListener('ignore', (e: any) => {
          this.#ignore = true;
          this.#focusItem(e.detail.index);
        });
        $item.addEventListener('select', (e: any) => {
          this.dispatchEvent(new CustomEvent('select', { detail: e.detail }));
          this.hide();
          this.#ignore = false;
        });
        $item.addEventListener('left', (e: any) => {
          this.dispatchEvent(new CustomEvent('dismiss'));
        });
        $item.addEventListener('right', (e: any) => {
          this.dispatchEvent(new CustomEvent('dismiss'));
        });
        $item.addEventListener('up', (e: any) => {
          this.#focusItem(e.detail.index - 1);
        });
        $item.addEventListener('down', (e: any) => {
          this.#focusItem(e.detail.index + 1);
        });
        $item.addEventListener('close', () => {
          this.hide();
          this.source?.focus();
        });
      }
    });

    this.$popover.addEventListener('toggle', this.#toggle.bind(this));

    this.#focusItem(0);
  }

  render(changes) {
    if (changes.source) {
      this.source?.addEventListener('keydown', this.handleKeydown);
      this.source?.addEventListener('blur', this.handleBlur);
    }
  }

  handleBlur = (e: FocusEvent) => {
    if (this.#ignore) {
      return;
    }
    this.hide();
  }

  handleKeydown = (e: KeyboardEvent) => {
    switch(e.key) {
      case 'Tab':
        this.dispatchEvent(new CustomEvent('dismiss'));
        break;
      case 'ArrowUp':
        this.#focusItem(this.#index - 1);
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (this.visible) {
          this.#focusItem(this.#index + 1);
        } else {
          // recreate autocomplete
        }
        e.preventDefault();
        break;
      case 'Enter':
        const item = this.$items.children[this.#index] as any;
        item?.click();
        e.preventDefault();
        break;
      case 'Escape':
        this.hide();
        e.preventDefault();
        break;
    }
  }

  #toggle(e: ToggleEvent) {
    if (e.newState === 'closed') {
      this.dispatchEvent(new CustomEvent('dismiss'));
    }
  }

  #focusItem(index: number) {
    //if (index === initIndex) return;
    //if (index < 0) return this.#focusItem(this.items.length - 1, fallback, initIndex);
    //if (index >= this.items.length) return this.#focusItem(0, fallback, initIndex);
    if (this.#index === index) {
      return;
    }
    if (index < 0) {
      index = this.items.length - 1;
    }
    if (index >= this.items.length) {
      index = 0;
    }
    const item = this.$items.children[index] as any;
    item?.focus();
    const previous = this.$items.children[this.#index] as any;
    previous?.blur();
    this.#index = index;
  }

  disconnectedCallback() {
    this.source?.removeEventListener('keydown', this.handleKeydown);
  }

}
