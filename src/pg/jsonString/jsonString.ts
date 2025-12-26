import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputText from '../inputText/inputText';

import template from './jsonString.html';
import style from './jsonString.css';

@Component({
  selector: 'pg-json-string',
  style,
  template,
})
export default class PgJsonString extends HTMLElement {
  @Prop() key: string = '';
  @Prop() value: string = '';

  @Part() $key: HTMLDivElement;
  @Part() $value: PgInputText;

  connectedCallback() {
    this.$value.addEventListener('input', (e: any) => {
      this.dispatchEvent(
        new CustomEvent('update', {
          detail: {
            path: [this.key],
            key: this.key,
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
      this.$value.value = this.value;
    }
  }
}
