import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputText from '../inputText/inputText';

import template from './tableCellText.html';
import style from './tableCellText.css';

@Component({
  selector: 'pg-table-cell-text',
  style,
  template
})
export default class PgTableCellText extends HTMLElement {
  @Prop() value: string = '';
  @Prop() key: string = '';
  @Prop() editable: boolean = false;

  @Part() $input: PgInputText;

  connectedCallback() {
    this.$input.addEventListener('input', (e: any) => {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: {
            value: e.detail.value,
            event: 'input',
          }
        })
      );
    });
    this.$input.addEventListener('change', (e: any) => {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: {
            value: e.detail.value,
            event: 'change',
          }
        })
      );
    });
  }

  render(changes) {
    if (changes.value) {
      this.$input.value = this.value;
    }
    if (changes.editable) {
      this.$input.readOnly = !this.editable;
    }
  }
}