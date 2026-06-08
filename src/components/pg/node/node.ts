import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import PgNodeEditorText from '../nodeEditorText/nodeEditorText';

import template from './node.html';
import style from './node.css';
import PgNodeResize from '../nodeResize/nodeResize';

const ANCHOR_NAME = '--node-resize-anchor';

@Component({
  selector: 'pg-node',
  style,
  template,
})
export default class PgNode extends HTMLElement {
  @Prop() x: number = 0;
  @Prop() y: number = 0;
  @Prop() width: number = 12;
  @Prop() height: number = 3;
  @Prop() node: number = 0;
  @Prop() fields: any = [];
  // output pins
  @Prop() nodes: any = [];

  @Part() $node: HTMLDivElement;
  @Part() $items: HTMLDivElement;
  @Part() $header: HTMLDivElement;

  connectedCallback() {
    this.height = 2;
    forEach({
      container: this.$items,
      items: this.fields,
      type: (item) => PgNodeEditorText,
      create: ($item: PgNodeEditorText, item) => {
        this.height += $item.height;
      },
    });
    this.$header.addEventListener('click', this.#handleSelect.bind(this));
    this.$node.addEventListener('pointerover', this.#handlePointerOver.bind(this));
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
      this.style.setProperty('left', `${this.x}rem`);
    }
    if (changes.y) {
      this.style.setProperty('top', `${this.y}rem`);
    }
    if (changes.width) {
      this.style.setProperty('--pg-node-width', `${this.width}rem`);
    }
    if (changes.height) {
      this.style.setProperty('--pg-node-height', `${this.height}rem`);
    }
  }

  #handleSelect(e: any) {
    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        nodeId: `${this.node}`,
      }
    }));
  }

  #resizeElement;
  #handlePointerOver(e: any) {
    if (this.#resizeElement) {
      this.#resizeElement.style.visibility = 'visible';
      return;
    }
    // @ts-ignore
    this.$node.style.anchorName = ANCHOR_NAME;
    const ele = document.createElement('pg-node-resize') as PgNodeResize;
    ele.addEventListener('pointerout', this.#handlePointerOut.bind(this));
    ele.style.setProperty('position-anchor', ANCHOR_NAME);
    ele.x = this.x;
    ele.y = this.y;
    ele.width = this.width;
    ele.height = this.height;
    ele.addEventListener('change', (e: any) => {
      const { x, y, width, height } = e.detail;
      console.log(x, y, width, height);
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    });
    this.shadowRoot?.appendChild(ele);
    this.#resizeElement = ele;
    this.$node.classList.toggle('resize', true);
  }

  #handlePointerOut(e: any) {
    this.$node.classList.toggle('resize', false);
    this.#resizeElement.style.visibility = 'hidden';
  }

  select() {
    this.$node.classList.toggle('selected', true);
  }

  deselect() {
    this.$node.classList.toggle('selected', false);
  }
}
