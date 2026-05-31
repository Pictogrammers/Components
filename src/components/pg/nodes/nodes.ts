import { Component, Prop, Part, forEach } from '@pictogrammers/element';
import { NodeConnector } from '@pictogrammers/node-connector';

import PgNode from '../node/node';
import PgNodeEntry from '../nodeEntry/nodeEntry';
import PgOverlayContextMenu from '../overlayContextMenu/overlayContextMenu';
import PgMenuItem from '../menuItem/menuItem';

import template from './nodes.html';
import style from './nodes.css';

@Component({
  selector: 'pg-nodes',
  style,
  template,
})
export default class PgNodes extends HTMLElement {
  @Prop() items: any = [];
  @Prop() gridSize: number = 16;

  @Part() $grid: HTMLDivElement;
  @Part() $svg: SVGSVGElement;
  @Part() $items: HTMLDivElement;
  @Part() $forceScroll: HTMLDivElement;

  #nextNodeId: number = 0;
  #connector: NodeConnector | null = null;
  #nodePinCounts = new Map<string, number>();
  #selected = new Set<string>();

  connectedCallback() {
    const connector = new NodeConnector(this.$svg);
    connector.bridgeColor = '#0a0c14';
    this.#connector = connector;

    connector.on('change', (change) => {
      console.log(change.type, change.sourceNodeId, change.sourceKey, change.targetNodeId, change.targetKey);
    });

    document.addEventListener('keydown', (e: any) => {
      if (this.#selected.size > 0) {
        this.#selected.forEach((x) => {
          switch(e.key) {
            case 'ArrowUp':
              e.preventDefault();
              this.getNodeById(x).y -= 1;
              break;
            case 'ArrowDown':
              e.preventDefault();
              this.getNodeById(x).y += 1;
              break;
            case 'ArrowLeft':
              e.preventDefault();
              this.getNodeById(x).x -= 1;
              break;
            case 'ArrowRight':
              e.preventDefault();
              this.getNodeById(x).x += 1;
              break;
          }
        });
        console.log(e.key);
      }
    });

    this.$grid.addEventListener('click', (e: any) => {
      if (e.target.part.contains('grid')) {
        console.log('grid');
        this.#selected.forEach((value) => {
          this.getNodeById(value).deselect();
        });
        this.#selected.clear();
      } else {
        console.log('node');
      }
    });

    this.$grid.addEventListener('contextmenu', async (e: MouseEvent) => {
      e.preventDefault();
      const rect = this.$grid.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left + this.$grid.scrollLeft) / this.gridSize);
      const y = Math.floor((e.clientY - rect.top + this.$grid.scrollTop) / this.gridSize);
      const ele = e.target as HTMLDivElement;
      if (ele.part.contains('grid')) {
        const result = await PgOverlayContextMenu.open({
          source: this.$items,
          x: e.clientX,
          y: e.clientY,
          items: [{
            label: 'Add Node',
            value: 'addNode',
            type: PgMenuItem,
          }, {
            label: 'Delete Node',
            value: 'deleteNode',
            type: PgMenuItem,
          }],
        });
        if (!result) { return; }
        switch(result.value) {
          case 'addNode':
            this.items.push({
              node: this.#nextNodeId,
              x,
              y,
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
            break;
        }
        console.log(result, x, y);
      } else {
        this.clearSelection();
        // @ts-ignore
        const nodeId = String(ele.node);
        this.getNodeById(nodeId).select();
        this.#selected.add(nodeId);
        const result = await PgOverlayContextMenu.open({
          source: this.$items,
          x: e.clientX,
          y: e.clientY,
          items: [{
            label: 'Delete Node',
            value: 'deleteNode',
            type: PgMenuItem,
          }],
        });
      }
    });

    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => item.node === 0 ? PgNodeEntry : PgNode,
      create: ($item, item) => {
        this.#nextNodeId = Math.max(item.node, this.#nextNodeId) + 1;
        console.log('create', item.node);
        connector.setNode(`${item.node}`, item.x * 16, item.y * 16, 192, 64);
        if (item.node !== 0) {
          connector.setInputPin(`${item.node}`, 'in', 16);
        }
        connector.setOutputPin(`${item.node}`, 'nodes', 16);
        $item.addEventListener('registernode', this.#registerNode.bind(this));
        $item.addEventListener('select', this.#handleSelect.bind(this));
      },
    });
  }

  getNodeById(nodeId: string): PgNode {
    return Array.from(this.$items.children).find((x: any) => String(x.node) === nodeId) as PgNode;
  }

  clearSelection() {
    this.#selected.forEach((value) => {
      this.getNodeById(value).deselect();
    });
    this.#selected.clear();
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

  #handleSelect(e: any) {
    const { nodeId } = e.detail;
    this.#selected.add(nodeId);
    e.target.select();
    console.log('select', nodeId);
  }
}
