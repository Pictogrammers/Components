import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgTableColumn from '../tableColumn/tableColumn';
import PgTableRow from '../tableRow/tableRow';

import template from './table.html';
import style from './table.css';

@Component({
  selector: 'pg-table',
  style,
  template
})
export default class PgTable extends HTMLElement {
  @Prop() columns: any[] = [];
  @Prop() data: any[] = [];

  @Part() $columns: HTMLDivElement;
  @Part() $rows: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$columns,
      items: this.columns,
      type: () => PgTableColumn,
    });
    forEach({
      container: this.$rows,
      items: this.data,
      type: () => PgTableRow,
    });
  }

  render(changes) {
    if (changes.data) {
      console.log(this.data);
    }
  }
}