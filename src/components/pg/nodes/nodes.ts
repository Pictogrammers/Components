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

  #connector: NodeConnector | null = null;
  #nodePinCounts = new Map<string, number>();

  connectedCallback() {
    const connector = new NodeConnector(this.$svg);
    this.#connector = connector;

    connector.on('change', (change) => {
      console.log(change.type, change.sourceNodeId, change.sourceKey, change.targetNodeId, change.targetKey);
    });

    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => item.node === 0 ? PgNodeEntry : PgNode,
      create: ($item, item) => {
        connector.setNode(`${item.node}`, item.x * 16, item.y * 16, 192, 128);
        if (item.node !== 0) {
          connector.setInputPin(`${item.node}`, 'in', 16);
        }
        connector.setOutputPin(`${item.node}`, 'nodes', 16);
        $item.addEventListener('registernode', this.#registerNode.bind(this));
      },
    });
  }

  render(changes: any) {

  }

  #registerNode(e: any) {
    if (!this.#connector) return;
    const { node, key } = e.detail;
    const nodeId = `${node}`;
    const index = this.#nodePinCounts.get(nodeId) ?? 0;
    this.#nodePinCounts.set(nodeId, index + 1);
  }
}
