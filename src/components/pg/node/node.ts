import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from './node.html';
import style from './node.css';
import PgNodeResize from '../nodeResize/nodeResize';
import PgNodeOutput from '../nodeOutput/nodeOutput';

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
  @Prop() itemId: number = 0;
  @Prop() label: string = '';
  @Prop() fields: any = [];
  @Prop() outputs: any = [];
  @Prop() debug: boolean = false;
  @Prop() editors: any = [];

  @Part() $node: HTMLDivElement;
  @Part() $items: HTMLDivElement;
  @Part() $outputs: HTMLDivElement;
  @Part() $header: HTMLDivElement;

  connectedCallback() {
    this.height = 2;
    forEach({
      container: this.$items,
      items: this.fields,
      type: (item) => {
        return this.editors.find(x => x.type === item.type);
      },
      create: ($item: any, item) => {
        this.height += $item.height;
        $item.addEventListener('input', (e: any) => {
          this.dispatchEvent(new CustomEvent('input', {
            detail: {
              type: 'arg',
              id: this.itemId,
              key: item.itemKey,
              value: e.detail.value,
            }
          }));
        });
        $item.addEventListener('change', (e: any) => {
          this.dispatchEvent(new CustomEvent('change', {
            detail: {
              type: 'arg',
              id: this.itemId,
              key: item.itemKey,
              value: e.detail.value,
            }
          }));
        });
      },
    });

    forEach({
      container: this.$outputs,
      items: this.outputs,
      type: (item) => {
        return item.key === 'then' ? null : PgNodeOutput;
      },
      create: ($item: PgNodeOutput, _item) => {
        this.height += $item.height;
      },
      connect: ($item: any, item) => {
        const top = this.$node.getBoundingClientRect().top;
        this.dispatchEvent(new CustomEvent('registernodeoutput', {
          detail: {
            node: this.itemId,
            key: item.key,
            label: item.label,
            offset: $item.getBoundingClientRect().top - top + 31,
          }
        }));
      },
    });
    this.$node.addEventListener('pointerover', this.#handlePointerOver.bind(this));
  }

  render(changes: any) {
    if (changes.outputs) {
      this.outputs.forEach(({ key, label }: any) => {
        this.dispatchEvent(new CustomEvent('registernode', {
          detail: {
            node: this.itemId,
            key,
            label,
          }
        }));
      });
    }
    if (changes.label) {
      this.$header.textContent = this.label;
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
        nodeId: this.itemId,
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
      this.dispatchEvent(new CustomEvent('change', { detail: { type: 'transform', x, y, width, height } }));
    });
    ele.addEventListener('dragstart', () => {
      this.dispatchEvent(new CustomEvent('nodedragstart', { detail: { nodeId: this.itemId } }));
    });
    ele.addEventListener('dragmove', (e: any) => {
      this.dispatchEvent(new CustomEvent('nodedragmove', { detail: e.detail }));
    });
    ele.addEventListener('dragend', (e: any) => {
      const { dx, dy, complete } = e.detail;
      this.dispatchEvent(new CustomEvent('nodedragend', { detail: { nodeId: this.itemId } }));
      // Only commit when the node actually landed on a new grid position.
      if (!complete || (dx === 0 && dy === 0)) return;
      this.x += dx;
      this.y += dy;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { type: 'transform', x: this.x, y: this.y, width: this.width, height: this.height, final: true },
      }));
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
    return Array.from(this.$items.children).reduce((val, $item: any) => {
      return val + $item.height;
    }, 2);
  }

  getMinWidth() {
    return 6;
  }
}
