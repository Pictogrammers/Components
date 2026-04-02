import { Component, Prop, Part } from '@pictogrammers/element';

import template from './node.html';
import style from './node.css';

@Component({
  selector: 'pg-node',
  style,
  template,
})
export default class PgNode extends HTMLElement {
  @Prop() items: any = [];
  @Prop() fields: any = [];

  @Part() $items: HTMLDivElement;

  connectedCallback() {

  }

  render(changes: any) {
    if (changes.fields) {

    }
  }
}
