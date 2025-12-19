import { Component, Prop, Part } from '@pictogrammers/element';

import PgIcon from '../icon/icon';

import template from './tableCellText.html';
import style from './tableCellText.css';

@Component({
  selector: 'pg-table-cell-text',
  style,
  template
})
export default class PgTableCellCheck extends HTMLElement {
  @Prop() value: boolean = false;
  @Prop() editable: boolean = false;
  @Prop() key: string = '';

  @Part() $input: HTMLInputElement;
  @Part() $icon: PgIcon;

  connectedCallback() {

  }

  render(changes) {
    if (changes.value) {
      this.$input.checked = this.value;
    }
  }
}