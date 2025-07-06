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
      const selectedCount = this.#selected.size;
      const unproxyItem = getProxyValue(item);
      if (!ctrlKey && selectedCount && !this.#selected.has(unproxyItem)) {
        this.#selected.forEach((x: any) => x.selected = false);
        this.#selected.clear();
        this.#selectedIndexes.clear();
      }
      item.selected = type === 'rename' ? true : !item.selected;
      if (item.selected) {
        this.#selected.add(item);
        this.#selectedIndexes.set(unproxyItem, indexes);
      } else {
        this.#selected.delete(item);
        this.#selectedIndexes.delete(unproxyItem);
      }
      // Dispatch Event
      this.dispatchEvent(new CustomEvent('select', {
        detail: {
          items: this.#selected
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
