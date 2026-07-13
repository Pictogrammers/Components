import { Component, Prop, Part, forEach } from '@pictogrammers/element';
import { NodeConnector } from '@pictogrammers/node-connector';

import PgNode from '../node/node';
import PgNodeEntry from '../nodeEntry/nodeEntry';
import PgOverlayContextMenu from '../overlayContextMenu/overlayContextMenu';
import PgMenuItem from '../menuItem/menuItem';

import template from './nodes.html';
import style from './nodes.css';
import PgMenuDivider from '../menuDivider/menuDivider';

type NodeState = { x: number; y: number; width: number; height: number };
type UndoTransform = { type: 'transform'; nodeId: number; before: NodeState; after: NodeState };
type UndoMultiTransform = { type: 'multi-transform'; transforms: Array<{ nodeId: number; before: NodeState; after: NodeState }> };
// incoming = connections from surviving nodes into a deleted node; recorded so
// undo can restore them (the connector strips them from the model on removal).
type DeleteEntry = { item: any; index: number; incoming: Array<{ id: number; key: string; index: number }> };
type UndoDelete = { type: 'delete'; entries: DeleteEntry[] };
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
  @Part() $selectMode: HTMLDivElement;

  #nextNodeId: number = 0;
  #focusNext: boolean = false;
  #connector: NodeConnector | null = null;
  #connectionsScheduled: boolean = false;
  #selected = new Set<number>();
  #debug: number[] = [];
  #debugPrevious: number = 0;

  #undo: UndoItem[] = [];
  #redo: UndoItem[] = [];
  #nodeStates = new Map<number, NodeState>();

  #clipboard: Array<{ item: any; state: NodeState }> | null = null;
  #pasteCount: number = 0;

  #dragOrigin: { x: number; y: number } | null = null;
  #isDragging: boolean = false;
  #wasSelectionDrag: boolean = false;
  #nodeDragging: boolean = false;

  // Node selection mode (Link editor): non-null while the overlay is up.
  #selectionCallback: ((nodeId: number) => void) | null = null;

  // connectedCallback runs again if the element is reparented; listeners on
  // document must follow the connected state while everything else (connector,
  // shadow DOM listeners, forEach) must only ever be set up once.
  #initialized: boolean = false;
  #keydownListener = (e: KeyboardEvent) => this.#handleKeyDown(e);

  connectedCallback() {
    document.addEventListener('keydown', this.#keydownListener);
    if (this.#initialized) return;
    this.#initialized = true;

    const connector = new NodeConnector(this.$svg);
    connector.bridgeColor = '#0a0c14';
    this.#connector = connector;

    connector.on('create', this.#handleConnectorCreate.bind(this));
    connector.on('change', (change) => {
      const sourceNodeId = parseInt(change.sourceNodeId, 10);
      const targetNodeId = parseInt(change.targetNodeId, 10);
      const currentItem = this.items.find((x: any) => x.id === sourceNodeId);
      if (!currentItem) return;
      if (change.type === 'connect') {
        const nodes = currentItem.nodes ?? (currentItem.nodes = {});
        const targets = Array.isArray(nodes[change.sourceKey])
          ? nodes[change.sourceKey]
          : (nodes[change.sourceKey] = []);
        if (!targets.includes(targetNodeId)) {
          targets.push(targetNodeId);
        }
      } else if (change.type === 'disconnect') {
        const targets = currentItem.nodes?.[change.sourceKey];
        if (!Array.isArray(targets)) return;
        const index = targets.indexOf(targetNodeId);
        // Check if the item actually exists in the array (-1 means not found)
        if (index > -1) {
          targets.splice(index, 1);
        }
      }
    });

    this.$grid.addEventListener('click', (e: any) => {
      if (this.#selectionCallback) return;
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
      // Node selection mode is modal; no marquee while it is up.
      if (this.#selectionCallback) return;
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
        document.removeEventListener('pointercancel', onCancel);
        document.removeEventListener('keydown', onKeyDown);
        this.$grid.classList.remove('selecting');
        this.$selection.classList.remove('active');
        this.#dragOrigin = null;
        this.#isDragging = false;
      };

      const onCancel = () => {
        if (this.#isDragging) this.#suppressNextGridClick();
        cancelDrag();
      };

      const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') onCancel();
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
        document.removeEventListener('pointercancel', onCancel);
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
        this.#suppressNextGridClick();

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
      document.addEventListener('pointercancel', onCancel);
      document.addEventListener('keydown', onKeyDown);
    });

    this.$grid.addEventListener('contextmenu', async (e: MouseEvent) => {
      e.preventDefault();
      // Node selection mode is modal; no context menus while it is up.
      if (this.#selectionCallback) return;
      const ele = e.target as HTMLDivElement;
      if (ele.part?.contains('grid')) {
        const rect = this.$grid.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left + this.$grid.scrollLeft) / this.gridSize);
        const y = Math.floor((e.clientY - rect.top + this.$grid.scrollTop) / this.gridSize);
        const nodeMenuItems = this.#nodeTypeMenuItems();
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
        this.#createNode(result.value, x, y);
      } else {
        // Right-clicks land on connector paths and pin circles too; only
        // elements created by the forEach carry an itemId.
        const nodeId = (ele as any).itemId;
        if (typeof nodeId !== 'number') return;
        const item = this.items.find((i: any) => i.id === nodeId);
        // The entry node cannot be copied or deleted.
        if (item && !item.node) return;
        if (!this.#selected.has(nodeId)) {
          this.clearSelection();
          this.getNodeById(nodeId)?.select();
          this.#selected.add(nodeId);
        }
        const result = await PgOverlayContextMenu.open({
          source: this.$items,
          x: e.clientX,
          y: e.clientY,
          items: [
            { label: 'Copy', value: 'copyNode', type: PgMenuItem },
            { type: PgMenuDivider },
            { label: 'Enable Breakpoint', value: 'breakpoint', type: PgMenuItem },
            { type: PgMenuDivider },
            { label: 'Delete Node', value: 'deleteNode', type: PgMenuItem },
          ],
        });
        if (result?.value === 'copyNode') {
          this.#copySelected();
        } else if (result?.value === 'deleteNode') {
          const toDelete = Array.from(this.#selected);
          this.clearSelection();
          this.#deleteNodesWithUndo(toDelete);
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
        connector.setNode(
          String(nodeId),
          item.x * this.gridSize,
          item.y * this.gridSize,
          (item.width ?? 12) * this.gridSize,
          (item.height ?? 4) * this.gridSize
        );

        if (item.node) {
          // Regular node: set input pin and look up output slots from type registry
          connector.setInputPin(String(nodeId), 'in', this.gridSize);
          const nodeType = this.nodes.find((n: any) => n.name === item.node);
          if (nodeType) {
            $item.label = nodeType.label;
            $item.minWidth = nodeType.width ?? 6;
            if (!item.width) {
              $item.width = $item.getMinWidth();
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
                connector.setOutputPin(String(nodeId), slot.key, this.gridSize + i * this.gridSize);
              });
            }
          }
        } else {
          // Entry node (id 0): always has a single 'then' output
          connector.setOutputPin(String(nodeId), 'then', this.gridSize);
          $item.fields = [{ key: 'description', value: item.args?.description ?? '' }];
        }

        $item.addEventListener('registernodeoutput', this.#registerNodeOutput.bind(this));
        $item.addEventListener('nodepulse', this.#handleNodePulse.bind(this));
        $item.addEventListener('nodeselection', this.#handleNodeSelection.bind(this));
        $item.addEventListener('select', this.#handleSelect.bind(this));
        $item.addEventListener('change', this.#handleChange.bind(this));
        $item.addEventListener('nodedragstart', this.#handleNodeDragStart.bind(this));
        $item.addEventListener('nodedragmove', this.#handleNodeDragMove.bind(this));
        $item.addEventListener('nodedragend', this.#handleNodeDragEnd.bind(this));
        $item.addEventListener('input', (e: any) => {
          // Re-dispatch editor input events (they don't compose past this
          // shadow root); native composed input events already reach the host.
          if (e.detail) {
            this.dispatchEvent(new CustomEvent('input', { detail: e.detail }));
          }
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
          $item.x * this.gridSize,
          $item.y * this.gridSize,
          ($item.width ?? 12) * this.gridSize,
          ($item.height ?? 4) * this.gridSize
        );
        // Performance: only run once for many items
        if (!this.#connectionsScheduled) {
          this.#connectionsScheduled = true;
          queueMicrotask(() => {
            this.#connectionsScheduled = false;
            this.items.forEach((i: any) => {
              if (!i.nodes || typeof i.nodes !== 'object') return;
              Object.entries(i.nodes as Record<string, number[]>).forEach(([key, targets]) => {
                if (!Array.isArray(targets)) return;
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
        // Items can also disappear through array reassignment (e.g. the json
        // setter or items.filter), so interaction state is pruned here.
        this.#nodeStates.delete(item.id);
        this.#selected.delete(item.id);
        this.#pinUpdateIds.delete(item.id);
      },
    });
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.#keydownListener);
  }

  getNodeById(nodeId: number): PgNode {
    return Array.from(this.$items.children).find((x: any) => x.itemId === nodeId) as PgNode;
  }

  clearSelection() {
    this.#selected.forEach((value) => {
      this.getNodeById(value)?.deselect();
    });
    this.#selected.clear();
  }

  render(_changes: any) {}

  #handleKeyDown(e: KeyboardEvent) {
    // Node selection mode is modal: Escape cancels it and every other
    // canvas shortcut is inert until it closes.
    if (this.#selectionCallback) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.#exitSelectionMode();
      }
      return;
    }

    // Never hijack keys while the user is typing in a field (the editors live
    // in nested shadow roots, so composedPath is needed to see the real target).
    const target = e.composedPath()[0];
    if (target instanceof HTMLElement
      && (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName))) {
      return;
    }

    const key = e.key.toLowerCase();
    const mod = e.ctrlKey || e.metaKey;

    if (mod && key === 'z') {
      e.preventDefault();
      e.shiftKey ? this.#applyRedo() : this.#applyUndo();
      return;
    }

    if (mod && key === 'y') {
      e.preventDefault();
      this.#applyRedo();
      return;
    }

    if (mod && key === 'c') {
      // Without a node selection let the browser copy whatever is selected.
      if (this.#selected.size === 0) return;
      e.preventDefault();
      this.#copySelected();
      return;
    }

    if (mod && key === 'v') {
      if (!this.#clipboard || this.#clipboard.length === 0) return;
      e.preventDefault();
      this.#pasteClipboard();
      return;
    }

    if (this.#selected.size === 0) return;

    if (e.key === 'Delete') {
      const toDelete = Array.from(this.#selected);
      this.clearSelection();
      this.#deleteNodesWithUndo(toDelete);
      return;
    }
    if (e.key === 'Escape') {
      // Active drags handle Escape themselves (cancel); keep the selection.
      if (this.#nodeDragging || this.#dragOrigin) return;
      this.clearSelection();
      return;
    }

    if (mod || e.altKey) return;
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
  }

  // Swallow only the click generated by this pointerup; if none follows
  // (pointer released off-grid) the flag must not eat a later real click.
  #suppressNextGridClick() {
    this.#wasSelectionDrag = true;
    setTimeout(() => { this.#wasSelectionDrag = false; }, 0);
  }

  #nodeTypeMenuItems(): any[] {
    return this.nodes.map((nodeType: any) => {
      return { label: nodeType.label, value: nodeType.name, type: PgMenuItem };
    });
  }

  #createNode(name: string, x: number, y: number): any | null {
    const nodeType = this.nodes.find((n: any) => n.name === name);
    if (!nodeType) return null;
    const args: any = {};
    (nodeType.args ?? []).forEach(({ key, value }: any) => {
      args[key] = value;
    });
    const item = {
      id: this.#nextNodeId,
      node: name,
      x: Math.max(x, 0),
      y: Math.max(y, 0),
      ...(nodeType.width !== undefined && { width: nodeType.width }),
      ...(nodeType.height !== undefined && { height: nodeType.height }),
      args,
      nodes: {},
    };
    this.#focusNext = true;
    this.items.push(item);
    return item;
  }

  // Dragging from an output pin into empty space offers to create the target
  // node there and connects it to the dragged pin.
  async #handleConnectorCreate(event: any) {
    const { x, y, sourceY, sourceNodeId, sourceKey } = event;
    const sourceId = parseInt(sourceNodeId, 10);
    const $source = this.getNodeById(sourceId) as any;
    if (!$source) return;
    // The event carries cursor offsets from the source pin in SVG space.
    const px = ($source.x + ($source.width ?? 12)) * this.gridSize + x;
    const py = $source.y * this.gridSize + sourceY + y;
    const rect = this.$grid.getBoundingClientRect();
    const result = await PgOverlayContextMenu.open({
      source: this.$items,
      x: rect.left + px - this.$grid.scrollLeft,
      y: rect.top + py - this.$grid.scrollTop,
      items: this.#nodeTypeMenuItems(),
      filter: true,
    });
    if (!result) return;
    // Offset one cell up so the new node's input pin lines up with the cursor.
    const item = this.#createNode(
      result.value,
      Math.round(px / this.gridSize),
      Math.round(py / this.gridSize) - 1
    );
    if (!item) return;
    const source = this.items.find((i: any) => i.id === sourceId);
    if (!source) return; // source deleted while the menu was open
    const nodes = source.nodes ?? (source.nodes = {});
    const targets = Array.isArray(nodes[sourceKey])
      ? nodes[sourceKey]
      : (nodes[sourceKey] = []);
    if (!targets.includes(item.id)) {
      targets.push(item.id);
    }
    // The reconnect pass scheduled by the new node's connect callback draws it.
  }

  #registerNodeOutput(e: any) {
    const { node, key, offset } = e.detail;
    this.#connector?.setOutputPin(String(node), key, offset);
  }

  #handleNodePulse(e: any) {
    const id = Number(e.detail.id);
    const node = this.getNodeById(id) as any;
    if (!node) {
      throw new Error(`<pg-nodes> nodepulse: node ${e.detail.id} does not exist.`);
    }
    node.pulse();
  }

  #handleNodeSelection(e: any) {
    const { value, callback } = e.detail;
    if (typeof callback !== 'function') return;
    this.#enterSelectionMode(Number(value), callback);
  }

  // Modal node picker for the Link editor: clickable rectangles cover every
  // node while the nodes themselves ignore the pointer; Escape cancels.
  #enterSelectionMode(currentId: number, callback: (nodeId: number) => void) {
    this.#exitSelectionMode();
    this.#selectionCallback = callback;
    this.$grid.classList.add('selectMode');
    this.$selectMode.replaceChildren();
    Array.from(this.$items.children).forEach((child: any) => {
      const $button = document.createElement('button');
      $button.type = 'button';
      $button.style.left = `${child.x}rem`;
      $button.style.top = `${child.y}rem`;
      $button.style.width = `${child.width ?? 12}rem`;
      $button.style.height = `${child.height ?? 3}rem`;
      if (child.itemId === currentId) {
        $button.classList.add('current');
      }
      $button.addEventListener('click', () => {
        const selected = this.#selectionCallback;
        this.#exitSelectionMode();
        selected?.(child.itemId);
      });
      this.$selectMode.appendChild($button);
    });
    this.$selectMode.classList.add('active');
  }

  #exitSelectionMode() {
    if (!this.#selectionCallback) return;
    this.#selectionCallback = null;
    this.$selectMode.classList.remove('active');
    this.$selectMode.replaceChildren();
    this.$grid.classList.remove('selectMode');
  }

  #handleSelect(e: any) {
    const nodeId = e.detail.nodeId as number;
    if (e.detail.addToSelection) {
      // Shift/Ctrl click toggles membership without touching the rest.
      if (this.#selected.has(nodeId)) {
        this.#selected.delete(nodeId);
        (e.target as any).deselect();
      } else {
        this.#selected.add(nodeId);
        e.target.select();
      }
      return;
    }
    this.#selected.forEach((value) => {
      if (value !== nodeId) {
        this.getNodeById(value)?.deselect();
      }
    });
    this.#selected.clear();
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

      // A change that keeps the size is a move; moving one node of a
      // multi-selection moves the whole group. Resizes always apply to the
      // changed node alone.
      const isMove = width === before.width && height === before.height;
      if (isMove && this.#selected.has(nodeId) && this.#selected.size > 1) {
        const ids = Array.from(this.#selected);
        const states = new Map<number, NodeState>(ids.map((id) => [
          id,
          this.#nodeStates.get(id) ?? { x: 0, y: 0, width: 12, height: 4 },
        ]));
        let dx = x - before.x;
        let dy = y - before.y;
        // Clamp the group delta so no node ends up off-canvas (unreachable).
        states.forEach((state) => {
          dx = Math.max(dx, -state.x);
          dy = Math.max(dy, -state.y);
        });
        const transforms = ids.map((id) => {
          const state = states.get(id)!;
          const after: NodeState = { x: state.x + dx, y: state.y + dy, width: state.width, height: state.height };
          const $node = this.getNodeById(id) as any;
          if ($node) { $node.x = after.x; $node.y = after.y; }
          this.#nodeStates.set(id, after);
          this.#updatePins(id);
          const tItem = this.items.find((i: any) => i.id === id);
          if (tItem) { tItem.x = after.x; tItem.y = after.y; }
          return { nodeId: id, before: { ...state }, after };
        });
        if (dx !== 0 || dy !== 0) {
          this.#undo.push({ type: 'multi-transform', transforms });
          this.#redo = [];
        }
        this.#updateScrollExtent();
        this.dispatchEvent(new CustomEvent('change', { detail: { ...e.detail, id: nodeId } }));
        return;
      }

      const node = this.getNodeById(nodeId) as any;
      // Clamp to the canvas. A clamped resize (no `final`) keeps the far edge
      // in place by giving back the overshoot; a clamped move keeps its size.
      let cx = x;
      let cy = y;
      let cw = width;
      let ch = height;
      if (cx < 0) {
        if (!final && node) cw = Math.max(cw + cx, node.getMinWidth());
        cx = 0;
      }
      if (cy < 0) {
        if (!final && node) ch = Math.max(ch + cy, node.getMinHeight());
        cy = 0;
      }
      if (node && (cx !== x || cy !== y || cw !== width || ch !== height)) {
        node.x = cx;
        node.y = cy;
        node.width = cw;
        node.height = ch;
      }

      this.#pushTransform(nodeId, before, { x: cx, y: cy, width: cw, height: ch }, !final);
      this.#updatePins(nodeId);
      this.#updateScrollExtent();
      const item = this.items.find((i: any) => i.id === nodeId);
      if (item) {
        item.x = cx;
        item.y = cy;
        // Sizes matching the type default (minWidth) / content height stay
        // implicit so nodes follow the registry on reload.
        if (node) {
          if (cw === node.getMinWidth()) { delete item.width; } else { item.width = cw; }
          if (ch === node.getMinHeight()) { delete item.height; } else { item.height = ch; }
        } else {
          item.width = cw;
          item.height = ch;
        }
      }
      this.dispatchEvent(new CustomEvent('change', {
        detail: { ...e.detail, id: nodeId, x: cx, y: cy, width: cw, height: ch },
      }));
    } else if (type === 'arg') {
      const { id, key, value } = e.detail;
      const item = this.items.find((x: any) => x.id === id);
      if (!item) return;
      const args = item.args ?? (item.args = {});
      args[key] = value;
      // Editors can change the node's height on value changes (TextArray
      // rows); pg-node reflows before dispatching, so sync the cached state
      // and the connector's box to the element here.
      const node = this.getNodeById(id) as any;
      if (node) {
        const state = this.#nodeStates.get(id);
        if (state && (state.width !== node.width || state.height !== node.height)) {
          this.#nodeStates.set(id, { ...state, width: node.width, height: node.height });
          this.#updatePins(id);
          this.#updateScrollExtent();
        }
      }
      this.dispatchEvent(new CustomEvent('change', { detail: e.detail }));
    }
  }

  // Drag previews: while a node header is dragged the nodes themselves stay
  // put (no pin/path redraws) and light blue rectangles track the snapped
  // drop position. The rectangles live in one container so every move is a
  // single transform update.
  #handleNodeDragStart(e: any) {
    const nodeId = e.detail.nodeId as number;
    this.#nodeDragging = true;
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
    this.#nodeDragging = false;
    this.$dragPreview.classList.remove('active');
    this.$dragPreview.replaceChildren();
  }

  // Moves all selected nodes by a grid delta in one pass, recording a single
  // undo entry and batching the connector updates.
  #moveSelectedBy(dx: number, dy: number) {
    const byId = new Map<number, any>();
    Array.from(this.$items.children).forEach((child: any) => byId.set(child.itemId, child));

    // Prune ids whose nodes no longer exist before touching anything.
    Array.from(this.#selected).forEach((id) => {
      if (!byId.has(id)) this.#selected.delete(id);
    });
    const ids = Array.from(this.#selected);
    if (ids.length === 0) return;

    const befores = new Map<number, NodeState>(ids.map((id) => {
      const node = byId.get(id);
      return [id, this.#nodeStates.get(id) ?? { x: node.x, y: node.y, width: node.width ?? 12, height: node.height ?? 4 }];
    }));
    // Clamp the group delta so no node ends up off-canvas (unreachable).
    befores.forEach((before) => {
      dx = Math.max(dx, -before.x);
      dy = Math.max(dy, -before.y);
    });
    if (dx === 0 && dy === 0) return;

    const transforms = ids.map((id) => {
      const node = byId.get(id);
      const before = befores.get(id)!;
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
    } else {
      // Merge held arrow keys on the same selection into one undo entry.
      const last = this.#undo.at(-1);
      const afterById = new Map(transforms.map((t) => [t.nodeId, t.after]));
      if (last?.type === 'multi-transform'
        && last.transforms.length === transforms.length
        && last.transforms.every((t) => afterById.has(t.nodeId))) {
        last.transforms.forEach((t) => { t.after = afterById.get(t.nodeId)!; });
      } else {
        this.#undo.push({ type: 'multi-transform', transforms });
      }
      this.#redo = [];
    }
    this.#updateScrollExtent();
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
    // The entry node is excluded: a script has exactly one entry point.
    const entries = Array.from(this.#selected)
      .map((id) => this.items.find((x: any) => x.id === id))
      .filter((item: any) => item && item.node)
      .map((item: any) => {
        const state = this.#nodeStates.get(item.id)
          ?? { x: item.x, y: item.y, width: item.width ?? 12, height: item.height ?? 4 };
        const { editors, ...rest } = item;
        return { item: JSON.parse(JSON.stringify(rest)), state: { ...state } };
      });
    if (entries.length === 0) return;
    this.#clipboard = entries;
    this.#pasteCount = 0;
  }

  #pasteClipboard() {
    if (!this.#clipboard || this.#clipboard.length === 0) return;

    const copiedIds = new Set(this.#clipboard.map(({ item }) => item.id));
    const idMap = new Map<number, number>();
    this.#clipboard.forEach(({ item }) => {
      idMap.set(item.id, this.#nextNodeId++);
    });

    this.clearSelection();

    // Cascade repeated pastes of the same clipboard instead of stacking them.
    this.#pasteCount += 1;
    const offset = 2 * this.#pasteCount;

    const newItems = this.#clipboard.map(({ item, state }) => {
      const newId = idMap.get(item.id)!;
      const newNodes: Record<string, number[]> = {};
      if (item.nodes && typeof item.nodes === 'object') {
        Object.entries(item.nodes as Record<string, number[]>).forEach(([key, targets]) => {
          if (!Array.isArray(targets)) return;
          const remapped = (targets as number[])
            .filter((t) => copiedIds.has(t))
            .map((t) => idMap.get(t)!);
          if (remapped.length > 0) newNodes[key] = remapped;
        });
      }
      return { ...JSON.parse(JSON.stringify(item)), id: newId, x: state.x + offset, y: state.y + offset, nodes: newNodes };
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
        this.#applyNodeState(item.nodeId, direction === 'undo' ? item.before : item.after);
        break;
      }
      case 'multi-transform': {
        for (const t of item.transforms) {
          this.#applyNodeState(t.nodeId, direction === 'undo' ? t.before : t.after);
        }
        break;
      }
      case 'delete': {
        if (direction === 'undo') {
          // Restore in reverse deletion order so the recorded indexes hold.
          for (let i = item.entries.length - 1; i >= 0; i--) {
            const entry = item.entries[i];
            this.items.splice(entry.index, 0, entry.item);
            this.#nodeStates.set(entry.item.id, {
              x: entry.item.x,
              y: entry.item.y,
              width: entry.item.width ?? 12,
              height: entry.item.height ?? 4,
            });
          }
          // With every node back, restore the connections that pointed at them.
          item.entries.forEach((entry) => {
            entry.incoming.forEach(({ id, key, index }) => {
              const source = this.items.find((x: any) => x.id === id);
              if (!source) return;
              const nodes = source.nodes ?? (source.nodes = {});
              const targets = Array.isArray(nodes[key]) ? nodes[key] : (nodes[key] = []);
              if (!targets.includes(entry.item.id)) {
                targets.splice(Math.min(index, targets.length), 0, entry.item.id);
              }
            });
          });
        } else {
          item.entries.forEach((entry) => this.#deleteNode(entry.item.id));
        }
        break;
      }
    }
    this.#updateScrollExtent();
  }

  // Applies a recorded state to the element, the connector, and the data
  // model; the items array must stay in sync or saving after undo would
  // persist stale geometry.
  #applyNodeState(nodeId: number, state: NodeState) {
    const node = this.getNodeById(nodeId) as any;
    const item = this.items.find((i: any) => i.id === nodeId);
    if (!node && !item) return;
    if (node) {
      node.x = state.x;
      node.y = state.y;
      node.width = state.width;
      node.height = state.height;
    }
    if (item) {
      item.x = state.x;
      item.y = state.y;
      item.width = state.width;
      item.height = state.height;
    }
    this.#nodeStates.set(nodeId, state);
    this.#updatePins(nodeId);
  }

  #deleteNode(nodeId: number) {
    const index = this.items.findIndex((x: any) => x.id === nodeId);
    // Index 0 is the entry node, which cannot be deleted.
    if (index > 0) {
      this.items.splice(index, 1);
      this.#nodeStates.delete(nodeId);
      this.#updateScrollExtent();
    }
  }

  // Connections from surviving nodes into nodeId; recorded before deletion so
  // undo can put them back after the connector strips them from the model.
  #collectIncoming(nodeId: number): Array<{ id: number; key: string; index: number }> {
    const incoming: Array<{ id: number; key: string; index: number }> = [];
    this.items.forEach((item: any) => {
      if (item.id === nodeId || !item.nodes || typeof item.nodes !== 'object') return;
      Object.entries(item.nodes as Record<string, number[]>).forEach(([key, targets]) => {
        if (!Array.isArray(targets)) return;
        const index = targets.indexOf(nodeId);
        if (index > -1) incoming.push({ id: item.id, key, index });
      });
    });
    return incoming;
  }

  // Deletes the given nodes as one undoable operation.
  #deleteNodesWithUndo(nodeIds: number[]) {
    const entries: DeleteEntry[] = [];
    nodeIds.forEach((nodeId) => {
      const index = this.items.findIndex((x: any) => x.id === nodeId);
      if (index <= 0) return;
      const node = this.getNodeById(nodeId) as any;
      const item = {
        ...this.items[index],
        ...(node ? { x: node.x, y: node.y, width: node.width, height: node.height } : {}),
      };
      const incoming = this.#collectIncoming(nodeId);
      this.#deleteNode(nodeId);
      entries.push({ item, index, incoming });
    });
    if (entries.length === 0) return;
    this.#undo.push({ type: 'delete', entries });
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
      const thenTargets = item.nodes?.then;
      nextIds = Array.isArray(thenTargets)
        ? thenTargets.filter((id: any) => typeof id === 'number')
        : [];
    } else {
      const nodeType = this.nodes.find((x: any) => x.name === item.node);
      if (nodeType?.handler) {
        const params: any = { state: this.#state };
        // Globals ([key, value] pairs) are exposed to handlers; the node's
        // own args and slots take precedence over a colliding name.
        this.globals.forEach((entry: any) => {
          if (Array.isArray(entry)) {
            params[entry[0]] = entry[1];
          }
        });
        if (item.args) {
          Object.keys(item.args).forEach((key) => {
            if (typeof item.args[key] === 'string') {
              // String args are template literals; a malformed one (stray
              // backtick / ${) must not abort the run.
              try {
                let fn = new Function('state', `return \`${item.args[key]}\`;`);
                params[key] = fn(this.#state);
              } catch (error) {
                params[key] = item.args[key];
              }
            } else {
              params[key] = item.args[key];
            }
          });
        }
        if (item.nodes) {
          // get the type to know known keys
          (nodeType.nodes ?? []).forEach(({ key }: any) => {
            params[key] = item.nodes[key] ?? [];
          });
        }
        params.nodeId = item.id;
        params.node = this.#debugPrevious;
        let result;
        try {
          result = await nodeType.handler(params);
        } catch (error) {
          // Handlers throw to signal invalid scripts; surface it and stop.
          this.#debug = [];
          this.dispatchEvent(new CustomEvent('error', {
            detail: { nodeId: currentId, error },
          }));
          return;
        }
        nextIds = (Array.isArray(result) ? result : [result])
          .filter((id: any) => typeof id === 'number');
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

  #playing = false;
  async play() {
    if (this.#playing) return;
    this.#playing = true;
    let steps = 0;
    try {
      while (this.#debug.length > 0) {
        if (++steps > 10000) {
          this.dispatchEvent(new CustomEvent('error', {
            detail: { error: new Error('play() stopped after 10000 steps (cyclic script?)') },
          }));
          break;
        }
        await this.debugNext();
      }
    } finally {
      this.#playing = false;
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
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      throw new TypeError('<pg-nodes> json must be a JSON array of node items.');
    }
    // Undo history, selection, and cached geometry all reference the previous
    // items; carrying them across a load corrupts the new script. The
    // clipboard survives intentionally (ids are remapped on paste).
    this.#exitSelectionMode();
    this.#selected.clear();
    this.#undo = [];
    this.#redo = [];
    this.#nodeStates.clear();
    this.#pinUpdateIds.clear();
    this.#debug = [];
    this.#debugPrevious = 0;
    this.items = parsed;
    let nextNodeId = 0;
    this.items.forEach((item: any) => {
      if (typeof item.id === 'number' && Number.isFinite(item.id)) {
        nextNodeId = Math.max(nextNodeId, item.id);
      }
    });
    this.#nextNodeId = nextNodeId + 1;
  }

  reset() {
    this.#connector?.reset();
  }
}
