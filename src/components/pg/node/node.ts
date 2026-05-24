import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgNodeEditorText from '../nodeEditorText/nodeEditorText';

import template from './node.html';
import style from './node.css';

@Component({
  selector: 'pg-node',
  style,
  template,
})
export default class PgNode extends HTMLElement {
  @Prop() x: number = 0;
  @Prop() y: number = 0;
  @Prop() fields: any = [];

  @Part() $node: HTMLDivElement;
  @Part() $items: HTMLDivElement;
  @Part() $header: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.fields,
      type: (item) => PgNodeEditorText,
      create: ($item, item) => {

      },
    });
    this.$header.addEventListener('click', this.#handleSelect.bind(this));
  }

  render(changes: any) {
    if (changes.fields) {

    }
    if (changes.x) {
      this.$node.style.setProperty('left', `${this.x}rem`);
    }
    if (changes.y) {
      this.$node.style.setProperty('top', `${this.y}rem`);
    }
  }

  #handleSelect(e: any) {

  }
}
