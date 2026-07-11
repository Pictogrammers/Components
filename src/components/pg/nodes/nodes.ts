import { Component, Prop, Part, forEach } from '@pictogrammers/element';
import { NodeConnector } from '@pictogrammers/node-connector';

import PgNode from '../node/node';
import PgNodeEntry from '../nodeEntry/nodeEntry';
import PgOverlayContextMenu from '../overlayContextMenu/overlayContextMenu';
import PgMenuItem from '../menuItem/menuItem';

import template from './nodes.html';
import style from './nodes.css';

type NodeState = { x: number; y: number; width: number; height: number };
type UndoTransform = { type: 'transform'; nodeId: number; before: NodeState; after: NodeState };
type UndoMultiTransform = { type: 'multi-transform'; primaryNodeId: number; transforms: Array<{ nodeId: number; before: NodeState; after: NodeState }> };
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
  // Globals
  @Prop() globals: any = [];

  @Part() $grid: HTMLDivElement;
  @Part() $svg: SVGSVGElement;
  @Part() $items: HTMLDivElement;
  @Part() $forceScroll: HTMLDivElement;
  @Part() $selection: HTMLDivElement;
  @Part() $dragPreview: HTMLDivElement;

  #nextNodeId: number = 0;
  #focusNext: boolean = false;
  #connector: NodeConnector | null = null;
  #connectionsScheduled: boolean = false;
  #nodePinCounts = new Map<number, number>();
  #selected = new Set<number>();
  #debug: number[] = [];
  #debugPrevious: number = 0;

  #undo: UndoItem[] = [];
  #redo: UndoItem[] = [];
  #nodeStates = new Map<number, NodeState>();

  #clipboard: Array<{ item: any; state: NodeState }> | null = null;

  #dragOrigin: { x: number; y: number } | null = null;
  #isDragging: boolean = false;
  #wasSelectionDrag: boolean = false;

  connectedCallback() {
    const connector = new NodeConnector(this.$svg);
    connector.bridgeColor = '#0a0c14';
    this.#connector = connector;

    connector.on('create', (event) => {
      const { x, y, sourceY, sourceNodeId, sourceKey } = event;
      console.log(x, y, sourceY, sourceNodeId, sourceKey);
    });
    connector.on('change', (change) => {
      console.log(change.type, change.sourceNodeId, change.sourceKey, change.targetNodeId, change.targetKey);
      const targetNodeId = parseInt(change.targetNodeId, 10);
      const sourceNodeId = parseInt(change.sourceNodeId, 10);
      const currentItem = this.items.find((x) => x.id === sourceNodeId);
      if (change.type === 'connect') {
        if (!currentItem.nodes?.hasOwnProperty(change.sourceKey)) {
          currentItem.nodes[change.sourceKey] = [];
        }
        currentItem.nodes[change.sourceKey].push(targetNodeId);
      } else if (change.type === 'disconnect' && currentItem) {
        const index = currentItem.nodes[change.sourceKey].indexOf(targetNodeId);
        // Check if the item actually exists in the array (-1 means not found)
        if (index > -1) {
          currentItem.nodes[change.sourceKey].splice(index, 1);
        }
      }
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? this.#applyRedo() : this.#applyUndo();
        return;
      }

      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        this.#copySelected();
        return;
      }

      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        this.#pasteClipboard();
        return;
      }

      if (this.#selected.size === 0) return;

      if (e.key === 'Delete') {
        const toDelete = Array.from(this.#selected);
        this.#selected.clear();
        toDelete.forEach((id) => this.#deleteNodeWithUndo(id));
        return;
      }
      if (e.key === 'Escape') {
        this.clearSelection();
        return;
      }

      let dx = 0;
      let dy = 0;
      switch (e.key) {
        case 'ArrowUp': dy = -1; break;
        case 'ArrowDown': dy = 1; break;
        case 'ArrowLeft': dx = -1; break;
        case 'ArrowRight': dx = 1; break;
        default: return;
      }
      e.preventDefault();
      this.#moveSelectedBy(dx, dy);
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
          const nodeId = child.itemId as number;
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
        const nodeMenuItems = nodes.map((nodeType: any) => {
          return { label: nodeType.label, value: nodeType.name, type: PgMenuItem };
        });
        if (this.#clipboard && this.#clipboard.length > 0) {
          nodeMenuItems.unshift({ label: 'Paste', value: '__paste__', type: PgMenuItem });
        }
        const result = await PgOverlayContextMenu.open({
          source: this.$items,
          x: e.clientX,
          y: e.clientY,
          items: nodeMenuItems,
          filter: true,
        });
        if (!result) { return; }
        if (result.value === '__paste__') {
          this.#pasteClipboard();
          return;
        }
        const args = {};
        const nodeType = nodes.find(x => x.name === result.value);
        nodeType.args.forEach(({ key, value }) => {
          args[key] = value;
        });
        this.#focusNext = true;
        this.items.push({
          id: this.#nextNodeId,
          node: result.value,
          x,
          y,
          ...(nodeType.width !== undefined && { width: nodeType.width }),
          ...(nodeType.height !== undefined && { height: nodeType.height }),
          args,
          nodes: {},
        });
      } else {
        const nodeId = (ele as any).itemId as number;
        if (!this.#selected.has(nodeId)) {
          this.clearSelection();
          this.getNodeById(nodeId).select();
          this.#selected.add(nodeId);
        }
        const result = await PgOverlayContextMenu.open({
          source: this.$items,
          x: e.clientX,
          y: e.clientY,
          items: [
            { label: 'Copy', value: 'copyNode', type: PgMenuItem },
            { label: 'Delete Node', value: 'deleteNode', type: PgMenuItem },
          ],
        });
        if (result?.value === 'copyNode') {
          this.#copySelected();
        } else if (result?.value === 'deleteNode') {
          const toDelete = Array.from(this.#selected);
          this.#selected.clear();
          toDelete.forEach((id) => this.#deleteNodeWithUndo(id));
        }
      }
    });

    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => {
        item.editors = this.editors;
        return !item.node ? PgNodeEntry : PgNode;
      },
      create: ($item: any, item) => {
        const nodeId = item.id as number;
        this.#nextNodeId = Math.max(nodeId, this.#nextNodeId) + 1;
        connector.setNode(String(nodeId), item.x * 16, item.y * 16, (item.width ?? 12) * 16, (item.height ?? 4) * 16);

        if (item.node) {
          // Regular node: set input pin and look up output slots from type registry
          connector.setInputPin(String(nodeId), 'in', 16);
          const nodeType = this.nodes.find((n: any) => n.name === item.node);
          if (nodeType) {
            $item.label = nodeType.label;
            if (!item.width) {
              $item.width = nodeType.width ?? $item.getMinWidth();
            }
            if (nodeType.args) {
              $item.fields = nodeType.args.map((arg: any) => ({
                label: arg.label,
                value: item.args?.[arg.key] ?? '',
                itemKey: arg.key, // use itemKey, key is reserved
                type: arg.editor,
              }));
            }
            if (nodeType.nodes) {
              $item.outputs = nodeType.nodes;
              nodeType.nodes.forEach((slot: any, i: number) => {
                connector.setOutputPin(String(nodeId), slot.key, 16 + i * 16);
              });
            }
          }
        } else {
          // Entry node (id 0): always has a single 'then' output
          connector.setOutputPin(String(nodeId), 'then', 16);
          $item.fields = [{ key: 'description', value: item.args?.description ?? '' }];
        }

        $item.addEventListener('registernode', this.#registerNode.bind(this));
        $item.addEventListener('registernodeoutput', this.#registerNodeOutput.bind(this));
        $item.addEventListener('select', this.#handleSelect.bind(this));
        $item.addEventListener('change', this.#handleChange.bind(this));
        $item.addEventListener('nodedragstart', this.#handleNodeDragStart.bind(this));
        $item.addEventListener('nodedragmove', this.#handleNodeDragMove.bind(this));
        $item.addEventListener('nodedragend', this.#handleNodeDragEnd.bind(this));
        $item.addEventListener('input', (e: any) => {
          console.log('input', e.detail);
        });
      },
      connect: ($item: any, item) => {
        const nodeId = item.id as number;
        this.#nodeStates.set(nodeId, {
          x: $item.x,
          y: $item.y,
          width: $item.width ?? 12,
          height: $item.height ?? 4,
        });
        connector.setNode(
          String(nodeId),
          $item.x * 16,
          $item.y * 16,
          ($item.width ?? 12) * 16,
          ($item.height ?? 4) * 16
        );
        // Performance: only run once for many items
        if (!this.#connectionsScheduled) {
          this.#connectionsScheduled = true;
          queueMicrotask(() => {
            this.#connectionsScheduled = false;
            this.items.forEach((i: any) => {
              if (!i.nodes || typeof i.nodes !== 'object') return;
              Object.entries(i.nodes as Record<string, number[]>).forEach(([key, targets]) => {
                targets.forEach((targetId: number) => {
                  connector.connect(String(i.id), key, String(targetId), 'in');
                });
              });
            });
            this.#updateScrollExtent();
          });
        }
        if (this.#focusNext) {
          $item.focus();
          this.#focusNext = false;
        }
      },
      disconnect: (_$item: any, item: any) => {
        this.#connector?.removeNode(String(item.id));
      },
    });
  }

  getNodeById(nodeId: number): PgNode {
    return Array.from(this.$items.children).find((x: any) => x.itemId === nodeId) as PgNode;
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
    const nodeId = e.detail.node as number;
    const index = this.#nodePinCounts.get(nodeId) ?? 0;
    this.#nodePinCounts.set(nodeId, index + 1);
  }

  #registerNodeOutput(e: any) {
    const { node, key, offset } = e.detail;
    this.#connector?.setOutputPin(String(node), key, offset);
  }

  #shiftOrCtrl: boolean = false;
  #handleSelect(e: any) {
    const nodeId = e.detail.nodeId as number;
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
    const { type } = e.detail;
    if (type === 'transform') {
      const { x, y, width, height, final } = e.detail;
      if (x === undefined) return;
      const nodeId = (e.target as any).itemId as number;
      const before = this.#nodeStates.get(nodeId) ?? { x, y, width, height };

      if (this.#selected.has(nodeId) && this.#selected.size > 1) {
        const dx = x - before.x;
        const dy = y - before.y;
        const last = this.#undo.at(-1);
        // A final transform is a completed drag: always its own undo entry.
        if (!final && last?.type === 'multi-transform' && last.primaryNodeId === nodeId) {
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
            const tItem = this.items.find((i: any) => i.id === t.nodeId);
            if (tItem) { tItem.x = newAfter.x; tItem.y = newAfter.y; }
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
            const tItem = this.items.find((i: any) => i.id === id);
            if (tItem) { tItem.x = after.x; tItem.y = after.y; }
            return { nodeId: id, before: { ...state }, after };
          });
          this.#undo.push({ type: 'multi-transform', primaryNodeId: nodeId, transforms });
          this.#redo = [];
        }
        const primaryItem = this.items.find((i: any) => i.id === nodeId);
        if (primaryItem) {
          const primaryNode = this.getNodeById(nodeId) as any;
          if (primaryNode) {
            if (width === primaryNode.getMinWidth()) {
              delete primaryItem.width;
            } else {
              primaryItem.width = width;
            }
            if (height === primaryNode.getMinHeight()) {
              delete primaryItem.height;
            } else {
              primaryItem.height = height;
            }
          }
        }
        this.#updateScrollExtent();
        return;
      }

      this.#pushTransform(nodeId, before, { x, y, width, height }, !final);
      this.#updatePins(nodeId);
      this.#updateScrollExtent();
      const item = this.items.find((i: any) => i.id === nodeId);
      if (item) {
        item.x = x;
        item.y = y;
        const node = this.getNodeById(nodeId) as any;
        if (node) {
          if (width === node.getMinWidth()) { delete item.width; } else { item.width = width; }
          if (height === node.getMinHeight()) { delete item.height; } else { item.height = height; }
        }
      }
    } else if (type === 'arg') {
      const { id, key, value } = e.detail;
      const item = this.items.find(x => x.id === id);
      item.args[key] = value;
    }
  }

  // Drag previews: while a node header is dragged the nodes themselves stay
  // put (no pin/path redraws) and light blue rectangles track the snapped
  // drop position. The rectangles live in one container so every move is a
  // single transform update.
  #handleNodeDragStart(e: any) {
    const nodeId = e.detail.nodeId as number;
    // Dragging an unselected node makes it the selection, like clicking it.
    if (!this.#selected.has(nodeId)) {
      this.clearSelection();
      this.#selected.add(nodeId);
      this.getNodeById(nodeId)?.select();
    }
    this.$dragPreview.replaceChildren();
    Array.from(this.$items.children).forEach((child: any) => {
      if (!this.#selected.has(child.itemId)) return;
      const rect = document.createElement('div');
      rect.style.left = `${child.x}rem`;
      rect.style.top = `${child.y}rem`;
      rect.style.width = `${child.width ?? 12}rem`;
      rect.style.height = `${child.height ?? 3}rem`;
      this.$dragPreview.appendChild(rect);
    });
    this.$dragPreview.style.transform = 'translate(0, 0)';
    this.$dragPreview.classList.add('active');
  }

  #handleNodeDragMove(e: any) {
    const { dx, dy } = e.detail;
    this.$dragPreview.style.transform = `translate(${dx}rem, ${dy}rem)`;
  }

  #handleNodeDragEnd() {
    this.$dragPreview.classList.remove('active');
    this.$dragPreview.replaceChildren();
  }

  // Moves all selected nodes by a grid delta in one pass, recording a single
  // undo entry and batching the connector updates.
  #moveSelectedBy(dx: number, dy: number) {
    const byId = new Map<number, any>();
    Array.from(this.$items.children).forEach((child: any) => byId.set(child.itemId, child));

    const transforms = Array.from(this.#selected).map((id) => {
      const node = byId.get(id);
      const before = this.#nodeStates.get(id) ?? { x: node.x, y: node.y, width: node.width ?? 12, height: node.height ?? 3 };
      const after: NodeState = { x: before.x + dx, y: before.y + dy, width: before.width, height: before.height };
      node.x = after.x;
      node.y = after.y;
      this.#nodeStates.set(id, after);
      this.#schedulePinUpdate(id);
      const item = this.items.find((i: any) => i.id === id);
      if (item) { item.x = after.x; item.y = after.y; }
      return { nodeId: id, before, after };
    });

    if (transforms.length === 1) {
      const { nodeId, before, after } = transforms[0];
      this.#pushTransform(nodeId, before, after);
      return;
    }

    // Merge held arrow keys on the same selection into one undo entry.
    const last = this.#undo.at(-1);
    const afterById = new Map(transforms.map((t) => [t.nodeId, t.after]));
    if (last?.type === 'multi-transform'
      && last.transforms.length === transforms.length
      && last.transforms.every((t) => afterById.has(t.nodeId))) {
      last.transforms.forEach((t) => { t.after = afterById.get(t.nodeId)!; });
    } else {
      this.#undo.push({ type: 'multi-transform', primaryNodeId: transforms[0].nodeId, transforms });
    }
    this.#redo = [];
  }

  // Every connector.setNode triggers a full path redraw, so coalesce updates
  // from key repeats into at most one batch per animation frame.
  #pinUpdateIds = new Set<number>();
  #pinUpdateScheduled = false;
  #schedulePinUpdate(nodeId: number) {
    this.#pinUpdateIds.add(nodeId);
    if (this.#pinUpdateScheduled) return;
    this.#pinUpdateScheduled = true;
    requestAnimationFrame(() => {
      this.#pinUpdateScheduled = false;
      const ids = Array.from(this.#pinUpdateIds);
      this.#pinUpdateIds.clear();
      ids.forEach((id) => this.#updatePins(id));
    });
  }

  #copySelected() {
    if (this.#selected.size === 0) return;
    this.#clipboard = Array.from(this.#selected).map((id) => {
      const item = this.items.find((x: any) => x.id === id);
      const state = this.#nodeStates.get(id) ?? { x: item.x, y: item.y, width: item.width ?? 12, height: item.height ?? 4 };
      return { item: JSON.parse(JSON.stringify(item)), state: { ...state } };
    });
  }

  #pasteClipboard() {
    if (!this.#clipboard || this.#clipboard.length === 0) return;

    const copiedIds = new Set(this.#clipboard.map(({ item }) => item.id));
    const idMap = new Map<number, number>();
    this.#clipboard.forEach(({ item }) => {
      idMap.set(item.id, this.#nextNodeId++);
    });

    this.clearSelection();

    const newItems = this.#clipboard.map(({ item, state }) => {
      const newId = idMap.get(item.id)!;
      const newNodes: Record<string, number[]> = {};
      if (item.nodes && typeof item.nodes === 'object') {
        Object.entries(item.nodes as Record<string, number[]>).forEach(([key, targets]) => {
          const remapped = (targets as number[])
            .filter((t) => copiedIds.has(t))
            .map((t) => idMap.get(t)!);
          if (remapped.length > 0) newNodes[key] = remapped;
        });
      }
      return { ...JSON.parse(JSON.stringify(item)), id: newId, x: state.x + 2, y: state.y + 2, nodes: newNodes };
    });

    newItems.forEach((item) => this.items.push(item));

    newItems.forEach((item) => {
      this.#selected.add(item.id);
      const node = this.getNodeById(item.id);
      if (node) (node as any).select();
    });
  }

  // Merges consecutive transforms on the same node (resize snaps, held arrow
  // keys); pass merge = false to keep a completed drag as its own undo entry.
  #pushTransform(nodeId: number, before: NodeState, after: NodeState, merge: boolean = true) {
    const last = this.#undo.at(-1);
    if (merge && last?.type === 'transform' && last.nodeId === nodeId) {
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
          this.#nodeStates.set(item.item.id, {
            x: item.item.x,
            y: item.item.y,
            width: item.item.width ?? 12,
            height: item.item.height ?? 4,
          });
        } else {
          this.#deleteNode(item.item.id);
        }
        break;
      }
    }
    this.#updateScrollExtent();
  }

  #deleteNode(nodeId: number) {
    const index = this.items.findIndex((x: any) => x.id === nodeId);
    if (index > 0) {
      this.items.splice(index, 1);
      this.#nodeStates.delete(nodeId);
      this.#updateScrollExtent();
    }
  }

  #deleteNodeWithUndo(nodeId: number) {
    const index = this.items.findIndex((x: any) => x.id === nodeId);
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

  #updatePins(nodeId: number) {
    const node = this.getNodeById(nodeId);
    if (!node) return;
    const { x, y, width, height } = node;
    this.#connector?.setNode(
      String(nodeId),
      x * this.gridSize,
      y * this.gridSize,
      (width ?? 12) * this.gridSize,
      (height ?? 3) * this.gridSize
    );
  }

  #updateScrollExtent() {
    let maxX = 0;
    let maxY = 0;
    Array.from(this.$items.children).forEach((child: any) => {
      maxX = Math.max(maxX, child.x + (child.width ?? 12));
      maxY = Math.max(maxY, child.y + (child.height ?? 3));
    });
    this.$grid.style.setProperty('--pg-nodes-max-x', `${maxX + 40}rem`);
    this.$grid.style.setProperty('--pg-nodes-max-y', `${maxY + 40}rem`);
  }

  debug(nodeId: number = 0) {
    this.$grid.classList.toggle('debug', true);
    this.#debug.forEach(id => {
      const n = this.getNodeById(id);
      if (n) n.debug = false;
    });
    this.#debug = [nodeId];
    this.#debugPrevious = nodeId;
    const n = this.getNodeById(nodeId);
    if (n) n.debug = true;
  }

  async debugNext() {
    if (this.#debug.length === 0) return;
    const currentId = this.#debug.shift()!;
    const n = this.getNodeById(currentId);
    if (n) n.debug = false;

    const item = this.items.find((x: any) => x.id === currentId);
    if (!item) return;

    let nextIds: number[] = [];
    if (!item.node) {
      nextIds = item.nodes?.then ?? [];
    } else {
      const nodeType = this.nodes.find((x: any) => x.name === item.node);
      if (nodeType?.handler) {
        const params: any = { state: this.#state };
        if (item.args) {
          Object.keys(item.args).forEach((key) => {
            if (typeof item.args[key] === 'string') {
              let fn = new Function('state', `return \`${item.args[key]}\`;`);
              params[key] = fn(this.#state);
            } else {
              params[key] = item.args[key];
            }
          });
        }
        if (item.nodes) {
          // get the type to know known keys
          nodeType.nodes.forEach(({ key }) => {
            params[key] = item.nodes[key] ?? [];
          });
        }
        params.node = this.#debugPrevious;
        const result = await nodeType.handler(params);
        nextIds = Array.isArray(result) ? result : [result];
        this.#debugPrevious = currentId;
        this.dispatchEvent(new CustomEvent('debug', {
          detail: {
            state: this.#state,
          },
        }));
      }
    }
    this.#debug.unshift(...nextIds);
    const nextId = this.#debug.length ? this.#debug[0] : null;
    if (nextId) {
      const next = this.getNodeById(nextId);
      if (next) next.debug = true;
    }
  }

  async play() {
    while (this.#debug.length > 0) {
      await this.debugNext();
    }
  }

  restart() {
    this.#state.clear();
    this.debug();
  }

  #state = new Map<string, string>();
  get state() {
    return this.#state;
  }

  get json() {
    const normalize = JSON.parse(JSON.stringify(this.items));
    return JSON.stringify(
      normalize.map(x => { delete x.editors; return x; })
    );
  }
  set json(value: string) {
    this.items = JSON.parse(value);
    let nextNodeId = 0;
    this.items.forEach((item) => {
      nextNodeId = Math.max(nextNodeId, item.id);
    });
    this.#nextNodeId = nextNodeId + 1;
  }

  reset() {
    this.#connector?.reset();
  }
}
