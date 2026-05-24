import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from './nodeEntry.html';
import style from './nodeEntry.css';

@Component({
  selector: 'pg-node-entry',
  style,
  template,
})
export default class PgNodeEntry extends HTMLElement {
  @Prop() x: number = 0;
  @Prop() y: number = 0;
  @Prop() node: number = 0;
  // output pins
  @Prop() nodes: any = [];

  @Part() $node: HTMLDivElement;
  @Part() $items: HTMLDivElement;
  @Part() $header: HTMLDivElement;

  connectedCallback() {
    this.$header.addEventListener('click', this.#handleSelect.bind(this));
  }

  render(changes: any) {
    if (changes.nodes) {
      this.nodes.forEach(({ key, label }: any) => {
        this.dispatchEvent(new CustomEvent('registernode', {
          detail: {
            node: `${this.node}`,
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
}
