import { Component, Prop, Part, forEach } from '@pictogrammers/element';
import { NodeConnector } from '@pictogrammers/node-connector';

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

  @Part() $svg: SVGSVGElement;
  @Part() $items: HTMLDivElement;
  @Part() $forceScroll: HTMLDivElement;

  connectedCallback() {
    const connector = new NodeConnector(this.$svg);
    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => item.node === 0 ? PgNodeEntry : PgNode,
      create: ($item, item) => {
        connector.setNode(`${item.node}`, item.x * 16, item.y * 16, 192, 128);
        if (item.node !== 0) {
          connector.setInputPin(`${item.node}`, 'in', 16);
        }
        connector.setOutputPin(`${item.node}`, 'out', 16);
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
