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

  @Part() $input: HTMLInputElement;
  @Part() $label: HTMLSpanElement;

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
  }
}
