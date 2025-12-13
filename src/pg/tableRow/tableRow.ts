import { Component, Prop, Part } from '@pictogrammers/element';

import template from './tableRow.html';
import style from './tableRow.css';

@Component({
  selector: 'pg-table-row',
  style,
  template
})
export default class PgTableRow extends HTMLElement {
  @Prop() label: string = '';
  @Prop() key: string = '';

  @Part() $cells: HTMLDivElement;

  connectedCallback() {

  }
}