import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputNumber from '../inputNumber/inputNumber';

import template from './jsonNumber.html';
import style from './jsonNumber.css';

@Component({
  selector: 'pg-json-number',
  style,
  template,
})
export default class PgJsonNumber extends HTMLElement {
  @Prop() key: string = '';
  @Prop() value: number = 0;

  @Part() $key: HTMLDivElement;
  @Part() $value: PgInputNumber;

  connectedCallback() {
    this.$value.addEventListener('input', (e: any) => {
      this.dispatchEvent(
        new CustomEvent('update', {
          detail: {
            path: [this.key],
            value: e.detail.value,
          }
        })
      );
    });
  }

  render(changes) {
    if (changes.key) {
      this.$key.textContent = this.key;
    }
    if (changes.value) {
      this.$value.value = `${this.value}`;
    }
  }
}
