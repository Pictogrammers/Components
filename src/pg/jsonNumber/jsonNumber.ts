import { Component, Prop, Part } from '@pictogrammers/element';

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
  @Part() $value: HTMLDivElement;

  render(changes) {
    if (changes.key) {
      this.$key.textContent = this.key;
    }
    if (changes.value) {
      this.$value.textContent = `${this.value}`;
    }
  }
}
