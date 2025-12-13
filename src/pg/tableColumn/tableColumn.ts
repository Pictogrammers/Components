import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from './tableColumn.html';
import style from './tableColumn.css';

@Component({
  selector: 'pg-table-column',
  style,
  template
})
export default class PgTableColumn extends HTMLElement {
  @Prop() label: string = '';
  @Prop() key: string = '';

  @Part() $label: HTMLDivElement;

  render(changes: { [key: string ]: boolean}) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
  }
}