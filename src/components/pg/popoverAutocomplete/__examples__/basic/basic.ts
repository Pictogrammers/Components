import { Component, Part } from '@pictogrammers/element';

import PgPopoverAutocomplete from '../../popoverAutocomplete';

import template from './basic.html';
import style from './basic.css';

@Component({
  selector: 'x-pg-popover-autocomplete-basic',
  template,
  style,
})
export default class XPgPopoverAutocompleteBasic extends HTMLElement {
  @Part() $trigger: HTMLButtonElement;
  @Part() $result: HTMLSpanElement;

  #popover: PgPopoverAutocomplete | null = null;

  connectedCallback() {
    this.$trigger.addEventListener('focus', () => {
      if (this.#popover) {
        this.#popover.show();
        return;
      };
      this.#popover = PgPopoverAutocomplete.create({
        source: this.$trigger,
        items: [
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Cherry', value: 'cherry' },
          { label: 'Grape', value: 'grape' },
          { label: 'Mango', value: 'mango' },
        ],
      });
      this.#popover.show();
      this.#popover.addEventListener('select', (e: any) => {
        const { label, value } = e.detail;
        this.$result.textContent = `${label} (${value})`;
      });
      this.#popover.addEventListener('dismiss', () => {
        this.#popover?.destroy();
        this.#popover = null;
      }, { once: true });
    });
  }
}
