import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgTableColumn from '../tableColumn/tableColumn';
import PgTableRow from '../tableRow/tableRow';
import PgTableCellText from '../tableCellText/tableCellText';

import template from './table.html';
import style from './table.css';

/**
 * Create a table data item that can react to data changes. While cumbersome
 * this greatly increases performance and uses less memory.
 *
 * @param obj ex: { field1: 'value', field2: 42 }
 * @returns formatted object
 */
export function createTableItem(obj: object) {
  const keys = Object.keys(obj);
  const items: any[] = [];
  keys.forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (obj[key].hasOwnProperty('type')) {
        obj[key].type = PgTableCellText;
      }
      items.push({
        key,
        ...obj[key]
      });
    } else {
      items.push({
        key,
        value: `${obj[key] || ''}`,
        type: PgTableCellText,
      });
    }
  });
  return { items };
}

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

  trackedData = [];

  connectedCallback() {
    forEach({
      container: this.$columns,
      items: this.columns,
      type: () => PgTableColumn,
    });
    forEach({
      container: this.$rows,
      items: this.data,
      type: () => PgTableRow
    });
  }
}
