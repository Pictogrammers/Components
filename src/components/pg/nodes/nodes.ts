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
type UndoMultiTransform = { type: 'multi-transform'; primaryNodeId: string; transforms: Array<{ nodeId: string; before: NodeState; after: NodeState }> };
type UndoDelete = { type: 'delete'; item: any; index: number };
type UndoItem = UndoTransform | UndoMultiTransform | UndoDelete;

@Component({
  selector: 'pg-nodes',
  style,
  template,
})
export default class PgNodes extends HTMLElement {
  @Prop() items: any = [];
  @Prop() gridSize: number = 16;
  @Prop() menuItems: any = [];
  // Field editors
  @Prop() editors: any = [];
  // Node type registry
  @Prop() nodes: any = [];

  @Part() $grid: HTMLDivElement;
  @Part() $svg: SVGSVGElement;
  @Part() $items: HTMLDivElement;
  @Part() $forceScroll: HTMLDivElement;
  @Part() $selection: HTMLDivElement;

  #nextNodeId: number = 0;
  #connector: NodeConnector | null = null;
  #connectionsScheduled: boolean = false;
  #nodePinCounts = new Map<string, number>();
  #selected = new Set<string>();
  #debug: string | null = null;

  #undo: UndoItem[] = [];
  #redo: UndoItem[] = [];
  #nodeStates = new Map<string, NodeState>();

  #dragOrigin: { x: number; y: number } | null = null;
  #isDragging: boolean = false;
  #wasSelectionDrag: boolean = false;

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
      if (this.#wasSelectionDrag) {
        this.#wasSelectionDrag = false;
        return;
      }
      if (e.target.part.contains('grid')) {
        this.clearSelection();
      }
    });

    this.$grid.addEventListener('pointerdown', (e: PointerEvent) => {
      if (!e.isPrimary) return;
      const ele = e.target as HTMLElement;
      if (!ele.part?.contains('grid')) return;

      const rect = this.$grid.getBoundingClientRect();
      this.#dragOrigin = {
        x: e.clientX - rect.left + this.$grid.scrollLeft,
        y: e.clientY - rect.top + this.$grid.scrollTop,
      };
      this.#isDragging = false;

      const cancelDrag = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('keydown', onKeyDown);
        this.$grid.classList.remove('selecting');
        this.$selection.classList.remove('active');
        this.#dragOrigin = null;
        this.#isDragging = false;
      };

      const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') cancelDrag();
      };

      const onMove = (ev: PointerEvent) => {
        if (!this.#dragOrigin) return;
        const r = this.$grid.getBoundingClientRect();
        const curX = ev.clientX - r.left + this.$grid.scrollLeft;
        const curY = ev.clientY - r.top + this.$grid.scrollTop;
        const w = Math.abs(curX - this.#dragOrigin.x);
        const h = Math.abs(curY - this.#dragOrigin.y);
        if (w > 4 || h > 4) {
          this.#isDragging = true;
          this.$grid.classList.add('selecting');
          this.$selection.classList.add('active');
          this.$selection.style.left = `${Math.min(this.#dragOrigin.x, curX)}px`;
          this.$selection.style.top = `${Math.min(this.#dragOrigin.y, curY)}px`;
          this.$selection.style.width = `${w}px`;
          this.$selection.style.height = `${h}px`;
        }
      };

      const onUp = (ev: PointerEvent) => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('keydown', onKeyDown);
        this.$grid.classList.remove('selecting');
        this.$selection.classList.remove('active');

        if (!this.#dragOrigin || !this.#isDragging) {
          this.#dragOrigin = null;
          this.#isDragging = false;
          return;
        }

        const origin = this.#dragOrigin;
        this.#dragOrigin = null;
        this.#isDragging = false;
        this.#wasSelectionDrag = true;

        const r = this.$grid.getBoundingClientRect();
        const curX = ev.clientX - r.left + this.$grid.scrollLeft;
        const curY = ev.clientY - r.top + this.$grid.scrollTop;
        const selX = Math.min(origin.x, curX);
        const selY = Math.min(origin.y, curY);
        const selW = Math.abs(curX - origin.x);
        const selH = Math.abs(curY - origin.y);

        if (!ev.shiftKey) {
          this.clearSelection();
        }

        Array.from(this.$items.children).forEach((child: any) => {
          const nodeId = String(child.itemId);
          const nx = child.x * this.gridSize;
          const ny = child.y * this.gridSize;
          const nw = (child.width ?? 12) * this.gridSize;
          const nh = (child.height ?? 4) * this.gridSize;
          if (nx < selX + selW && nx + nw > selX && ny < selY + selH && ny + nh > selY) {
            this.#selected.add(nodeId);
            child.select();
          }
        });
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
      document.addEventListener('keydown', onKeyDown);
    });

    this.$grid.addEventListener('contextmenu', async (e: MouseEvent) => {
      e.preventDefault();
      const rect = this.$grid.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left + this.$grid.scrollLeft) / this.gridSize);
      const y = Math.floor((e.clientY - rect.top + this.$grid.scrollTop) / this.gridSize);
      const ele = e.target as HTMLDivElement;
      if (ele.part.contains('grid')) {
        const { nodes } = this;
        const result = await PgOverlayContextMenu.open({
          source: this.$items,
          x: e.clientX,
          y: e.clientY,
          items: nodes.map((nodeType: any) => {
            return { label: nodeType.label, value: nodeType.name, type: PgMenuItem };
          }),
        });
        if (!result) { return; }
        this.items.push({
          id: this.#nextNodeId++,
          node: result.value,
          x,
          y,
          args: {},
          nodes: {},
        });
      } else {
        this.clearSelection();
        // @ts-ignore
        const nodeId = String(ele.itemId);
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
      type: (item) => !item.node ? PgNodeEntry : PgNode,
      create: ($item: any, item) => {
        const nodeId = `${item.id}`;
        this.#nextNodeId = Math.max(item.id, this.#nextNodeId) + 1;
        connector.setNode(nodeId, item.x * 16, item.y * 16, (item.width ?? 12) * 16, (item.height ?? 4) * 16);

        if (item.node) {
          // Regular node: set input pin and look up output slots from type registry
          connector.setInputPin(nodeId, 'in', 16);
          const nodeType = this.nodes.find((n: any) => n.name === item.node);
          if (nodeType) {
            $item.label = nodeType.label;
            if (nodeType.args) {
              $item.fields = nodeType.args.map((arg: any) => ({
                label: arg.label,
                value: item.args?.[arg.key] ?? '',
                type: arg.editor,
              }));
            }
            if (nodeType.nodes) {
              $item.outputs = nodeType.nodes;
              nodeType.nodes.forEach((slot: any, i: number) => {
                connector.setOutputPin(nodeId, slot.key, 16 + i * 16);
              });
            }
          }
        } else {
          // Entry node (id 0): always has a single 'then' output
          connector.setOutputPin(nodeId, 'then', 16);
          $item.fields = [{ key: 'description', value: item.args?.description ?? '' }];
        }

        $item.addEventListener('registernode', this.#registerNode.bind(this));
        $item.addEventListener('registernodeoutput', this.#registerNodeOutput.bind(this));
        $item.addEventListener('select', this.#handleSelect.bind(this));
        $item.addEventListener('change', this.#handleChange.bind(this));
      },
      connect: ($item: any, item) => {
        const nodeId = `${item.id}`;
        this.#nodeStates.set(nodeId, {
          x: $item.x,
          y: $item.y,
          width: $item.width ?? 12,
          height: $item.height ?? 4,
        });
        connector.setNode(
          nodeId,
          $item.x * 16,
          $item.y * 16,
          ($item.width ?? 12) * 16,
          ($item.height ?? 4) * 16
        );
        if (!this.#connectionsScheduled) {
          this.#connectionsScheduled = true;
          queueMicrotask(() => {
            this.#connectionsScheduled = false;
            this.items.forEach((i: any) => {
              if (!i.nodes || typeof i.nodes !== 'object') return;
              Object.entries(i.nodes as Record<string, number[]>).forEach(([key, targets]) => {
                targets.forEach((targetId: number) => {
                  connector.connect(`${i.id}`, key, `${targetId}`, 'in');
                });
              });
            });
          });
        }
      },
    });
  }

  getNodeById(nodeId: string): PgNode {
    return Array.from(this.$items.children).find((x: any) => String(x.itemId) === nodeId) as PgNode;
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
    const { node } = e.detail;
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
    const nodeId = String((e.target as any).itemId);
    const { x, y, width, height } = e.detail;
    const before = this.#nodeStates.get(nodeId) ?? { x, y, width, height };

    if (this.#selected.has(nodeId) && this.#selected.size > 1) {
      const dx = x - before.x;
      const dy = y - before.y;
      const last = this.#undo.at(-1);
      if (last?.type === 'multi-transform' && last.primaryNodeId === nodeId) {
        for (const t of last.transforms) {
          const cur = this.#nodeStates.get(t.nodeId) ?? t.after;
          const newAfter: NodeState = t.nodeId === nodeId
            ? { x, y, width, height }
            : { x: cur.x + dx, y: cur.y + dy, width: cur.width, height: cur.height };
          t.after = newAfter;
          if (t.nodeId !== nodeId) {
            const other = this.getNodeById(t.nodeId) as any;
            if (other) { other.x = newAfter.x; other.y = newAfter.y; }
          }
          this.#nodeStates.set(t.nodeId, newAfter);
          this.#updatePins(t.nodeId);
        }
      } else {
        const transforms = Array.from(this.#selected).map((id) => {
          const state = this.#nodeStates.get(id) ?? { x: 0, y: 0, width: 12, height: 4 };
          const after: NodeState = id === nodeId
            ? { x, y, width, height }
            : { x: state.x + dx, y: state.y + dy, width: state.width, height: state.height };
          if (id !== nodeId) {
            const other = this.getNodeById(id) as any;
            if (other) { other.x = after.x; other.y = after.y; }
          }
          this.#nodeStates.set(id, after);
          this.#updatePins(id);
          return { nodeId: id, before: { ...state }, after };
        });
        this.#undo.push({ type: 'multi-transform', primaryNodeId: nodeId, transforms });
        this.#redo = [];
      }
      return;
    }

    this.#pushTransform(nodeId, before, { x, y, width, height });
    this.#updatePins(nodeId);
  }

  // Merges consecutive transforms on the same node during a single drag.
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
      case 'multi-transform': {
        for (const t of item.transforms) {
          const state = direction === 'undo' ? t.before : t.after;
          const node = this.getNodeById(t.nodeId) as any;
          if (!node) continue;
          node.x = state.x;
          node.y = state.y;
          node.width = state.width;
          node.height = state.height;
          this.#nodeStates.set(t.nodeId, state);
          this.#updatePins(t.nodeId);
        }
        break;
      }
      case 'delete': {
        if (direction === 'undo') {
          this.items.splice(item.index, 0, item.item);
          this.#nodeStates.set(String(item.item.id), {
            x: item.item.x,
            y: item.item.y,
            width: item.item.width ?? 12,
            height: item.item.height ?? 4,
          });
        } else {
          this.#deleteNode(String(item.item.id));
        }
        break;
      }
    }
  }

  #deleteNode(nodeId: string) {
    const index = this.items.findIndex((x: any) => String(x.id) === nodeId);
    if (index > 0) {
      this.items.splice(index, 1);
      this.#connector?.removeNode(nodeId);
      this.#nodeStates.delete(nodeId);
    }
  }

  #deleteNodeWithUndo(nodeId: string) {
    const index = this.items.findIndex((x: any) => String(x.id) === nodeId);
    if (index <= 0) return;
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

  debug(nodeId: string | null) {
    if (this.#debug !== null) {
      this.getNodeById(this.#debug).debug = false;
    }
    if (nodeId !== null) {
      this.getNodeById(nodeId).debug = true;
      this.#debug = nodeId;
    }
  }
}
