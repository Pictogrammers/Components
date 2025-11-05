import { Component, Prop, Part, forEach, getProxyValue } from '@pictogrammers/element';

import PgTreeItem from '../treeItem/treeItem';

import template from './tree.html';
import style from './tree.css';

export type SelectedTreeItem = {
  indexes: number[];
  remove: () => void;
  getData: () => any;
  getParentData: () => any;
}

function move(arr, fromIndex, toIndex) {
  const [element] = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
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

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => {
        return PgTreeItem;
      }
    });
    this.$items.addEventListener('action', (e: any) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('action', {
        detail: {
          actionIndex: e.detail.actionIndex,
          item: this.#wrap(e.detail.indexes)
        }
      }));
    });
    this.$items.addEventListener('move', (e: any) => {
      const { indexes, position } = e.detail;
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('move', {
        detail: {
          indexes,
          position
        }
      }));
    });
    this.$items.addEventListener('toggle', (e: any) => {
      const { indexes } = e.detail;
      let item = this.#getItem(indexes);
      item.expanded = !item.expanded;
    });
    this.$items.addEventListener('select', (e: any) => {
      e.stopPropagation();
      const { indexes, type, ctrlKey, shiftKey } = e.detail;
      const item = this.#getItem(indexes);
      const selectedCount = this.#selectedIndexes.size;
      const unproxyItem = getProxyValue(item);
      if (!ctrlKey && selectedCount && !this.#selectedIndexes.has(unproxyItem)) {
        this.#selectedIndexes.forEach((x: any) => this.#getItem(x).selected = false);
        this.#selectedIndexes.clear();
      }
      item.selected = type === 'rename' ? true : !item.selected;
      if (item.selected) {
        this.#selectedIndexes.set(unproxyItem, indexes);
      } else {
        this.#selectedIndexes.delete(unproxyItem);
      }
      // Dispatch Event
      this.dispatchEvent(new CustomEvent('select', {
        detail: {
          items: [...this.#selectedIndexes.values()].map((indexes: any) => {
            return this.#wrap(indexes);
          }),
        }
      }));
    });
    this.$items.addEventListener('keydown', (e: any) => {
      if (e.key === 'Delete') {
        this.#selectedIndexes.forEach((indexes: number[]) => {
          this.#removeItem(indexes);
        });
        this.#selectedIndexes.clear();
      }
    });
    this.$items.addEventListener('itemdragstart', (e: any) => {
      const { indexes, callback, ctrlKey, shiftKey } = e.detail;
      console.log('drag valid', indexes);
      const item = this.#getItem(indexes);
      const unproxyItem = getProxyValue(item);
      if (!ctrlKey && this.#selectedIndexes.size) {
        this.#selectedIndexes.forEach((x: any) => this.#getItem(x).selected = false);
        this.#selectedIndexes.clear();
      }
      item.selected = true;
      this.#selectedIndexes.set(unproxyItem, indexes);
      let count = 0;
      this.#selectedIndexes.forEach((indexes) => {
        const item = this.#getItem(indexes);
        count = this.#getDragCount(item, count);
      });
      callback(count);
      this.$items.classList.toggle('dragging', true);
    });
    this.$items.addEventListener('itemdragend', (e: any) => {
      this.$items.classList.toggle('dragging', false);
    });
    this.$items.addEventListener('itemdropenter', this.#handleDropEnter.bind(this));
  }

  #getDragCount(item, count) {
    count += 1
    if (item.items && item.items.length > 0) {
      item.items.forEach((itm) => {
        count = this.#getDragCount(itm, count);
      });
    }
    return count;
  }

  #handleDropEnter(e: any) {
    const { indexes, callback } = e.detail;
    const excludes = this.#calculateDragExcludes();
    console.log('valid???', indexes, excludes);
    const joined = indexes.join(',') as string;
    const isInvalid = excludes.some(exclude => joined.startsWith(exclude));
    callback(!isInvalid, (dropEffect) => {
      e.dataTransfer.effectAllowed = dropEffect;
    });
  }

  #removeItem(indexes: number[]) {
    const deleteIndex = indexes[indexes.length - 1];
    const tempIndexes = indexes.slice(0, indexes.length - 1);
    const item = tempIndexes.reduce((item: any, index) => {
      return item.items[index];
    }, this);
    item.items.splice(deleteIndex, 1);
  }

  #getItem(indexes: number[]) {
    return indexes.reduce((item: any, index) => {
      return item.items[index];
    }, this);
  }

  /**
   * Appends helper methods for selected
   *
   * @param indexes indexes
   */
  #wrap(indexes: number[]) {
    return {
      indexes,
      remove: () => {
        this.#removeItem(indexes);
        this.#selectedIndexes.clear();
      },
      getData: () => {
        return this.#getItem(indexes);
      },
      getParentData: () => {
        const parent = indexes.slice(0, indexes.length - 1);
        if (parent.length === 0) {
          return this;
        }
        return this.#getItem(parent);
      },
      move: (newIndexes) => {

      }
    }
  }

  render(changes) {
    if (changes.items) {
      console.log('yay', this.items.map(x => x));
    }
  }

  unselect(indexes: number[]) {

  }

  #calculateDragExcludes() {
    const exclude: string[] = [];
    this.#selectedIndexes.forEach((indexes) => {
      exclude.push(indexes.join(','));
    });
    return exclude;
  }
}
