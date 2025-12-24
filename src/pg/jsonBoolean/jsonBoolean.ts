import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputSelect from '../inputSelect/inputSelect';

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
  @Part() $value: PgInputSelect;

  connectedCallback() {
    this.$value.options.push(
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    );
    this.$value.addEventListener('input', (e: any) => {
      this.$value.value = e.detail.value;
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
      this.$value.value = this.value ? 'true' : 'false';
    }
  }
}
