import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgNode from '../node/node';
import PgNodeEntry from '../nodeEntry/nodeEntry';

import template from './nodes.html';
import style from './nodes.css';

@Component({
  selector: 'pg-nodes',
  style,
  template,
})
export default class PgNodes extends HTMLElement {
  @Prop() items: any = [];

  @Part() $items: HTMLDivElement;
  @Part() $forceScroll: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => item.node === 0 ? PgNodeEntry : PgNode,
      create: ($item, item) => {
        $item.addEventListener('registernode', this.#registerNode.bind(this));
      },
    });
  }

  render(changes: any) {

  }

  #registerNode(e: any) {
    console.log(e.detail.node, e.detail.label);
  }
}
