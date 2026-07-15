import { Component, Prop, Part } from '@pictogrammers/element';

import PgInputFileLocal from '../inputFileLocal/inputFileLocal';

import template from './tableCellFileLocal.html';
import style from './tableCellFileLocal.css';

@Component({
  selector: 'pg-table-cell-file-local',
  style,
  template
})
export default class PgTableCellFileLocal extends HTMLElement {
  @Prop() value: any = null;
  @Prop() key: string = '';
  @Prop() acceptsFileType: string = '';

  @Part() $input: PgInputFileLocal;

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
            name: e.detail.name,
            event: 'change',
          }
        })
      );
    });
  }

  render(changes) {
    if (changes.acceptsFileType) {
      this.$input.acceptsFileType = this.acceptsFileType;
    }
  }
}
