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
      create: ($item, item) => {
        $item.addEventListener('select', (e: any) => {
          const { index } = e.detail;
          this.dispatchEvent(new CustomEvent('select', {
            detail: { index, item }
          }))
        });
      }
    });
  }

  focus(index) {
    const item = this.$items.children[index] as HTMLElement;
    item?.focus();
  }

  /**
   * Calculate height of items + gap + padding
   * @param startIndex Start index.
   * @param endIndex End index.
   */
  getItemHeight(startIndex, endIndex): number {
    const computedStyle = getComputedStyle(this.$items);
    let height = parseInt(computedStyle.getPropertyValue('padding-top'), 10);
    const total = this.$items.children.length;
    if (startIndex > total || endIndex > total) {
      throw new Error('startIndex or endIndex out of bounds');
    }
    for (let i = startIndex; i < endIndex; i++) {
      const ele = this.$items.children[i] as any;
      height += ele.getHeight();
    }
    return height;
  }

}