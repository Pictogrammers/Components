import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgTableCellText from '../tableCellText/tableCellText';
import PgTableCellNumber from '../tableCellNumber/tableCellNumber';
import PgTableCellCheck from '../tableCellCheck/tableCellCheck';

import template from './tableRow.html';
import style from './tableRow.css';

const types = new Map<string, any>([
  ['string', PgTableCellText],
  ['number', PgTableCellNumber],
  ['boolean', PgTableCellCheck]
]);

@Component({
  selector: 'pg-table-row',
  style,
  template
})
export default class PgTableRow extends HTMLElement {
  @Prop() index: number;
  @Prop() items: any[] = [];
  @Prop() key: string = '';
  @Prop() columns: any[] = [];

  @Part() $cells: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$cells,
      items: this.items,
      type: (item) => {
        return item.type
          ? item.type
          : types.get(typeof item.value);
      },
      create: ($item: any, item) => {
        const { editable, maxWidth } = this.columns.find(i => i.key === item.key) ?? {};
        if (editable) {
          $item.editable = editable;
        }
        if (maxWidth) {
          $item.maxWidth = maxWidth;
        }
        $item.addEventListener('action', (e: any) => {
          e.stopPropagation();
          this.dispatchEvent(new CustomEvent('action', {
            detail: {
              ...e.detail,
              index: this.index,
              key: item.key,
              getRows: () => {
                if (!this.parentNode) { return; }
                const items = Array.from(this.parentNode.children) as PgTableRow[];
                return items.map((row) => {
                  return {
                    getColumn: (key: string) => {
                      return row.items.find(x => x.key === key);
                    },
                  };
                });
              },
              getRow() {
                return this.items;
              },
              getColumn: (key: string) => {
                return this.items.find(x => x.key === key);
              },
            },
          }));
        });
      },
    });
  }
}
