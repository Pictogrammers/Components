import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from './inputPills.html';
import style from './inputPills.css';
import PgInputPill from '../inputPill/inputPill';

export interface Pill {
  value: string;
  label: string;
}

@Component({
  selector: 'pg-input-pills',
  style,
  template,
})
export default class PgInputPills extends HTMLElement {
  @Prop() name: string = '';
  @Prop() items: Pill[] = [];

  @Part() $items: HTMLDivElement;

  #initialized: boolean = false;

  connectedCallback() {
    // Reconnects re-invoke connectedCallback; guard against duplicate listeners.
    if (this.#initialized) return;
    this.#initialized = true;
    forEach({
      container: this.$items,
      items: this.items,
      type: () => PgInputPill,
      create: ($item: PgInputPill, item: Pill) => {
        $item.addEventListener('remove', () => {
          const index = this.items.findIndex((i) => i.value === item.value);
          if (index !== -1) {
            this.items.splice(index, 1);
          }
          this.dispatchEvent(
            new CustomEvent('change', {
              detail: {
                value: item.value,
                label: item.label,
                items: this.items,
              }
            })
          );
        });
      }
    });
  }
}
