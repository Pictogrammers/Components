import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputPill.html';
import style from './inputPill.css';

@Component({
  selector: 'pg-input-pill',
  style,
  template,
})
export default class PgInputPill extends HTMLElement {
  @Prop() label: string = '';
  @Prop() value: string = '';

  @Part() $label: HTMLSpanElement;
  @Part() $remove: HTMLButtonElement;

  #initialized: boolean = false;

  connectedCallback() {
    // Reconnects re-invoke connectedCallback; guard against duplicate listeners.
    if (this.#initialized) return;
    this.#initialized = true;
    this.$remove.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('remove', {
          detail: {
            value: this.value,
            label: this.label,
          }
        })
      );
    });
  }

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
  }
}
