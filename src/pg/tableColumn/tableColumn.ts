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
  @Prop() hideLabel: boolean = false;
  @Prop() key: string = '';

  @Part() $label: HTMLDivElement;

  render(changes: { [key: string ]: boolean}) {
    if (changes.label || changes.hideLabel) {
      console.log(this.label, this.hideLabel);
      if (this.hideLabel) {
        this.$label.ariaLabel = this.label;
        this.$label.textContent = '';
      } else {
        this.$label.ariaLabel = null;
        this.$label.textContent = this.label;
      }
    }
  }
}