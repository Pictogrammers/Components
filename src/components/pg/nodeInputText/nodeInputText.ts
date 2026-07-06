import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeInputText.html';
import style from './nodeInputText.css';

@Component({
  selector: 'pg-node-input-text',
  style,
  template,
})
export default class PgNodeInputText extends HTMLElement {

  @Prop() value: string = '';
  @Prop() name: string = '';

  @Part() $input: HTMLInputElement;

  connectedCallback() {
    this.$input.addEventListener('change', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this.$input.value,
        }
      }));
    });
    this.$input.addEventListener('input', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          value: this.$input.value,
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.value) {
      this.$input.value = this.value;
    }
  }

  focus() {
    this.$input.focus();
  }
}
