import { Component, Prop, Part, forEach, getProxyValue } from '@pictogrammers/element';

import PgTreeItem from '../treeItem/treeItem';

import template from './tree.html';
import style from './tree.css';

@Component({
  selector: 'pg-tree',
  style,
  template
})
export default class PgTree extends HTMLElement {
  @Prop() items: any[] = [];

  @Part() $items: HTMLDivElement;

  #selected = new Set();
  #selectedIndexes = new Map();

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => {
        return PgTreeItem;
      }
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
          items: Array.from(this.#selectedIndexes).map(([key, value]) => {
            return this.#getItem(value);
          })
        }
      }));
    });
    this.$items.addEventListener('keydown', (e: any) => {
      if (e.key === 'Delete') {
        this.items[0].items.pop();
        /*this.#selected.forEach((item: any) => {
          const ind = this.#selectedIndexes.get(item);
          ind.reduce((item: any, index, i) => {
            console.log(item.item, index, i, ind.length, arguments);
            if (i === ind.length - 1) {
              item.items.pop();
              //item.items.slice(index, 1);
              return;
            }
            return item.items[index];
          }, this);
        });*/
      }
    });
    this.addEventListener('itemdragstart', (e: any) => {
      const { indexes, callback, ctrlKey, shiftKey } = e.detail;
      console.log('testing', indexes);
      const item = this.#getItem(indexes);
      const unproxyItem = getProxyValue(item);
      if (!ctrlKey && this.#selectedIndexes.size) {
        this.#selectedIndexes.forEach((x: any) => this.#getItem(x).selected = false);
        this.#selectedIndexes.clear();
      }
      item.selected = true;
      this.#selectedIndexes.set(unproxyItem, indexes);
      callback(this.#selectedIndexes.size);
    });
  }

  #getItem(indexes: number[]) {
    return indexes.reduce((item: any, index) => {
      return item.items[index];
    }, this);
  }

  render(changes) {
    if (changes.items) {
      console.log('yay', this.items.map(x => x));
    }
  }

  unselect(indexes: number[]) {

  }
}
