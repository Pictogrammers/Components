import { Component, Part } from '@pictogrammers/element';
import PgNode from '../../node';

import template from './basic.html';

@Component({
  selector: 'x-pg-node-basic',
  template,
})
export default class XPgNodeBasic extends HTMLElement {

  @Part() $node: PgNode;

  connectedCallback() {
    this.$node.addEventListener('change', this.#handleChange.bind(this));
    this.$node.addEventListener('input', this.#handleInput.bind(this));
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
