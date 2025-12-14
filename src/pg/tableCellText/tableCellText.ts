import { Component, Prop, Part } from '@pictogrammers/element';

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

  @Part() $label: HTMLDivElement;

  render(changes) {
    if (changes.value) {
      this.$label.textContent = this.value;
    }
  }
}