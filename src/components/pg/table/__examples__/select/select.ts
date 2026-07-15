import { Component, Part } from '@pictogrammers/element';

import PgTable, { createTableItem } from '../../table';
import PgTableCellSelect from '../../../tableCellSelect/tableCellSelect';

import style from './select.css';
import template from './select.html';

@Component({
  selector: 'x-pg-table-select',
  style,
  template
})
export default class XPgTableSelect extends HTMLElement {

  @Part() $table: PgTable;
  @Part() $output: HTMLPreElement;

  connectedCallback() {
    this.$table.columns = [{
      label: 'Name',
      key: 'name'
    }, {
      label: 'Role',
      key: 'role',
      editable: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' },
        { label: 'Guest', value: 'guest' }
      ]
    }];
    this.$table.data = [
      createTableItem({
        name: 'Dipper Pines',
        role: {
          type: PgTableCellSelect,
          value: 'member'
        }
      }),
      createTableItem({
        name: 'Mabel Pines',
        role: {
          type: PgTableCellSelect,
          value: 'admin'
        }
      }),
      createTableItem({
        name: 'Grunkle Stan',
        role: {
          type: PgTableCellSelect,
          value: 'guest'
        }
      })
    ];
    this.$table.addEventListener('action', (e: any) => {
      const { getColumn, key, value, index } = e.detail;
      switch (key) {
        case 'role':
          getColumn(key).value = value;
          break;
      }
      this.$output.textContent = `row ${index}: ${key} = ${value}\n${this.$table.getCSV()}`;
    });
  }
}
