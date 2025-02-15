import { Component, Prop, Part } from '@pictogrammers/element';

import template from './treeItem.html';
import style from './treeItem.css';

@Component({
  selector: 'pg-tree-item',
  style,
  template
})
export default class PgTreeItem extends HTMLElement {

  @Prop() label: string;

  @Part() $label: HTMLDivElement;

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
  }

}
