import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from './tree.html';
import style from './tree.css';
import PgTreeItem from '../treeItem/treeItem';

@Component({
  selector: 'pg-tree',
  style,
  template
})
export default class PgTree extends HTMLElement {
  @Prop() items: any[] = [];

  @Part() $items: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => {
        return PgTreeItem;
      }
    });
    this.addEventListener('toggle', (e: any) => {
      const { indexes } = e.detail;
      let item = this.#getItem(indexes);
      item.expanded = !item.expanded;
    })
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
}
