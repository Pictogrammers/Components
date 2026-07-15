import { Component, Prop, Part } from '@pictogrammers/element';

import PgButton from '../button/button';
import PgIcon from '../icon/icon';

import template from './tableCellButtonIcon.html';
import style from './tableCellButtonIcon.css';

@Component({
  selector: 'pg-table-cell-button-icon',
  style,
  template
})
export default class PgTableCellButtonIcon extends HTMLElement {
  @Prop() value: any = null;
  @Prop() icon: string = '';

  @Part() $button: PgButton;
  @Part() $icon: PgIcon;

  #initialized: boolean = false;

  connectedCallback() {
    // Reconnects re-invoke connectedCallback; guard against duplicate listeners.
    if (this.#initialized) return;
    this.#initialized = true;
    this.$button.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('action', {
        detail: {},
      }));
    });
  }

  render(changes) {
    if (changes.icon) {
      this.$icon.path = this.icon;
    }
  }
}
