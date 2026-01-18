import { Component, Prop, Part } from '@pictogrammers/element';

import PgJsonArray from '../jsonArray/jsonArray';
import PgJsonObject from '../jsonObject/jsonObject';
import PgJsonString from '../jsonString/jsonString';
import PgJsonBoolean from '../jsonBoolean/jsonBoolean';
import PgJsonNumber from '../jsonNumber/jsonNumber';

import template from './json.html';
import style from './json.css';

function getType(value) {
  if (typeof value === 'string') {
    return PgJsonString;
  }
  if (typeof value === 'boolean') {
    return PgJsonBoolean;
  }
  if (typeof value === 'number') {
    return PgJsonNumber;
  }
}

function unwrapObject(obj: any) {
  return Object.keys(obj).map((key) => {
    if (Array.isArray(obj[key])) {
      return {
        key,
        value: unwrapArray(obj[key]),
        type: PgJsonArray,
      };
    }
    if (typeof obj[key] === 'object') {
      return {
        key,
        value: unwrapObject(obj[key]),
        type: PgJsonObject,
      };
    }
    return {
      key,
      value: obj[key],
      type: getType(obj[key]),
    };
  });
}

function unwrapArray(items: any) {
  return items.map((item, i) => {
    if (Array.isArray(item)) {
      return {
        key: i.toString(),
        value: unwrapArray(item),
        type: PgJsonArray,
      };
    }
    if (typeof item === 'object') {
      return {
        key: i.toString(),
        value: unwrapObject(item),
        type: PgJsonObject,
      };
    }
    return {
      key: i.toString(),
      value: item,
      type: getType(item),
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
      if (this.$container.children.length === 1) {
        this.$container.children[0].remove();
      }
      if (typeof this.value === 'object') {
        const $object = document.createElement('pg-json-object') as PgJsonObject;
        $object.value = unwrapObject(this.value);
        $object.addEventListener('update', this.handleUpdate.bind(this));
        this.$container.appendChild($object);
      } else if (Array.isArray(this.value)) {
        const $array = document.createElement('pg-json-array') as PgJsonArray;
        $array.value = unwrapArray(this.value);
        $array.addEventListener('update', this.handleUpdate.bind(this));
        this.$container.appendChild($array);
      }
    }
  }

  getParent(path: string[], parent) {
    const key = path.pop();
    if (key && (typeof parent[key] === 'object' || parent[key] instanceof Array)) {
      return this.getParent(path, parent[key]);
    }
    return parent;
  }

  handleUpdate(e: any) {
    const { path, key, value } = e.detail;
    const parent = this.getParent(path, this.value);
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          parent,
          key,
          value,
        }
      })
    )
  }
}
