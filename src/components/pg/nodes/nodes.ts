import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgNode from '../node/node';

import template from './nodes.html';
import style from './nodes.css';

@Component({
  selector: 'pg-nodes',
  style,
  template,
})
export default class PgNodes extends HTMLElement {
  @Prop() items: any = [];

  @Part() $items: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => PgNode,
      create: ($item, item) => {

      },
    });
  }

  render(changes: any) {

  }
}
