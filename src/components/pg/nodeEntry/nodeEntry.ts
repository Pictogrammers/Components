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
  @Prop() fields: any = [];
  @Prop() debug: boolean = false;

  @Part() $node: HTMLDivElement;
  @Part() $header: HTMLDivElement;
  @Part() $input: HTMLTextAreaElement;

  connectedCallback() {
    // Keep a persisted height when it exceeds the minimum.
    this.height = Math.max(this.height, this.getMinHeight());
    this.$node.addEventListener('pointerover', this.#handlePointerOver.bind(this));
    this.$node.addEventListener('animationend', (e: AnimationEvent) => {
      if (e.animationName === 'pg-node-pulse') {
        this.$node.classList.remove('pulse');
      }
    });
    this.$input.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          id: 0,
          type: 'arg',
          key: 'description',
          value: this.$input.value,
        }
      }));
    });
    this.$input.addEventListener('change', () => {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          id: 0,
          type: 'arg',
          key: 'description',
          value: this.$input.value,
        }
      }));
    });
  }

  render(changes: any) {
    if (changes.fields) {
      const field = this.fields.find((f: any) => f.key === 'description');
      if (field) {
        this.$input.value = field.value ?? '';
      }
    }
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

  #handleSelect(e: any) {
    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        nodeId: this.itemId,
        addToSelection: !!(e?.detail?.shiftKey || e?.detail?.ctrlKey),
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
    return 5;
  }

  getMinWidth() {
    return 6;
  }

  // Blue attention pulse (3 flashes). The host is display: contents, so the
  // positioned $node is what scrolls into view.
  pulse() {
    this.$node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    this.$node.classList.remove('pulse');
    void this.$node.offsetWidth;
    this.$node.classList.add('pulse');
  }
}
