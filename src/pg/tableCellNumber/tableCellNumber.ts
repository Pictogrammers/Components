import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputText from '../inputText/inputText';

import template from './tableCellNumber.html';
import style from './tableCellNumber.css';

@Component({
  selector: 'pg-table-cell-number',
  style,
  template
})
export default class PgTableCellNumber extends HTMLElement {
  @Prop() value: number = 0;
  @Prop() key: string = '';
  @Prop() editable: boolean = false;

  @Part() $input: PgInputText;

  connectedCallback() {
    this.$input.addEventListener('change', (e: any) => {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: {
            value: e.detail.value,
          }
        })
      );
    });
  }

  render(changes) {
    if (changes.value) {
      this.$input.value = `${this.value}`;
    }
    if (changes.editable) {
      this.$input.readOnly = !this.editable;
    }
  }
}
