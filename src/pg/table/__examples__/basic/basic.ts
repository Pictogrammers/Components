import { Component, Part, Prop } from '@pictogrammers/element';

import PgTable, { createTableItem } from '../../table';
import PgTableCellButtonIcon from '../../../tableCellButtonIcon/tableCellButtonIcon';

import style from './basic.css';
import template from './basic.html';

const IconStar = 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z';
    const IconStarOutline = 'M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z';

@Component({
  selector: 'x-pg-table-basic',
  style,
  template
})
export default class XPgTableBasic extends HTMLElement {

  @Part() $table: PgTable;
  @Part() $pushData: HTMLButtonElement;
  @Part() $deleteLast: HTMLButtonElement;
  @Part() $output: HTMLPreElement;

  connectedCallback() {
    // this.$table.addEventListener('click', this.handleClick.bind(this));
    this.$table.columns = [{
      label: 'Select',
      key: 'selected',
      hideLabel: true,
    }, {
      label: 'Name',
      key: 'name'
    }, {
      label: 'Age',
      key: 'age'
    }, {
      label: 'Favorite',
      key: 'favorite',
      hideLabel: true,
    }];
    this.$table.data = [
      createTableItem({
        selected: false,
        name: 'Dipper Pines',
        age: 12,
        favorite: {
          type: PgTableCellButtonIcon,
          icon: IconStarOutline,
        }
      }),
      createTableItem({
        selected: false,
        name: 'Mabel Pines',
        age: 12,
        favorite: {
          type: PgTableCellButtonIcon,
          icon: IconStarOutline,
        }
      })
    ];
    this.$pushData.addEventListener('click', this.handlePushData.bind(this));
    this.$deleteLast.addEventListener('click', this.handleDeleteLast.bind(this));
    this.$table.addEventListener('action', (e: any) => {
      const { getColumn, key } = e.detail;
      switch(key) {
        case 'favorite':
          getColumn('favorite').value = !getColumn('favorite').value;
          if (getColumn('favorite').value) {
            getColumn('favorite').icon = IconStar;
          } else {
            getColumn('favorite').icon = IconStarOutline;
          }
          break;
        case 'selected':
          getColumn('selected').value = e.detail.value;
          break;
      }
      // CSV
      this.$output.textContent = this.$table.getCSV();
    });
  }

  newCount = 0;
  handlePushData() {
    this.$table.data.push(createTableItem({
      name: `new ${this.newCount++}`,
      age: this.newCount,
      favorite: {
        type: PgTableCellButtonIcon,
        icon: IconStarOutline,
      },
    }));
    // CSV
    this.$output.textContent = this.$table.getCSV();
  }

  handleDeleteLast() {
    this.$table.data.pop();
    // CSV
    this.$output.textContent = this.$table.getCSV();
  }

}