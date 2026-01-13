import { Component, Prop, Part, forEach } from '@pictogrammers/element';
import PgMenuItem from '../menuItem/menuItem';

import template from './menu.html';
import style from './menu.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-menu',
  style,
  template
})
export default class PgMenu extends HTMLElement {

  @Prop() items: any[] = [];

  @Part() $items: HTMLDivElement;

  connectedCallback() {
    forEach({
      container: this.$items,
      items: this.items,
      type: (item) => {
        return item.type ?? PgMenuItem;
      },
      create: ($item: any, item) => {
        $item.addEventListener('close', (e: any) => {
          const depth = e.detail ? e.detail.depth : 1;
          this.dispatchEvent(new CustomEvent('close', {
            detail: {
              depth
            }
          }));
        });
        $item.addEventListener('select', (e: any) => {
          const { index } = e.detail;
          this.dispatchEvent(new CustomEvent('select', {
            detail: {
              indexes: [index],
              item
            }
          }));
        });
        $item.addEventListener('up', (e: any) => {
          const { index } = e.detail;
          this.#focus(index - 1, -1, index);
        });
        $item.addEventListener('down', (e: any) => {
          const { index } = e.detail;
          this.#focus(index + 1, 1, index);
        });
      }
    });
    this.$items.addEventListener('hasCheck', (e: any) => {
      e.stopPropagation();
      this.$items.classList.toggle('check', true);
    });
  }

  #focus(index, fallback, initIndex) {
    if (index === initIndex) {
      return;
    }
    if (index === -1) {
      return this.#focus(this.items.length - 1, fallback, initIndex);
    }
    if (index >= this.items.length) {
      return this.#focus(0, fallback, initIndex);
    }
    const item = this.$items.children[index] as any;
    if (item.focusable === false || this.items[index].disabled) {
      return this.#focus(index + fallback, fallback, initIndex);
    }
    item?.focus();
  }

  focus(index) {
    if (index === -1) {
      this.#focus(0, 1, this.items.length - 1);
    } else {
      const item = this.$items.children[index] as HTMLElement;
      item?.focus();
    }
  }

  /**
   * Calculate height of items + gap + padding
   * @param startIndex Start index.
   * @param endIndex End index.
   */
  getItemOffset(startIndex, endIndex): number {
    const computedStyle = getComputedStyle(this.$items);
    let height = parseInt(computedStyle.getPropertyValue('padding-top'), 10);
    const total = this.items.length;
    if (startIndex > total || endIndex > total) {
      throw new Error('startIndex or endIndex not within range of items');
    }
    for (let i = startIndex; i < endIndex; i++) {
      const ele = this.$items.children[i] as any;
      height += ele.getHeight();
    }
    return height;
  }

  /**
   * Get the height of an individiaual item.
   * @param index Item index
   * @returns {number} Item height
   */
  getItemHeight(index) {
    if (index > this.items.length) {
      throw new Error('index outside range of items');
    }
    const ele = this.$items.children[index] as any;
    return ele.getHeight();
  }

}
