import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputSelect from '../inputSelect/inputSelect';

import template from './tableCellSelect.html';
import style from './tableCellSelect.css';

@Component({
  selector: 'pg-table-cell-select',
  style,
  template
})
export default class PgTableCellSelect extends HTMLElement {
  @Prop() value: string = '';
  @Prop() key: string = '';
  @Prop() editable: boolean = false;
  @Prop() options: any[] = [];

  @Part() $input: PgInputSelect;

  #initialized: boolean = false;

  connectedCallback() {
    // Reconnects re-invoke connectedCallback; guard against duplicate listeners.
    if (this.#initialized) return;
    this.#initialized = true;
    this.$input.addEventListener('change', (e: any) => {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: {
            value: e.detail.value,
            event: 'change',
          }
        })
      );
    });
  }

  render(changes) {
    // options before value; the label is resolved from options when value is set
    if (changes.options) {
      this.$input.options = this.options;
    }
    if (changes.value) {
      this.$input.value = this.value;
    }
    if (changes.editable) {
      this.$input.readOnly = !this.editable;
    }
  }
}
