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
  @Prop() index: number;
  @Prop() items: any = [];
  @Prop() key: string = '';

  @Part() $cells: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$cells,
      items: this.items,
      type: (item) => item.type ? item.type : PgTableCellText,
      create: ($item) => {
        $item.addEventListener('action', (e: any) => {
          e.stopPropagation();
          this.dispatchEvent(new CustomEvent('action', {
            detail: {
              ...e.detail,
              index: this.index,
              getRow() {
                return this.items;
              },
              getColumn: (key: string) => {
                return this.items.find(x => x.key === key);
              }
            },
          }));
        });
      },
    });
  }
}