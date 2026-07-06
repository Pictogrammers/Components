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
  @Prop() removable: boolean = false;

  @Part() $input: HTMLInputElement;
  @Part() $remove: HTMLButtonElement;

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
    this.$remove.addEventListener('click', (e: any) => {
      this.dispatchEvent(new CustomEvent('remove'));
    });
  }

  render(changes: any) {
    if (changes.value) {
      this.$input.value = this.value;
    }
    if (changes.removable) {
      this.$remove.classList.toggle('hide', false);
    }
  }

  focus() {
    this.$input.focus();
  }
}
