import { Component, Prop, Part, forEach } from '@pictogrammers/element';
import PgOverlaySelectMenu from '../overlaySelectMenu/overlaySelectMenu';

import template from './inputSelect.html';
import style from './inputSelect.css';

interface InputSelectItem {
  label: string;
  value: string;
}

@Component({
  selector: 'pg-input-select',
  style,
  template
})
export default class PgInputSelect extends HTMLElement {
  @Prop() options: InputSelectItem[] = [];
  @Prop() value: string = '';
  @Prop() name: string = '';
  @Prop() default: any = null;

  @Part() $button: HTMLButtonElement;
  @Part() $label: HTMLSpanElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.#handleClick.bind(this));
    this.$button.addEventListener('keydown', this.#handleKeyPress.bind(this));
  }

  render(changes) {
    if (changes.value || changes.default) {
      this.$label.textContent = this.value
        ? (this.options.find(x => x.value === this.value) ?? { label: this.value }).label
        : this.default
          ? this.default.label
          : '\u00A0'; // nbsp
    }
  }

  #menuOpen = false;
  async #handleClick() {
    if (this.#menuOpen) { return; }
    this.#menuOpen = true;
    const result = await PgOverlaySelectMenu.open({
      source: this.$button,
      default: this.default,
      value: this.options.find(x => x.value === this.value) ?? null,
      items: this.options,
    });
    if (result !== undefined) {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: result.value,
        },
      }));
      this.$label.textContent = result.label;
    }
    this.#menuOpen = false;
  }

  #handleKeyPress(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (this.options.length <= 1) {
          return;
        }
        this.#handleKeyDownArrowDown();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (this.options.length <= 1) {
          return;
        }
        this.#handleKeyDownArrowUp();
        break;
    }
  }

  #handleKeyDownArrowDown() {
    const index = this.options.findIndex(x => x.value === this.value);
    let newValue = '';
    if (index === -1 || index === this.options.length - 1) {
      // select first or loop to top
      newValue = this.options[0].value;
    } else {
      newValue = this.options[index + 1].value;
    }
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value: newValue,
      },
    }));
  }

  #handleKeyDownArrowUp() {
    const index = this.options.findIndex(x => x.value === this.value);
    const normalizeIndex = index === -1 ? 0 : index;
    let newValue = '';
    if (normalizeIndex === 0) {
      // loop to bottom
      newValue = this.options[this.options.length - 1].value;
    } else {
      newValue = this.options[normalizeIndex - 1].value;
    }
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value: newValue,
      },
    }));
  }
}