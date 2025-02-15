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

  render(changes) {
    if (changes.items) {
      forEach({
        container: this.$items,
        items: this.items,
        type: (item) => {
          return PgTreeItem;
        },
        create: ($item, item) => {
          // after creation of $item element
        },
        update: ($item, item) => {
          // after every $item update
        },
      });
    }
  }
}
