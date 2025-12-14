import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgTableCellText from '../tableCellText/tableCellText';

import template from './tableRow.html';
import style from './tableRow.css';

@Component({
  selector: 'pg-table-row',
  style,
  template
})
export default class PgTableRow extends HTMLElement {
  @Prop() items: any = [];
  @Prop() key: string = '';

  @Part() $cells: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$cells,
      items: this.items,
      type: (item) => item.type ? item.type : PgTableCellText,
    });
    console.log(this.items);
  }
}