import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodes.html';
import style from './nodes.css';

@Component({
  selector: 'pg-nodes',
  style,
  template,
})
export default class PgNodes extends HTMLElement {
  @Prop() items: any = [];

  @Part() $canvas: HTMLDivElement;

  connectedCallback() {

  }

  render(changes: any) {

  }
}
