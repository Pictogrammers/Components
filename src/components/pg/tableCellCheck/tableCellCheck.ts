import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputCheck from '../inputCheck/inputCheck';

import template from './tableCellCheck.html';
import style from './tableCellCheck.css';

@Component({
  selector: 'pg-table-cell-check',
  style,
  template,
})
export default class PgTableCellCheck extends HTMLElement {
  @Prop() value: boolean = false;
  @Prop() editable: boolean = false;
  @Prop() key: string = '';

  @Part() $input: PgInputCheck;

  connectedCallback() {
    this.$input.addEventListener('change', this.handleChange.bind(this));
  }

  render(changes) {
    if (changes.value) {
      this.$input.value = this.value;
    }
    if (changes.editable) {
      this.$input.readOnly = !this.editable;
    }
  }

  handleChange(e: any) {
    const { value } = e.target;
    this.dispatchEvent(
      new CustomEvent('action', {
        detail: {
          value,
        }
      })
    );
  }
}