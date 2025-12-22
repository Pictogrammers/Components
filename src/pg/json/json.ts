import { Component, Prop, Part } from '@pictogrammers/element';

import PgJsonArray from '../jsonArray/jsonArray';
import PgJsonObject from '../jsonObject/jsonObject';

import template from './json.html';
import style from './json.css';

function unwrapObject(obj: any) {
  return Object.keys(obj).map((key) => {
    if (Array.isArray(obj[key])) {
      return {
        key,
        value: unwrapArray(obj[key]),
      };
    }
    if (typeof obj[key] === 'object') {
      return {
        key,
        value: unwrapObject(obj[key]),
      };
    }
    return {
      key,
      value: obj[key],
    };
  });
}

function unwrapArray(items: any) {
  return items.map((item, i) => {
    if (Array.isArray(item)) {
      return {
        key: i.toString(),
        value: unwrapArray(item),
      };
    }
    if (typeof item === 'object') {
      return {
        key: i.toString(),
        value: unwrapObject(item),
      };
    }
    return {
      key: i.toString(),
      value: item,
    }
  });
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
        $object.value = unwrapObject(this.value);
        this.$container.appendChild($object);
      } else if (Array.isArray(this.value)) {
        const $array = document.createElement('pg-json-array') as PgJsonArray;
        $array.value = unwrapArray(this.value);
        this.$container.appendChild($array);
      }
    }
  }
}
