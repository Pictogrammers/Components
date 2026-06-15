import { Component, Prop, Part, forEach } from '@pictogrammers/element';
import { NodeConnector } from '@pictogrammers/node-connector';

import PgNode from '../node/node';
import PgNodeEntry from '../nodeEntry/nodeEntry';
import PgOverlayContextMenu from '../overlayContextMenu/overlayContextMenu';
import PgMenuItem from '../menuItem/menuItem';

import template from './nodes.html';
import style from './nodes.css';

type NodeState = { x: number; y: number; width: number; height: number };
type UndoTransform = { type: 'transform'; nodeId: string; before: NodeState; after: NodeState };
type UndoDelete = { type: 'delete'; item: any; index: number };
type UndoItem = UndoTransform | UndoDelete;

@Component({
  selector: 'pg-nodes',
  style,
  template,
})
export default class PgNodes extends HTMLElement {
  @Prop() items: any = [];
  @Prop() nodes: any = [];
  @Prop() gridSize: number = 16;
  @Prop() menuItems: any = [];

  @Part() $grid: HTMLDivElement;
  @Part() $svg: SVGSVGElement;
  @Part() $items: HTMLDivElement;
  @Part() $forceScroll: HTMLDivElement;

  #nextNodeId: number = 0;
  #connector: NodeConnector | null = null;
  #nodePinCounts = new Map<string, number>();
  #selected = new Set<string>();

  #undo: UndoItem[] = [];
  #redo: UndoItem[] = [];
  #nodeStates = new Map<string, NodeState>();

  connectedCallback() {
    const connector = new NodeConnector(this.$svg);
    connector.bridgeColor = '#0a0c14';
    this.#connector = connector;

    connector.on('change', (change) => {
      console.log(change.type, change.sourceNodeId, change.sourceKey, change.targetNodeId, change.targetKey);
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? this.#applyRedo() : this.#applyUndo();
        return;
      }

      if (this.#selected.size > 0) {
        this.#selected.forEach((id) => {
          const node = this.getNodeById(id) as any;
          switch (e.key) {
            case 'ArrowUp': {
              e.preventDefault();
              const before = this.#nodeStates.get(id) ?? { x: node.x, y: node.y, width: node.width, height: node.height };
              node.y -= 1;
              this.#pushTransform(id, before, { x: node.x, y: node.y, width: node.width, height: node.height });
              this.#updatePins(id);
              break;
            }
            case 'ArrowDown': {
              e.preventDefault();
              const before = this.#nodeStates.get(id) ?? { x: node.x, y: node.y, width: node.width, height: node.height };
              node.y += 1;
              this.#pushTransform(id, before, { x: node.x, y: node.y, width: node.width, height: node.height });
              this.#updatePins(id);
              break;
            }
            case 'ArrowLeft': {
              e.preventDefault();
              const before = this.#nodeStates.get(id) ?? { x: node.x, y: node.y, width: node.width, height: node.height };
              node.x -= 1;
              this.#pushTransform(id, before, { x: node.x, y: node.y, width: node.width, height: node.height });
              this.#updatePins(id);
              break;
            }
            case 'ArrowRight': {
              e.preventDefault();
              const before = this.#nodeStates.get(id) ?? { x: node.x, y: node.y, width: node.width, height: node.height };
              node.x += 1;
              this.#pushTransform(id, before, { x: node.x, y: node.y, width: node.width, height: node.height });
              this.#updatePins(id);
              break;
            }
            case 'Delete':
              this.#deleteNodeWithUndo(id);
              break;
            case 'Escape':
              this.clearSelection();
              break;
          }
        });
        if (e.key === 'Delete') {
          this.#selected.clear();
        }
      }
    });

    this.$grid.addEventListener('click', (e: any) => {
      if (e.target.part.contains('grid')) {
        this.clearSelection();
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
          items: [
            { label: 'Add Node', value: 'addNode', type: PgMenuItem },
            { label: 'Add Node Bool', value: 'addNodeBool', type: PgMenuItem }
          ],
        });
        if (!result) { return; }
        switch(result.value) {
          case 'addNode':
            this.items.push({
              node: this.#nextNodeId,
              x,
              y,
              fields: [{ label: 'Name', value: 'Foo', type: 'Text' }],
              nodes: [{ key: 'nodes', label: 'Nodes' }],
            });
            break;
          case 'addNodeBool':
            this.items.push({
              node: this.#nextNodeId,
              x,
              y,
              fields: [{ label: 'Name', value: 'Foo', type: 'Text' }],
              nodes: [{ key: 't', label: 'True' }, { key: 'f', label: 'False' }],
            });
            break;
        }
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
          items: [{ label: 'Delete Node', value: 'deleteNode', type: PgMenuItem }],
        });
        if (result?.value === 'deleteNode') {
          this.#deleteNodeWithUndo(nodeId);
          this.#selected.clear();
        }
      }
    });

    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => item.node === 0 ? PgNodeEntry : PgNode,
      create: ($item, item) => {
        const nodeId = `${item.node}`;
        this.#nextNodeId = Math.max(item.node, this.#nextNodeId) + 1;
        connector.setNode(nodeId, item.x * 16, item.y * 16, (item.width ?? 12) * 16, (item.height ?? 4) * 16);
        if (item.node !== 0) {
          connector.setInputPin(nodeId, 'in', 16);
        }
        if (item.nodes.some(x => x.key === 'nodes')) {
          connector.setOutputPin(nodeId, 'nodes', 16);
        }
        $item.addEventListener('registernode', this.#registerNode.bind(this));
        $item.addEventListener('registernodeoutput', this.#registerNodeOutput.bind(this));
        $item.addEventListener('select', this.#handleSelect.bind(this));
        $item.addEventListener('change', this.#handleChange.bind(this));
        this.#nodeStates.set(nodeId, {
          x: item.x,
          y: item.y,
          width: item.width ?? 12,
          height: item.height ?? 4,
        });
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

  render(_changes: any) {}

  #registerNode(e: any) {
    if (!this.#connector) return;
    const { node, key } = e.detail;
    const nodeId = `${node}`;
    const index = this.#nodePinCounts.get(nodeId) ?? 0;
    this.#nodePinCounts.set(nodeId, index + 1);
  }

  #registerNodeOutput(e: any) {
    const { node, key, offset } = e.detail;
    this.#connector?.setOutputPin(node, key, offset);
  }

  #shiftOrCtrl: boolean = false;
  #handleSelect(e: any) {
    const { nodeId } = e.detail;
    if (!this.#shiftOrCtrl) {
      this.#selected.forEach((value) => {
        this.getNodeById(value).deselect();
      });
      this.#selected.clear();
    }
    this.#selected.add(nodeId);
    e.target.select();
  }

  #handleChange(e: any) {
    const nodeId = String((e.target as any).node);
    const { x, y, width, height } = e.detail;
    const before = this.#nodeStates.get(nodeId) ?? { x, y, width, height };
    this.#pushTransform(nodeId, before, { x, y, width, height });
    this.#updatePins(nodeId);
  }

  // Push a transform onto the undo stack, merging with the previous entry when it targets
  // the same node — keeps the stack from growing on every snap during a single drag.
  #pushTransform(nodeId: string, before: NodeState, after: NodeState) {
    const last = this.#undo.at(-1);
    if (last?.type === 'transform' && last.nodeId === nodeId) {
      last.after = after;
    } else {
      this.#undo.push({ type: 'transform', nodeId, before, after });
    }
    this.#redo = [];
    this.#nodeStates.set(nodeId, after);
  }

  #applyUndo() {
    const item = this.#undo.pop();
    if (!item) return;
    this.#redo.push(item);
    this.#applyItem(item, 'undo');
  }

  #applyRedo() {
    const item = this.#redo.pop();
    if (!item) return;
    this.#undo.push(item);
    this.#applyItem(item, 'redo');
  }

  #applyItem(item: UndoItem, direction: 'undo' | 'redo') {
    switch (item.type) {
      case 'transform': {
        const state = direction === 'undo' ? item.before : item.after;
        const node = this.getNodeById(item.nodeId) as any;
        if (!node) return;
        node.x = state.x;
        node.y = state.y;
        node.width = state.width;
        node.height = state.height;
        this.#nodeStates.set(item.nodeId, state);
        this.#updatePins(item.nodeId);
        break;
      }
      case 'delete': {
        if (direction === 'undo') {
          // Re-insert the item; forEach recreates the element and calls create for connector setup
          this.items.splice(item.index, 0, item.item);
          this.#nodeStates.set(String(item.item.node), {
            x: item.item.x,
            y: item.item.y,
            width: item.item.width ?? 12,
            height: item.item.height ?? 4,
          });
        } else {
          this.#deleteNode(String(item.item.node));
        }
        break;
      }
    }
  }

  #deleteNode(nodeId: string) {
    const index = this.items.findIndex((x: any) => String(x.node) === nodeId);
    if (index > 0) {
      this.items.splice(index, 1);
      this.#connector?.removeNode(nodeId);
      this.#nodeStates.delete(nodeId);
    }
  }

  #deleteNodeWithUndo(nodeId: string) {
    const index = this.items.findIndex((x: any) => String(x.node) === nodeId);
    if (index <= 0) return;
    // Capture current live state from the DOM element, not the stale item data
    const node = this.getNodeById(nodeId) as any;
    const item = {
      ...this.items[index],
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
    };
    this.#deleteNode(nodeId);
    this.#undo.push({ type: 'delete', item, index });
    this.#redo = [];
  }

  #updatePins(nodeId: string) {
    const { x, y, width, height } = this.getNodeById(nodeId);
    this.#connector?.setNode(
      nodeId,
      x * this.gridSize,
      y * this.gridSize,
      (width ?? 12) * this.gridSize,
      (height ?? 3) * this.gridSize
    );
  }
}
