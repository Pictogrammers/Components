import { Component, Prop, Part, forEach, getProxyValue } from '@pictogrammers/element';

import PgTreeItem from '../treeItem/treeItem';

import template from './tree.html';
import style from './tree.css';

export type SelectedTreeItem = {
  indexes: number[];
  remove: () => void;
  getData: () => any;
  getParentData: () => any;
  move: (item: SelectedTreeItem, position: string) => void;
}

@Component({
  selector: 'pg-tree',
  style,
  template
})
export default class PgTree extends HTMLElement {
  @Prop() items: any[] = [];

  @Part() $items: HTMLDivElement;

  #selectedIndexes = new Map();
  #lastSelectedIndexes: number[] | null = null;
  #draggingElements: Set<HTMLElement> = new Set();

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: () => PgTreeItem
    });
    this.$items.addEventListener('action', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('action', {
        detail: {
          actionIndex: e.detail.actionIndex,
          item: this.#wrap(e.detail.indexes),
        }
      }));
    });
    this.$items.addEventListener('move', (e: any) => {
      e.stopPropagation();
      const selectedIdxsList = [...this.#selectedIndexes.values()] as number[][];
      this.#batchMove(selectedIdxsList, e.detail.indexes, e.detail.position);
      this.dispatchEvent(new CustomEvent('move', {
        detail: { position: e.detail.position }
      }));
      this.#dispatchSelect();
    });
    this.$items.addEventListener('rename', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('rename', {
        detail: {
          item: this.#wrap(e.detail.indexes),
          label: e.detail.label,
        }
      }));
    });
    this.$items.addEventListener('toggle', (e: any) => {
      const item = this.#getItem(e.detail.indexes);
      item.expanded = !item.expanded;
    });
    this.$items.addEventListener('expand', (e: any) => {
      this.#getItem(e.detail.indexes).expanded = true;
    });
    this.$items.addEventListener('menu', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('menu', {
        detail: {
          item: this.#wrap(e.detail.indexes),
          x: e.detail.x,
          y: e.detail.y,
        }
      }));
    });
    this.$items.addEventListener('select', (e: any) => {
      e.stopPropagation();
      const { indexes, type, ctrlKey, shiftKey } = e.detail;
      const item = this.#getItem(indexes);
      const unproxyItem = getProxyValue(item);

      if (shiftKey && this.#lastSelectedIndexes) {
        const visible = this.#getVisibleIndexes();
        const lastPos = visible.findIndex(v => v.join(',') === this.#lastSelectedIndexes!.join(','));
        const currPos = visible.findIndex(v => v.join(',') === indexes.join(','));
        this.#selectedIndexes.forEach((x: any) => this.#getItem(x).selected = false);
        this.#selectedIndexes.clear();
        const start = Math.min(lastPos, currPos);
        const end = Math.max(lastPos, currPos);
        for (let i = start; i <= end; i++) {
          const rangeItem = this.#getItem(visible[i]);
          rangeItem.selected = true;
          this.#selectedIndexes.set(getProxyValue(rangeItem), visible[i]);
        }
      } else {
        if (!ctrlKey && this.#selectedIndexes.size && !this.#selectedIndexes.has(unproxyItem)) {
          this.#selectedIndexes.forEach((x: any) => this.#getItem(x).selected = false);
          this.#selectedIndexes.clear();
        }
        item.selected = type === 'rename' ? true : !item.selected;
        if (item.selected) {
          this.#selectedIndexes.set(unproxyItem, indexes);
          this.#lastSelectedIndexes = indexes;
        } else {
          this.#selectedIndexes.delete(unproxyItem);
        }
      }

      this.#dispatchSelect();
    });
    this.$items.addEventListener('up', (e: any) => {
      e.stopPropagation();
      const visible = this.#getVisibleIndexes();
      const idx = visible.findIndex(v => v.join(',') === e.detail.indexes.join(','));
      if (idx > 0) {
        this.#focusItem(visible[idx - 1]);
      }
    });
    this.$items.addEventListener('down', (e: any) => {
      e.stopPropagation();
      const visible = this.#getVisibleIndexes();
      const idx = visible.findIndex(v => v.join(',') === e.detail.indexes.join(','));
      if (idx < visible.length - 1) {
        this.#focusItem(visible[idx + 1]);
      }
    });
    this.$items.addEventListener('keydown', (e: any) => {
      if (e.key === 'Escape') {
        this.#selectedIndexes.forEach((idxs: any) => this.#getItem(idxs).selected = false);
        this.#selectedIndexes.clear();
        this.#lastSelectedIndexes = null;
        this.#dispatchSelect();
      } else if (e.key === 'Delete') {
        const toRemove = [...this.#selectedIndexes.values()] as number[][];
        // Remove higher sibling indexes first to avoid index shifts
        toRemove.sort((a, b) => {
          for (let i = 0; i < Math.max(a.length, b.length); i++) {
            const ai = i < a.length ? a[i] : -1;
            const bi = i < b.length ? b[i] : -1;
            if (ai !== bi) return bi - ai;
          }
          return 0;
        });
        toRemove.forEach((indexes: number[]) => this.#removeItem(indexes));
        this.#selectedIndexes.clear();
        this.#lastSelectedIndexes = null;
        this.#dispatchSelect();
      }
    });
    this.$items.addEventListener('itemdragstart', (e: any) => {
      const { indexes, callback, ctrlKey } = e.detail;
      const item = this.#getItem(indexes);
      const unproxyItem = getProxyValue(item);
      if (!ctrlKey && this.#selectedIndexes.size && !this.#selectedIndexes.has(unproxyItem)) {
        this.#selectedIndexes.forEach((x: any) => this.#getItem(x).selected = false);
        this.#selectedIndexes.clear();
      }
      item.selected = true;
      this.#selectedIndexes.set(unproxyItem, indexes);
      let count = 0;
      this.#selectedIndexes.forEach((idxs: any) => {
        count = this.#getDragCount(this.#getItem(idxs), count);
      });
      callback(count);
      this.#draggingElements.clear();
      this.#selectedIndexes.forEach((idxs: any) => {
        const el = this.#getItemElement(idxs) as any;
        if (el) {
          el.$item.classList.add('dragging');
          el.$items.classList.add('dragging');
          this.#draggingElements.add(el.$item);
          this.#draggingElements.add(el.$items);
        }
      });
      this.$items.classList.toggle('dragging', true);
      this.#dispatchSelect();
    });
    this.$items.addEventListener('itemdragend', () => {
      this.#draggingElements.forEach(el => el.classList.remove('dragging'));
      this.#draggingElements.clear();
      this.$items.classList.toggle('dragging', false);
      this.#clearDropHighlights(this.$items);
    });
    this.$items.addEventListener('itemdropenter', this.#handleDropEnter.bind(this));
  }

  #getDragCount(item: any, count: number): number {
    count += 1;
    if (item.items?.length) {
      item.items.forEach((itm: any) => {
        count = this.#getDragCount(itm, count);
      });
    }
    return count;
  }

  #handleDropEnter(e: any) {
    const { indexes, callback } = e.detail;
    const excludes = this.#calculateDragExcludes();
    const joined = indexes.join(',') as string;
    // Use comma-terminated prefix to prevent "0,1" from matching "0,10"
    const isInvalid = excludes.some(ex => joined === ex || joined.startsWith(ex + ','));
    callback(!isInvalid);
  }

  #removeItem(indexes: number[]) {
    const deleteIndex = indexes[indexes.length - 1];
    const parentIndexes = indexes.slice(0, indexes.length - 1);
    const parent = parentIndexes.reduce((acc: any, i) => acc.items[i], this);
    parent.items.splice(deleteIndex, 1);
  }

  #getItem(indexes: number[]) {
    return indexes.reduce((acc: any, i) => acc.items[i], this);
  }

  #getItemElement(indexes: number[]): PgTreeItem | null {
    let container: HTMLElement = this.$items;
    let element: PgTreeItem | null = null;
    for (const i of indexes) {
      element = container.children[i] as PgTreeItem;
      if (!element) return null;
      container = (element as any).$items;
      if (!container) return null;
    }
    return element;
  }

  #focusItem(indexes: number[]) {
    const element = this.#getItemElement(indexes);
    if (element) {
      (element as any).$labelButton.focus();
    }
  }

  #getVisibleIndexes(): number[][] {
    const result: number[][] = [];
    const traverse = (items: any[], prefix: number[]) => {
      items.forEach((item: any, i: number) => {
        const indexes = [...prefix, i];
        result.push(indexes);
        if (item.expanded && item.items?.length) {
          traverse(item.items, indexes);
        }
      });
    };
    traverse(this.items, []);
    return result;
  }

  #clearDropHighlights(container: HTMLElement) {
    Array.from(container.children).forEach((child: any) => {
      if (child.$dropabove) {
        child.$dropabove.classList.remove('drop');
        child.$dropon.classList.remove('drop');
        child.$dropbelow.classList.remove('drop');
      }
      if (child.$items) {
        this.#clearDropHighlights(child.$items);
      }
    });
  }

  #batchMove(selectedIdxsList: number[][], targetIdxs: number[], position: string) {
    if (selectedIdxsList.length === 0) return;

    // Ascending order preserves the original relative order of dragged items on insertion
    const ascending = [...selectedIdxsList].sort((a, b) => {
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const av = i < a.length ? a[i] : -1;
        const bv = i < b.length ? b[i] : -1;
        if (av !== bv) return av - bv;
      }
      return 0;
    });

    // Capture data references before any structural changes
    const caches = ascending.map(idxs => this.#getItem(idxs));

    // Count how many selected siblings precede the target — each one shifts its index down after removal
    const targetParentStr = targetIdxs.slice(0, -1).join(',');
    let targetShift = 0;
    for (const sidxs of ascending) {
      if (sidxs.slice(0, -1).join(',') === targetParentStr &&
          sidxs[sidxs.length - 1] < targetIdxs[targetIdxs.length - 1]) {
        targetShift++;
      }
    }
    const adjustedTargetIdxs = [
      ...targetIdxs.slice(0, -1),
      targetIdxs[targetIdxs.length - 1] - targetShift
    ];

    // Remove descending so higher sibling indexes don't shift lower ones mid-loop
    [...ascending].reverse().forEach(idxs => this.#removeItem(idxs));

    // Rebuild selection map with post-move positions so items stay selected
    this.#selectedIndexes.clear();
    this.#lastSelectedIndexes = null;

    if (position === 'on') {
      const targetData = this.#getItem(adjustedTargetIdxs);
      const prevLen = Array.isArray(targetData.items) ? targetData.items.length : 0;
      if (!Array.isArray(targetData.items)) targetData.items = [];
      caches.forEach((cache, i) => {
        targetData.items.push(cache);
        const newIdxs = [...adjustedTargetIdxs, prevLen + i];
        this.#selectedIndexes.set(getProxyValue(this.#getItem(newIdxs)), newIdxs);
      });
      targetData.expanded = true;
    } else {
      const adjustedParent = adjustedTargetIdxs.slice(0, -1);
      const adjustedIdx = adjustedTargetIdxs[adjustedTargetIdxs.length - 1];
      const insertAt = position === 'after' ? adjustedIdx + 1 : adjustedIdx;
      if (adjustedParent.length === 0) {
        this.items.splice(insertAt, 0, ...caches);
      } else {
        this.#getItem(adjustedParent).items.splice(insertAt, 0, ...caches);
      }
      caches.forEach((_, i) => {
        const newIdxs = [...adjustedParent, insertAt + i];
        this.#selectedIndexes.set(getProxyValue(this.#getItem(newIdxs)), newIdxs);
      });
    }

    this.$items.classList.toggle('dragging', false);
  }

  #wrap(indexes: number[]): SelectedTreeItem {
    return {
      indexes,
      remove: () => {
        this.#removeItem(indexes);
        this.#selectedIndexes.clear();
        this.#lastSelectedIndexes = null;
        this.#dispatchSelect();
      },
      getData: () => this.#getItem(indexes),
      getParentData: () => {
        const parent = indexes.slice(0, indexes.length - 1);
        return parent.length === 0 ? this : this.#getItem(parent);
      },
      move: (item: SelectedTreeItem, position: string) => {
        this.#batchMove([indexes], item.indexes, position);
        this.#dispatchSelect();
      }
    };
  }

  unselect(indexes: number[]) {
    const item = this.#getItem(indexes);
    const unproxyItem = getProxyValue(item);
    item.selected = false;
    this.#selectedIndexes.delete(unproxyItem);
    this.#dispatchSelect();
  }

  unselectAll() {
    this.#selectedIndexes.forEach((idxs: any) => this.#getItem(idxs).selected = false);
    this.#selectedIndexes.clear();
    this.#dispatchSelect();
  }

  #dispatchSelect() {
    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        items: [...this.#selectedIndexes.values()].map((idxs: any) => this.#wrap(idxs)),
      }
    }));
  }

  #calculateDragExcludes(): string[] {
    const exclude: string[] = [];
    this.#selectedIndexes.forEach((indexes: number[]) => {
      exclude.push(indexes.join(','));
    });
    return exclude;
  }
}
