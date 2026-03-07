import { Component, Prop, Part, normalizeBoolean, forEach } from '@pictogrammers/element';

import template from './inputRadio.html';
import style from './inputRadio.css';
import PgInputRadioItem from '../inputRadioItem/inputRadioItem';

@Component({
  selector: 'pg-input-radio',
  style,
  template,
})
export default class PgInputRadio extends HTMLElement {
  @Prop() name: string = '';
  @Prop() value: string = '';
  @Prop(normalizeBoolean) readOnly: boolean = false;
  @Prop(normalizeBoolean) disabled: boolean = false;
  @Prop() items: any[] = [];

  @Part() $items: HTMLInputElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: () => PgInputRadioItem,
      create: ($item: PgInputRadioItem, item) => {
        $item.addEventListener('change', () => {
          Array.from(this.$items.children).forEach(($ele: PgInputRadioItem) => {
            if ($ele === $item) {
              $ele.checked = true;
            } else {
              $ele.checked = false;
            }
          });
        });
        // set initial checked
        if (item.value === this.value) {
          $item.checked = true;
        }
      }
    });
  }

  render(changes) {
    if (changes.value && this.items.length) {
      Array.from(this.$items.children).forEach(($ele: PgInputRadioItem) => {
        if ($ele.value === this.value) {
          $ele.checked = true;
        } else {
          $ele.checked = false;
        }
      });
    }
  }
}
