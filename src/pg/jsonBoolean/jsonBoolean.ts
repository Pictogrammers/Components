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
  @Part() $input: PgInputSelect;

  connectedCallback() {
    this.$input.options.push(
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    );
    this.$input.addEventListener('change', (e: any) => {
      this.$input.value = e.detail.value;
    });
  }

  render(changes) {
    if (changes.key) {
      this.$key.textContent = this.key;
    }
    if (changes.value) {
      this.$input.value = this.value ? 'true' : 'false';
    }
  }
}
