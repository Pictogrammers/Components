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
  @Prop() node: number = 0;
  @Prop() fields: any = [];
  // output pins
  @Prop() nodes: any = [];

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
    this.$node.addEventListener('pointerover', this.#handlePointerOver.bind(this));
    this.$node.addEventListener('pointerout', this.#handlePointerOut.bind(this));
  }

  render(changes: any) {
    if (changes.nodes) {
      this.nodes.forEach(({ key, label }: any) => {
        this.dispatchEvent(new CustomEvent('registernode', {
          detail: {
            node: this.node,
            key,
            label,
          }
        }));
      });
    }
    if (changes.x) {
      this.$node.style.setProperty('left', `${this.x}rem`);
    }
    if (changes.y) {
      this.$node.style.setProperty('top', `${this.y}rem`);
    }
  }

  #handleSelect(e: any) {
    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        nodeId: `${this.node}`,
      }
    }));
  }

  #handlePointerOver(e: any) {
    this.$node.classList.toggle('resize', true);
  }

  #handlePointerOut(e: any) {
    this.$node.classList.toggle('resize', false);
  }

  select() {
    this.$node.classList.toggle('selected', true);
  }

  deselect() {
    this.$node.classList.toggle('selected', false);
  }
}
