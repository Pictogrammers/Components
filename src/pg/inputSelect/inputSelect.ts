import { Component, Prop, Part, forEach } from '@pictogrammers/element';
import PgOverlayMenu from '../overlayMenu/overlayMenu';

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

  @Part() $button: HTMLButtonElement;
  @Part() $label: HTMLSpanElement;

  connectedCallback() {
    this.$button.addEventListener('click', this.#handleClick.bind(this));
  }

  render(changes) {
    if (changes.value) {
      this.$label.textContent = this.value ? this.value : '\u00A0';
    }
  }

  #menuOpen = false;
  async #handleClick() {
    if (this.#menuOpen) { return; }
    this.#menuOpen = true;
    const result = await PgOverlayMenu.open({
      source: this.$button,
      value: this.options.find(x => x.value === this.value) ?? null,
      items: this.options
    });
    if (result !== undefined) {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: result.value
        }
      }));
      this.$label.textContent = result.label;
    }
    this.#menuOpen = false;
  }
}