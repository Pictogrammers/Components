import { Component, Prop, Part } from '@pictogrammers/element';

import template from './jsonBoolean.html';
import style from './jsonBoolean.css';

@Component({
  selector: 'pg-json-boolean',
  style,
  template,
})
export default class PgJsonBoolean extends HTMLElement {
  @Prop() key: string = '';
  @Prop() value: boolean = false;

  @Part() $key: HTMLDivElement;
  @Part() $value: HTMLDivElement;

  render(changes) {
    if (changes.key) {
      this.$key.textContent = this.key;
    }
    if (changes.value) {
      this.$value.textContent = this.value ? 'true' : 'false';
    }
  }
}
