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
  @Prop() maxWidth: number | string | null = null;

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
    if (changes.maxWidth) {
      if (this.maxWidth === null) {
        this.$input.style.removeProperty('--pg-input-text-max-width');
      } else {
        this.$input.style.setProperty(
          '--pg-input-text-max-width',
          `${typeof this.maxWidth === 'string' ? this.maxWidth : this.maxWidth + 'px'}`
        );
      }
    }
  }
}