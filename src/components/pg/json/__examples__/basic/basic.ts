import { Component, Part, Prop } from '@pictogrammers/element';

import PgJson from '../../json';

import template from './basic.html';

@Component({
  selector: 'x-pg-json-basic',
  template
})
export default class XPgJsonBasic extends HTMLElement {
  @Part() $json: PgJson;
  @Part() $output: HTMLPreElement;

  connectedCallback() {
    this.$json.value = {
      users: [{
        name: 'Dipper Pines',
        age: 12,
        selected: false,
      }]
    }; // Array or Object
    this.$json.addEventListener('change', (e: any) => {
      const { parent, key, value } = e.detail;
      if (value !== parent[key]) {
        parent[key] = value;
      }
      this.$output.textContent = JSON.stringify(this.$json.value);
    });
  }
}
