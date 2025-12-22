import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgJsonArray from '../jsonArray/jsonArray';
import PgJsonString from '../jsonString/jsonString';
import PgJsonBoolean from '../jsonBoolean/jsonBoolean';
import PgJsonNumber from '../jsonNumber/jsonNumber';

import template from './jsonObject.html';
import style from './jsonObject.css';

@Component({
  selector: 'pg-json-object',
  style,
  template,
})
export default class PgJsonObject extends HTMLElement {
  @Prop() key: string = '';
  @Prop() value: any[] = [];
  @Prop() expanded: boolean = false;

  @Part() $items: HTMLElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.value,
      type: (item) => {
        if (Array.isArray(item.value)) {
          return PgJsonArray;
        }
        if (typeof item.value === 'object') {
          return PgJsonObject;
        }
        if (typeof item.value === 'string') {
          return PgJsonString;
        }
        if (typeof item.value === 'boolean') {
          return PgJsonBoolean;
        }
        if (typeof item.value === 'number') {
          return PgJsonNumber;
        }
      },
    });
  }
}
