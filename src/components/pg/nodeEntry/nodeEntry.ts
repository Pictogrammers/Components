import { Component, Prop, Part } from '@pictogrammers/element';

import template from './nodeEntry.html';
import style from './nodeEntry.css';
import PgNodeResize from '../nodeResize/nodeResize';

const ANCHOR_NAME = '--node-entry-resize-anchor';

@Component({
  selector: 'pg-node-entry',
  style,
  template,
})
export default class PgNodeEntry extends HTMLElement {
  @Prop() x: number = 0;
  @Prop() y: number = 0;
  @Prop() width: number = 12;
  @Prop() height: number = 5;
  @Prop() itemId: number = 0;
  @Prop() debug: boolean = false;

  @Part() $node: HTMLDivElement;
  @Part() $header: HTMLDivElement;

  connectedCallback() {
    this.height = this.getMinHeight();
    this.$node.addEventListener('pointerover', this.#handlePointerOver.bind(this));
  }

  render(changes: any) {
    if (changes.x) {
      this.$node.style.setProperty('left', `${this.x}rem`);
    }
    if (changes.y) {
      this.$node.style.setProperty('top', `${this.y}rem`);
    }
    if (changes.width) {
      this.$node.style.setProperty('--pg-node-width', `${this.width}rem`);
    }
    if (changes.height) {
      this.$node.style.setProperty('--pg-node-height', `${this.height}rem`);
    }
    if (changes.debug) {
      this.$node.classList.toggle('debug', this.debug);
    }
    if (this.#resizeElement) {
      if (changes.x) this.#resizeElement.x = this.x;
      if (changes.y) this.#resizeElement.y = this.y;
      if (changes.width) this.#resizeElement.width = this.width;
      if (changes.height) this.#resizeElement.height = this.height;
    }
  }

  #handleSelect(_e: any) {
    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        nodeId: `${this.itemId}`,
      }
    }));
  }

  #resizeElement: PgNodeResize | null = null;
  #handlePointerOver(_e: any) {
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
    ele.minHeight = this.getMinHeight();
    ele.minWidth = this.getMinWidth();
    ele.addEventListener('change', (e: any) => {
      const { x, y, width, height } = e.detail;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      ele.x = x;
      ele.y = y;
      ele.width = width;
      ele.height = height;
      this.dispatchEvent(new CustomEvent('change', { detail: { x, y, width, height } }));
    });
    ele.addEventListener('select', this.#handleSelect.bind(this));
    this.shadowRoot?.appendChild(ele);
    this.#resizeElement = ele;
    this.$node.classList.toggle('resize', true);
  }

  #handlePointerOut(_e: any) {
    this.$node.classList.toggle('resize', false);
    if (this.#resizeElement) {
      this.#resizeElement.style.visibility = 'hidden';
    }
  }

  select() {
    this.$node.classList.toggle('selected', true);
  }

  deselect() {
    this.$node.classList.toggle('selected', false);
  }

  getMinHeight() {
    return 5;
  }

  getMinWidth() {
    return 6;
  }
}
