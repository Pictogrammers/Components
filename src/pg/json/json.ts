import { Component, Prop, Part } from '@pictogrammers/element';

import PgJsonArray from '../jsonArray/jsonArray';
import PgJsonObject from '../jsonObject/jsonObject';

import template from './json.html';
import style from './json.css';

function unwrapObject(obj: any) {
  return {
    items: Object.keys(obj).map((key) => {
      return {
        key,
        value: obj[key],
      }
    })
  };
}

function unwrapArray(items: any) {
  return {
    items: items.map((item) => {
      if (Array.isArray(item)) {
        return unwrapArray(item);
      } else {
        return unwrapObject(item);
      }
    })
  };
}

@Component({
  selector: 'pg-json',
  style,
  template,
})
export default class PgJson extends HTMLElement {
  @Prop() value: any = null;
  @Prop() root = [];
  @Prop() schema: any = null;

  @Part() $container: HTMLElement;

  render(changes) {
    if (changes.value && this.value !== null) {
      if (typeof this.value === 'object') {
        const $object = document.createElement('pg-json-object') as PgJsonObject;
        $object.items = unwrapObject(this.value).items;
        this.$container.appendChild($object);
      } else if (Array.isArray(this.value)) {
        const $array = document.createElement('pg-json-array') as PgJsonArray;
        $array.items = unwrapArray(this.value).items;
        this.$container.appendChild($array);
      }
    }
  }
}
