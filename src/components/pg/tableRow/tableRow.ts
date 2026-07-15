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

  #initialized: boolean = false;

  connectedCallback() {
    // Reconnects (e.g. rows moved during a data reorder) re-invoke
    // connectedCallback; running forEach again would duplicate cells.
    if (this.#initialized) return;
    this.#initialized = true;
    forEach({
      container: this.$cells,
      items: this.items,
      type: (item) => {
        let type = item.type;
        if (typeof type === 'function' && !(type.prototype instanceof HTMLElement)) {
          // factory form: (item) => cell component class
          type = type(item);
        }
        type ??= types.get(typeof item.value);
        if (!type) {
          throw new Error(`no cell component for key '${item.key}'; use a string, number, or boolean value, or set an explicit 'type'`);
        }
        return type;
      },
      create: ($item: any, item) => {
        const { editable, maxWidth, options, acceptsFileType } = this.columns.find(i => i.key === item.key) ?? {};
        if (editable) {
          $item.editable = editable;
        }
        if (maxWidth) {
          $item.maxWidth = maxWidth;
        }
        if (options) {
          $item.options = options;
        }
        if (acceptsFileType) {
          $item.acceptsFileType = acceptsFileType;
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
                return items.map((row, index) => {
                  return {
                    getColumn: (key: string) => {
                      return row.items.find(x => x.key === key);
                    },
                    index,
                  };
                });
              },
              getRow: () => {
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
