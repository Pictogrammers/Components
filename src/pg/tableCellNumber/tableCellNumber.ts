import { Component, Prop, Part } from '@pictogrammers/element';

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

  @Part() $label: HTMLDivElement;

  render(changes) {
    if (changes.value) {
      this.$label.textContent = `${this.value}`;
    }
  }
}