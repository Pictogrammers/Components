import { Component, Part, Prop } from '@pictogrammers/element';
import PgTable from '../../table';

import template from './basic.html';

@Component({
  selector: 'x-pg-table-basic',
  template
})
export default class XPgTableBasic extends HTMLElement {

  @Part() $table: PgTable;

  connectedCallback() {
    // this.$table.addEventListener('click', this.handleClick.bind(this));
    this.$table.columns = [{
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
    const IconStar = 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z';
    const IconStarOutline = 'M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z';
    this.$table.data = [{
      name: 'Dipper Pines',
      age: 12,
      // favorite: {
      //   type: TableCellButtonIcon,
      //   icon: IconStar,
      // }
    }, {
      name: 'Mabel Pines',
      age: 12,
      // favorite: {
      //   type: TableCellButtonIcon,
      //   icon: IconStar,
      // }
    }];
  }

  handleClick() {

  }

}