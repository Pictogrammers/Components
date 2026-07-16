import { Component, Part } from '@pictogrammers/element';

import PgTable, { createTableItem } from '../../table';
import PgTableCellSelect from '../../../tableCellSelect/tableCellSelect';
import PgTableCellText from '../../../tableCellText/tableCellText';
import PgTableCellNumber from '../../../tableCellNumber/tableCellNumber';
import PgTableCellCheck from '../../../tableCellCheck/tableCellCheck';

import style from './editor.css';
import template from './editor.html';

const editors = new Map<string, any>([
  ['string', PgTableCellText],
  ['number', PgTableCellNumber],
  ['boolean', PgTableCellCheck]
]);

const defaults = new Map<string, any>([
  ['string', 'hello'],
  ['number', 42],
  ['boolean', true]
]);

function createValueItem(editor: string) {
  return {
    type: (item: any) => editors.get(item.editor),
    editor,
    value: defaults.get(editor),
    key: 'value'
  };
}

@Component({
  selector: 'x-pg-table-editor',
  style,
  template
})
export default class XPgTableEditor extends HTMLElement {

  @Part() $table: PgTable;
  @Part() $output: HTMLPreElement;

  connectedCallback() {
    this.$table.columns = [{
      label: 'Name',
      key: 'name'
    }, {
      label: 'Editor',
      key: 'editor',
      editable: true,
      options: [
        { label: 'string', value: 'string' },
        { label: 'number', value: 'number' },
        { label: 'boolean', value: 'boolean' }
      ]
    }, {
      label: 'Value',
      key: 'value',
      editable: true
    }];
    this.$table.data = [
      createTableItem({
        name: 'Row 1',
        editor: {
          type: PgTableCellSelect,
          value: 'string'
        },
        value: createValueItem('string')
      }),
      createTableItem({
        name: 'Row 2',
        editor: {
          type: PgTableCellSelect,
          value: 'number'
        },
        value: createValueItem('number')
      }),
      createTableItem({
        name: 'Row 3',
        editor: {
          type: PgTableCellSelect,
          value: 'boolean'
        },
        value: createValueItem('boolean')
      })
    ];
    this.$table.addEventListener('action', (e: any) => {
      const { getColumn, getRow, key, value } = e.detail;
      switch (key) {
        case 'editor': {
          getColumn(key).value = value;
          // The cell editor is resolved when the cell is created; replace the
          // value item with a fresh one so its type factory runs again.
          const items = getRow();
          const index = items.findIndex((x: any) => x.key === 'value');
          items.splice(index, 1, createValueItem(value));
          break;
        }
        case 'value':
          getColumn(key).value = value;
          break;
      }
      this.$output.textContent = this.$table.getCSV();
    });
  }
}
