import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgJsonObject from '../jsonObject/jsonObject';
import PgJsonString from '../jsonString/jsonString';
import PgJsonBoolean from '../jsonBoolean/jsonBoolean';
import PgJsonNumber from '../jsonNumber/jsonNumber';

import template from './jsonArray.html';
import style from './jsonArray.css';

@Component({
  selector: 'pg-json-array',
  style,
  template,
})
export default class PgJsonArray extends HTMLElement {
  @Prop() key: string = '';
  @Prop() value: any[] = [];
  @Prop() expanded: boolean = false;

  @Part() $key: HTMLDivElement;
  @Part() $seperator: HTMLDivElement;
  @Part() $items: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.value,
      type: (item) => item.type,
      create: ($item, item) => {
        $item.addEventListener('update', (e: any) => {
          const { path, key, value } = e.detail;
          path.push(this.key);
          this.dispatchEvent(
            new CustomEvent('update', {
              detail: {
                path,
                key,
                value,
              }
            })
          );
        });
      },
    });
  }

  render(changes) {
    if (changes.key) {
      this.$key.classList.toggle('hide', this.key === '');
      this.$seperator.classList.toggle('hide', this.key === '');
      this.$key.textContent = this.key;
    }
  }
}
