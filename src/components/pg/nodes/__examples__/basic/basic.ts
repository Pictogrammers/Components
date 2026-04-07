import { Component, Part } from '@pictogrammers/element';
import PgNodes from '../../nodes';

import template from './basic.html';

@Component({
  selector: 'x-pg-nodes-basic',
  template,
})
export default class XPgInputNodesBasic extends HTMLElement {

  @Part() $nodes: PgNodes;

  connectedCallback() {
    this.$nodes.items.push({
      x: 2,
      y: 2,
      fields: [{
        label: 'Name',
        value: '10'
      }]
    });
    this.$nodes.addEventListener('change', this.#handleChange.bind(this));
    this.$nodes.addEventListener('input', this.#handleInput.bind(this));
  }

  #handleChange(e: CustomEvent) {
    const { item } = e.detail;
    //this.$value1.textContent = value;
  }

  #handleInput(e: CustomEvent) {
    const { item } = e.detail;
    //this.$value2.textContent = value;
  }
}
