import { Component, Part } from '@pictogrammers/element';
import PgNodes from '../../nodes';

import template from './basic.html';

@Component({
  selector: 'x-pg-nodes-basic',
  template,
})
export default class XPgNodesBasic extends HTMLElement {

  @Part() $nodes: PgNodes;

  connectedCallback() {
    this.$nodes.items.push({
      node: 0,
      x: 2,
      y: 2,
      nodes: [{
        key: 'nodes',
        label: 'nodes'
      }],
    });
    this.$nodes.items.push({
      node: 1,
      x: 16,
      y: 2,
      fields: [{
        label: 'Name',
        value: 'Foo',
        type: 'Text',
      }, {
        label: 'Field 2',
        value: 'hmm',
        type: 'Text',
      }],
      nodes: [{
        key: 'nodes',
        label: 'nodes'
      }],
    });
    this.$nodes.items.push({
      node: 2,
      x: 30,
      y: 2,
      fields: [{
        label: 'Name',
        value: 'Foo',
        type: 'Text',
      }],
      nodes: [{
        key: 't',
        label: 'True'
      }, {
        key: 'f',
        label: 'False'
      }],
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
