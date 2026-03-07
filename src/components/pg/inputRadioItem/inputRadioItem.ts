import { Component, Prop, Part, normalizeBoolean } from '@pictogrammers/element';

import template from './inputRadioItem.html';
import style from './inputRadioItem.css';

@Component({
  selector: 'pg-input-radio-item',
  style,
  template,
})
export default class PgInputRadioItem extends HTMLElement {
  @Prop() label: string = '';
  @Prop() value: string = '';
  @Prop() checked: boolean = false;

  @Part() $input: HTMLInputElement;
  @Part() $label: HTMLSpanElement;

  connectedCallback() {
    this.$input.addEventListener('change', () => {
      this.dispatchEvent(new CustomEvent('change'));
    });
  }

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.value) {
      this.$input.textContent = this.label;
    }
    if (changes.checked) {
      this.$input.checked = this.checked;
    }
  }
}
