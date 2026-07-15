import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgTableColumn from '../tableColumn/tableColumn';
import PgTableRow from '../tableRow/tableRow';

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
      items.push({
        ...obj[key],
        key,
      });
    } else {
      items.push({
        key,
        value: obj[key],
      });
    }
  });
  return { items };
}

function escapeCSV(value: any) {
  if (value === null || value === undefined) {
    return '';
  }
  const text = `${value}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
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

  #initialized: boolean = false;

  connectedCallback() {
    // Reconnects re-invoke connectedCallback; running forEach again
    // would duplicate columns, rows, and listeners.
    if (this.#initialized) return;
    this.#initialized = true;
    forEach({
      container: this.$columns,
      items: this.columns,
      type: (column) => column.type ?? PgTableColumn,
    });
    forEach({
      container: this.$rows,
      items: this.data,
      type: () => PgTableRow,
      create: ($item: PgTableRow, item) => {
        if (this.columns.length === 0) {
          throw new Error('columns must be set before data');
        }
        $item.columns = this.columns;
        $item.addEventListener('action', (e: any) => {
          e.stopPropagation();
          this.dispatchEvent(new CustomEvent('action', {
            detail: e.detail,
          }));
        })
      }
    });
  }

  getCSV() {
    let text = this.columns.map((column) => {
      return escapeCSV(column.label);
    }).join(',');
    text += '\n';
    text += this.data.map(({ items }) => {
      return items.map((item) => {
        return escapeCSV(item.value);
      }).join(',')
    }).join('\n');
    return text;
  }
}
